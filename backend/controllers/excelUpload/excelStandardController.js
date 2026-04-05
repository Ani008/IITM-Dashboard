import XLSX from "xlsx";
import Standard from "../../models/Standard.js";
import Counter from "../../models/Counter.js";

// Helper to handle Excel's quirky date formats safely
const safeParseDate = (dateInput) => {
  if (!dateInput) return null;
  const date = new Date(dateInput);
  return isNaN(date.getTime()) ? null : date;
};

export const importStandardsExcel = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ 
        success: false, 
        message: "Excel file required" 
      });
    }

    // Read the file from the buffer (provided by multer)
    const workbook = XLSX.read(req.file.buffer, { type: "buffer" });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json(sheet);

    if (rows.length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: "The Excel file is empty" 
      });
    }

    // 1. ATOMIC COUNTER UPDATE
    // Since insertMany bypasses the .pre('save') hook, we handle the sequence here.
    const counter = await Counter.findByIdAndUpdate(
      { _id: "icnNumber" },
      { $inc: { sequence_value: rows.length } },
      { new: true, upsert: true }
    );

    // Calculate starting point for this batch
    let currentIcn = counter.sequence_value - rows.length;

    // 2. MAPPING THE DATA (Matching your specific column names)
    const formattedData = rows.map((row) => {
      currentIcn++; 
      
      return {
        icnNumber: currentIcn, 
        requisition_no: String(row["Req No."] || "").trim(),
        requisition_date: safeParseDate(row["Req Date"]),
        pr_no: String(row["PR number"] || "").trim(),
        po_no: String(row["PO Number"] || "").trim(),
        amount: Number(row["Amount"]) || 0,
        department: String(row["Department"] || "General").trim(),
        standardNumber: String(row["Standard Number"] || "").trim(),
        status: row["Status"] || "Active",
        accnNumber: String(row["ACCN Number"] || "").trim(),
        title: String(row["Title"] || "").trim(),
        publisher: String(row["Publisher"] || "").trim(),
        oldIcnNumber: String(row["OLD ICN No."] || "").trim(),
        date_received: safeParseDate(row["Date Sent To Dept"]),
        summary: String(row["Summary / Remarks"] || "").trim(),
      };
    });

    // 3. BULK INSERT
    let inserted = 0;
    let skipped = [];

    try {
      // ordered: false allows valid rows to be saved even if some fail (e.g. duplicates)
      const result = await Standard.insertMany(formattedData, { ordered: false });
      inserted = result.length;
    } catch (err) {
      if (err.writeErrors) {
        skipped = err.writeErrors.map((e) => ({
          row: e.index,
          error: e.errmsg,
        }));
        inserted = formattedData.length - skipped.length;
      } else {
        throw err;
      }
    }

    res.json({
      success: true,
      message: "Import completed successfully 🚀",
      inserted,
      skippedCount: skipped.length,
      skippedDetails: skipped,
    });

  } catch (error) {
    console.error("IMPORT ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error during import",
    });
  }
};