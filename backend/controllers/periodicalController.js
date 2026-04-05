const Periodical = require("../models/Periodical");

// Get all periodicals
exports.getAllPeriodicals = async (req, res, next) => {
  try {
      console.log("SEARCH VALUE:", req.query.search);
  
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 5;
      const skip = (page - 1) * limit;
  
      // 2️⃣ Extract filters
      const { search, frequency, language, status } = req.query;
  
      // 3️⃣ Build dynamic query object
      const query = {};
  
      // 🔎 Global search (ICN, Standard No, Title)
      if (search && search.trim() !== "") {
        const searchValue = search.trim();
  
        query.$or = [
          { title: { $regex: searchValue, $options: "i" } },
          { publisher: { $regex: searchValue, $options: "i" } },
          { icnNumber: { $regex: searchValue, $options: "i" } },
        ];
  
        // If search is a number, also match icnNumber exactly
        if (!isNaN(searchValue)) {
          query.$or.push({ icnNumber: Number(searchValue) });
        }
      }
  
      if (frequency) query.frequency = frequency;
      if (language) query.language = language;
      if (status) query.status = status;
  
      // 4️⃣ Get total filtered count
      const totalRecords = await Periodical.countDocuments(query);
  
      // 5️⃣ Fetch paginated filtered records
      const periodicals = await Periodical.find(query)
        .sort({ icnNumber: -1 })
        .skip(skip)
        .limit(limit);
  
      // 6️⃣ Send response
      res.json({
        success: true,
        currentPage: page,
        totalPages: Math.ceil(totalRecords / limit),
        totalRecords,
        count: periodicals.length,
        data: periodicals,
      });
    } catch (error) {
      next(error);
    }
};

// Get single periodical
exports.getPeriodicalById = async (req, res, next) => {
  try {
    const periodical = await Periodical.findById(req.params.id);

    if (!periodical) {
      return res.status(404).json({
        success: false,
        message: "Periodical not found",
      });
    }

    res.json({
      success: true,
      data: periodical,
    });
  } catch (error) {
    next(error);
  }
};

exports.createPeriodical = async (req, res, next) => {
  try {
    const periodicalData = {
      // ... your existing data mapping ...
      title: req.body.title,
      subtitle: req.body.subtitle,
      authors: req.body.authors || [],
      publisher: req.body.publisher,
      issn: req.body.issn,
      volume: req.body.volume,
      issue: req.body.issue,
      periodicalMonth: req.body.periodicalMonth,
      periodicalYear: req.body.periodicalYear,
      series: req.body.series,
      notes: req.body.notes,
      subscriptionDate: req.body.subscriptionDate,
      frequency: req.body.frequency,
      receiptDate: req.body.receiptDate,
      departmentToIssue: req.body.departmentToIssue,
      departmentIssueDate: req.body.departmentIssueDate,
      addOnCopies: req.body.addOnCopies,
      orderNo: req.body.orderNo,
      poNo: req.body.poNo,
      vendorDetails: {
        name: req.body.vendorDetails?.name || "",
        phone: req.body.vendorDetails?.phone || null,
        email: req.body.vendorDetails?.email || "",
      },
      mode: req.body.mode,
      url: req.body.url,
      paymentDetails: {
        currency: req.body.paymentDetails?.currency || "",
        amount: req.body.paymentDetails?.amount || null,
      },
      remarksForPayment: req.body.remarksForPayment,
      language: req.body.language,
      status: req.body.status || "Active",
    };

    const periodical = await Periodical.create(periodicalData);

    // LOG THE ACTIVITY
    await logPeriodicalCreate(req, req.user, periodical);
  } catch (error) {
    next(error);
  }
};

// Update periodical
exports.updatePeriodical = async (req, res, next) => {
  try {
    const updateData = {
      title: req.body.title,
      subtitle: req.body.subtitle,
      authors: req.body.authors || [],
      publisher: req.body.publisher,
      issn: req.body.issn,
      volume: req.body.volume,
      issue: req.body.issue,
      periodicalMonth: req.body.periodicalMonth,
      periodicalYear: req.body.periodicalYear,
      series: req.body.series,
      notes: req.body.notes,
      subscriptionDate: req.body.subscriptionDate,
      frequency: req.body.frequency,
      receiptDate: req.body.receiptDate,
      departmentToIssue: req.body.departmentToIssue,
      departmentIssueDate: req.body.departmentIssueDate,
      addOnCopies: req.body.addOnCopies,
      orderNo: req.body.orderNo,
      poNo: req.body.poNo,
      vendorDetails: {
        name: req.body.vendorDetails?.name || "",
        phone: req.body.vendorDetails?.phone || null,
        email: req.body.vendorDetails?.email || "",
      },
      mode: req.body.mode,
      url: req.body.url,
      paymentDetails: {
        currency: req.body.paymentDetails?.currency || "",
        amount: req.body.paymentDetails?.amount || null,
      },
      remarksForPayment: req.body.remarksForPayment,
      language: req.body.language,
      status: req.body.status || "Active",
    };

    const periodical = await Periodical.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true },
    );

    // LOG THE ACTIVITY
    await logPeriodicalUpdate(req, req.user, periodical._id, periodical.title);

    if (!periodical) {
      return res.status(404).json({
        success: false,
        message: "Periodical not found",
      });
    }

    res.json({
      success: true,
      message: "Periodical updated successfully",
      data: periodical,
    });
  } catch (error) {
    next(error);
  }
};

// Delete periodical
exports.deletePeriodical = async (req, res, next) => {
  try {
    const periodical = await Periodical.findByIdAndDelete(req.params.id);

    // LOG THE ACTIVITY
    await logPeriodicalDelete(req, req.user, periodical._id, periodical.title);

    if (!periodical) {
      return res.status(404).json({
        success: false,
        message: "Periodical not found",
      });
    }

    res.json({
      success: true,
      message: "Periodical deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
