import xlsx from "xlsx";
import Periodical from "../../models/Periodical.js";

export const importPeriodicalsExcel = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const workbook = xlsx.read(req.file.buffer, { type: "buffer" });

    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];

    const data = xlsx.utils.sheet_to_json(sheet);

    const formattedData = data.map((row) => {
      // Create a new object with trimmed/lowercase keys to avoid header mismatches
      const cleanRow = {};
      Object.keys(row).forEach((key) => {
        cleanRow[key.trim()] = row[key];
      });

      return {
        title: cleanRow["Title"],
        subtitle: cleanRow["Subtitle"],
        authors: cleanRow["Authors"]
          ? cleanRow["Authors"].split(",").map((a) => a.trim())
          : [],
        publisher: cleanRow["Publisher"],
        issn: cleanRow["ISSN"],
        volume: cleanRow["Vol"],
        issue: cleanRow["Issue"],
        periodicalMonth: cleanRow["Month"],
        periodicalYear: cleanRow["Year"],
        series: cleanRow["Series"],
        frequency: cleanRow["Frequency"],
        notes: cleanRow["Notes"],
        subscriptionDate: cleanRow["Subscription Date"],
        receiptDate: cleanRow["Receipt Date"],
        department: cleanRow["Department"],
        departmentIssueDate: cleanRow["Department Issue Date"],
        addOnCopies: cleanRow["Add on Copies"],
        language: cleanRow["Language"],
        orderNumber: cleanRow["Order No"],
        poNumber: cleanRow["PO No"],
        mode: cleanRow["Mode"],
        name: cleanRow["Vendor Name"],
        phone: cleanRow["Vendor Phone"],
        email: cleanRow["Vendor Email"],
        currency: cleanRow["Currency"],
        amount: cleanRow["Amount"],
        remarksForPayment: cleanRow["Remarks for Payment"],
        url: cleanRow["URL"],
        status: cleanRow["Status"] || "Draft",
      };
    });

    await Periodical.insertMany(formattedData);

    res.status(200).json({
      message: "Excel uploaded successfully",
      recordsInserted: formattedData.length,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error uploading Excel",
      error: error.message,
    });
  }
};
