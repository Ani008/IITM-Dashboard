import XLSX from "xlsx";
import KCMember from "../../models/KCMembers.js";

/**
 * Helper to handle Excel date variations (" - ", empty strings, or actual dates)
 */
const formatDate = (val) => {
    if (!val || val === " - " || (typeof val === "string" && val.trim() === "-") || val === "") {
        return null;
    }
    const date = new Date(val);
    return isNaN(date.getTime()) ? null : date;
};

export const importKCMembers = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: "No file uploaded." });
        }

        // Read the buffer from Multer
        const workbook = XLSX.read(req.file.buffer, { type: 'buffer', cellDates: true });
        const sheetName = workbook.SheetNames[0];
        const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

        console.log(`Processing ${sheetData.length} rows from sheet: ${sheetName}`);

        let successCount = 0;
        let errorCount = 0;
        let errorDetails = [];

        for (let i = 0; i < sheetData.length; i++) {
            const row = sheetData[i];
            
            try {
                // 1. SKIP EMPTY ROWS: Use 'Name of Institution' as the anchor
                const instName = row['Name of Institution'] || row['institutionName'];
                if (!instName) continue;

                // 2. NORMALIZE MEMBERSHIP TYPE (Enum Alignment)
                // Excel "Subscription Type" -> Model "membershipType"
                let rawMType = (row['Subscription Type'] || '').toString().trim();
                
                // Critical Fix: Map "Automotive Abstracts" (Excel) to "Automotive Abstract" (Model Enum)
                if (rawMType === "Automotive Abstracts") {
                    rawMType = "Automotive Abstract";
                }

                // 3. NORMALIZE SUBSCRIPTION TYPE (For the pre-save hook)
                // Excel "Membership Type" -> Model "subscriptionType"
                const rawSType = (row['Membership Type'] || '').toString().trim();

                // 4. PREPARE THE DATA OBJECT
                const memberData = {
                    institutionName: instName.toString().trim(),
                    membershipType: rawMType,   // Must match ['Automotive Abstract', 'KC Membership Option 1', etc.]
                    subscriptionType: rawSType, // e.g., 'Exchange', 'Subscribers', 'Educational'
                    
                    contactPerson: (row['Contact Person'] || '').toString().trim(),
                    designation: (row['Designation'] || '').toString().trim(),
                    completeAddress: (row['Complete Address'] || '').toString().trim(),
                    email: (row['Email Address'] || '').toString().trim().toLowerCase(),
                    phone: (row['Phone'] || '').toString().trim(),
                    website: (row['Website'] || '').toString().trim(),
                    
                    // Use the date formatter to handle " - "
                    membershipStartDate: formatDate(row['Start Date']),
                    membershipEndDate: formatDate(row['End Date']),
                    lastPaymentDate: formatDate(row['Late Payment Date']),
                    
                    fees: row['Fees Amount'] ? parseFloat(row['Fees Amount']) : null,
                    
                    // Enum validation for Status
                    membershipStatus: ['Active', 'Inactive'].includes(row['Membership Status']) 
                        ? row['Membership Status'] 
                        : 'Active',
                    
                    // Handle 'Notes ' with potential trailing space in header
                    notes: (row['Notes '] || row['Notes'] || '').toString().trim()
                };

                // 5. SAVE TO DB
                // The pre-save hook in your model will now correctly generate membershipId 
                // because membershipType and subscriptionType are cleaned.
                const newMember = new KCMember(memberData);
                await newMember.save();
                successCount++;

            } catch (rowError) {
                errorCount++;
                console.error(`Error at Row ${i + 2}:`, rowError.message);
                errorDetails.push({
                    row: i + 2,
                    institution: row['Name of Institution'],
                    error: rowError.message
                });
            }
        }

        return res.status(200).json({
            success: true,
            message: `Import Finished. Success: ${successCount}, Failed: ${errorCount}`,
            errors: errorDetails.length > 0 ? errorDetails : null
        });

    } catch (error) {
        console.error("Critical System Error:", error);
        return res.status(500).json({ success: false, message: "System Error: " + error.message });
    }
};