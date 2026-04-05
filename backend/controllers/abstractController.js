const Abstract = require("../models/Abstract");

// Get all abstracts
exports.getAllAbstracts = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;

    // Destructure onlyPublished from query
    const { search, subject, onlyPublished, status } = req.query;

    const query = {};

    // 1. Published In AA Filter
    // If onlyPublished is true, we filter for records where the field has actual text content
    // Check for the string "true" from the query params
    if (req.query.onlyPublished === "true") {
      query.publishedInAA = { $exists: true, $ne: "" };
    }
    if (status && status !== "") {
      query.status = status;
    }

    // 2. Global Search
    if (search && search.trim() !== "") {
      const searchValue = search.trim();
      query.$or = [
        { title: { $regex: searchValue, $options: "i" } },
        { authors: { $regex: searchValue, $options: "i" } },
        { journal: { $regex: searchValue, $options: "i" } },
      ];
    }

    // 3. Subject Filter
    if (subject) query.subject = subject;

    const totalRecords = await Abstract.countDocuments(query);

    const abstracts = await Abstract.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      success: true,
      currentPage: page,
      totalPages: Math.ceil(totalRecords / limit),
      totalRecords,
      count: abstracts.length,
      data: abstracts,
    });
  } catch (error) {
    next(error);
  }
};

// Get single abstract
exports.getAbstractById = async (req, res, next) => {
  try {
    const abstract = await Abstract.findById(req.params.id);

    if (!abstract) {
      return res.status(404).json({
        success: false,
        message: "Abstract not found",
      });
    }

    res.json({
      success: true,
      data: abstract,
    });
  } catch (error) {
    next(error);
  }
};

// Create abstract
exports.createAbstract = async (req, res, next) => {
  try {
    const abstractData = {
      title: req.body.title,
      authors: req.body.authors || [],
      journal: req.body.journal,
      source: req.body.source,
      keyword: req.body.keyword || [],
      volume: req.body.volume,
      issue: req.body.issue,
      year: req.body.year,
      publicationMonth: req.body.publicationMonth,
      subject: req.body.subject || [],
      summary: req.body.summary,
      status: req.body.status || "Draft", // Default to "Draft" if not provided
      publishedInAA: req.body.publishedInAA,
      remarks: req.body.remarks,
      url: req.body.url,
    };

    const abstract = await Abstract.create(abstractData);

    res.status(201).json({
      success: true,
      message: "Abstract created successfully",
      data: abstract,
    });
  } catch (error) {
    next(error);
  }
};

// Update abstract
exports.updateAbstract = async (req, res, next) => {
  try {
    const updateData = {
      title: req.body.title,
      authors: req.body.authors || [],
      journal: req.body.journal,
      source: req.body.source,
      keyword: req.body.keyword || [],
      volume: req.body.volume,
      issue: req.body.issue,
      year: req.body.year,
      publicationMonth: req.body.publicationMonth,
      subject: req.body.subject || [],
      summary: req.body.summary,
      status: req.body.status,
      publishedInAA: req.body.publishedInAA,
      remarks: req.body.remarks,
      url: req.body.url,
    };

    const abstract = await Abstract.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!abstract) {
      return res.status(404).json({
        success: false,
        message: "Abstract not found",
      });
    }

    res.json({
      success: true,
      message: "Abstract updated successfully",
      data: abstract,
    });
  } catch (error) {
    next(error);
  }
};

// Delete abstract
exports.deleteAbstract = async (req, res, next) => {
  try {
    const abstract = await Abstract.findByIdAndDelete(req.params.id);

    if (!abstract) {
      return res.status(404).json({
        success: false,
        message: "Abstract not found",
      });
    }

    res.json({
      success: true,
      message: "Abstract deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

// Add this to abstractController.js

exports.getAbstractsByIds = async (req, res, next) => {
  try {
    const { ids } = req.body;
    
    // Validate that ids is an array
    if (!ids || !Array.isArray(ids)) {
      return res.status(400).json({ success: false, message: "Please provide an array of IDs" });
    }

    const abstracts = await Abstract.find({ _id: { $in: ids } });

    res.json({
      success: true,
      data: abstracts,
    });
  } catch (error) {
    next(error);
  }
};