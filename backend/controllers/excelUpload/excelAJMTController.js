const AJMTPaper = require("../../models/AJMTPaper"); // Adjust path as needed
const xlsx = require("xlsx");
// Add this helper function at the top of your controller file
const parseExcelDate = (dateValue) => {
  if (!dateValue) return null;

  // If Excel already converted it to a Date object, just return it
  if (dateValue instanceof Date) return dateValue;

  // If it's a string like "20-06-2022" or "20/06/2022"
  if (typeof dateValue === "string") {
    const parts = dateValue.split(/[-/]/); // Splits by - or /
    if (parts.length === 3) {
      // Re-arrange DD-MM-YYYY to YYYY-MM-DD
      const day = parts[0];
      const month = parts[1];
      const year = parts[2];
      return new Date(`${year}-${month}-${day}`);
    }
  }

  return dateValue; // Return as is if format is unknown
};

const importAJMTPapers = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Please upload an excel file" });
    }

    // 1. Read the Excel File
    const workbook = xlsx.read(req.file.buffer, {
      type: "buffer",
      cellDates: true,
    });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];

    // Convert to JSON - defval: null ensures we don't skip empty columns
    const data = xlsx.utils.sheet_to_json(sheet, { defval: null });

    console.log(`Total records found in Excel: ${data.length}`);

    const importedRecords = [];
    const errors = [];

    // 2. Map each row to the Model
    for (let i = 0; i < data.length; i++) {
      const row = data[i];

      try {
        // Handle Multiple Authors (Splitting comma-separated strings)
        const authorNames = (row["Name of the Author/s"] || "")
          .split(",")
          .map((s) => s.trim());
        const authorEmails = (row["Author Email"] || "")
          .split(",")
          .map((s) => s.trim());
        const authorPhones = (row["Phone"] || "")
          .split(",")
          .map((s) => s.trim());

        const authorsArray = authorNames.map((name, index) => ({
          authorName: name || null,
          authorEmail: authorEmails[index] || null,
          authorPhone: authorPhones[index] || null,
          authorInstitution: row["Institution"] || null,
          authorAddress: row["Full Address"] || null,
          authorCity: row["City"] || null,
        }));

        // Handle Reviewers (Mapping columns 1, 2, and 3)
        const reviewersArray = [];
        if (row["Name of 1st Reviewer"] || row["1st Reviewer Email"]) {
          reviewersArray.push({
            reviewerNumber: 1,
            reviewerName: row["Name of 1st Reviewer"],
            reviewerEmail: row["1st Reviewer Email"],
          });
        }
        if (row["Name of 2nd Reviewer"] || row["2nd Reviewer Email"]) {
          reviewersArray.push({
            reviewerNumber: 2,
            reviewerName: row["Name of 2nd Reviewer"],
            reviewerEmail: row["2nd Reviewer Email"],
          });
        }
        if (row["Name of 3rd Reviewer"] || row["3rd Reviewer Email"]) {
          reviewersArray.push({
            reviewerNumber: 3,
            reviewerName: row["Name of 3rd Reviewer"],
            reviewerEmail: row["3rd Reviewer Email"],
          });
        }

        // Create the Paper Object
        const newPaper = new AJMTPaper({
          uniqueId: row["Unique ID"],
          paperTitle: row["Title"] || null,
          titleSubject: row["Title Subject"] || null,
          paperType: row["Paper Type"] || null,
          date: parseExcelDate(row["Submission Date"]),
          plagiarismPercentage: row["Plagiarism Percentage"] || 0,
          status: row["Status"] || "Draft",
          websiteUpdateDate: parseExcelDate(row["Website Update Date"]),
          remarks: row["Remarks"] || null,
          authors: authorsArray,
          reviewers: reviewersArray,
        });

        await newPaper.save();
        importedRecords.push(newPaper._id);
      } catch (rowError) {
        console.error(`Error at Row ${i + 2}:`, rowError.message);
        errors.push({ row: i + 2, error: rowError.message });
      }
    }

    // 3. Final Report
    console.log("--- Import Summary ---");
    console.log(`Successfully Imported: ${importedRecords.length}`);
    console.log(`Failed Records: ${errors.length}`);

    res.status(200).json({
      message: "Import process completed",
      total: data.length,
      successCount: importedRecords.length,
      errors: errors,
    });
  } catch (globalError) {
    console.error("Critical Controller Error:", globalError);
    res
      .status(500)
      .json({
        message: "Server Error during import",
        error: globalError.message,
      });
  }
};

module.exports = { importAJMTPapers };
