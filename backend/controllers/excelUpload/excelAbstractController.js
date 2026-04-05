import xlsx from "xlsx";
import Abstract from "../../models/Abstract.js";

export const importAbstractsExcel = async (req, res) => {
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
        authors: cleanRow["Authors"]
          ? cleanRow["Authors"].split(",").map((a) => a.trim())
          : [],
        // Check if the Excel header is "Journal Name" or just "Journal"
        journal: cleanRow["Journal Name"] || cleanRow["Journal"],
        subject: cleanRow["Subject"],
        keyword: cleanRow["Keywords"]
          ? cleanRow["Keywords"].split(",").map((k) => k.trim())
          : [],
        volume: cleanRow["Vol"],
        issue: cleanRow["Issue"],
        year: cleanRow["Year"],
        publicationMonth: cleanRow["Pub Month"],
        source: cleanRow["Source"],
        publishedInAA: cleanRow["Published In AA"], // Note: Check 'In' vs 'in' (Capitalization)
        summary: cleanRow["Summary"],
        url: cleanRow["URL"],
        status: cleanRow["Status"] || "Draft",
      };
    });

    await Abstract.insertMany(formattedData);

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
