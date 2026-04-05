const Standard = require("../models/Standard");
const Counter = require("../models/Counter");


exports.getAllStandards = async (req, res, next) => {
  try {
    console.log("SEARCH VALUE:", req.query.search);

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;

    // 2️⃣ Extract filters
    const { search, department, publisher, status } = req.query;

    // 3️⃣ Build dynamic query object
    const query = {};

    // 🔎 Global search (ICN, Standard No, Title)
    if (search && search.trim() !== "") {
      const searchValue = search.trim();

      query.$or = [
        { title: { $regex: searchValue, $options: "i" } },
        { standardNumber: { $regex: searchValue, $options: "i" } },
        { requisition_no: { $regex: searchValue, $options: "i" } }, // ✅ NEW
      ];

      // If search is a number, also match icnNumber exactly
      if (!isNaN(searchValue)) {
        query.$or.push({ icnNumber: Number(searchValue) });
      }
    }

    if (department) query.department = department;
    if (publisher) query.publisher = publisher;
    if (status) query.status = status;

    // 4️⃣ Get total filtered count
    const totalRecords = await Standard.countDocuments(query);

    // 5️⃣ Fetch paginated filtered records
    const standards = await Standard.find(query)
      .sort({ icnNumber: -1 })
      .skip(skip)
      .limit(limit);

    // 6️⃣ Send response
    res.json({
      success: true,
      currentPage: page,
      totalPages: Math.ceil(totalRecords / limit),
      totalRecords,
      count: standards.length,
      data: standards,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single standard
// @route   GET /api/standards/:id
exports.getStandardById = async (req, res, next) => {
  try {
    const standard = await Standard.findById(req.params.id);

    if (!standard) {
      return res.status(404).json({
        success: false,
        message: "Standard not found",
      });
    }

    res.json({
      success: true,
      data: standard,
    });
  } catch (error) {
    next(error);
  }
};

// @route   POST /api/standards
exports.createStandard = async (req, res, next) => {
  try {
    const standard = await Standard.create(req.body);

    // LOG THE ACTIVITY
    await logStandardCreate(req, req.user, standard);

    res.status(201).json({
      success: true,
      message: "Standard created successfully",
      data: standard,
    });
  } catch (error) {
    // Handle Mongoose duplicate key error (for standardNumber)
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message:
          "Duplicate field value entered: Standard Number already exists",
      });
    }
    next(error);
  }
};

// @route   PUT /api/standards/:id
exports.updateStandard = async (req, res, next) => {
  try {
    // We use req.body directly to capture all updated fields
    const standard = await Standard.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    await logStandardUpdate(req, req.user, standard._id, standard.title);

    if (!standard) {
      return res.status(404).json({
        success: false,
        message: "Standard not found",
      });
    }

    res.json({
      success: true,
      message: "Standard updated successfully",
      data: standard,
    });
  } catch (error) {
    next(error);
  }
};

// @route   DELETE /api/standards/:id
exports.deleteStandard = async (req, res, next) => {
  try {
    const standard = await Standard.findByIdAndDelete(req.params.id);

    if (!standard) {
      return res.status(404).json({
        success: false,
        message: "Standard not found",
      });
    }

    await Standard.findByIdAndDelete(req.params.id);

    // ✅ Call your logger function
    await logStandardDelete(
      req,
      req.user, // Comes from protect middleware
      standard._id,
      standard.title,
    );

    res.json({
      success: true,
      message: "Standard deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/standards/next-icn
exports.getNextIcn = async (req, res, next) => {
  try {
    const counter = await Counter.findOne({ _id: "icnNumber" });
    // If no counter exists yet, start at 1, otherwise next is current + 1
    const nextIcn = counter ? counter.sequence_value + 1 : 1;
    
    res.status(200).json({
      success: true,
      nextIcn: nextIcn
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/standards/unique-values/:field
exports.getUniqueFieldValues = async (req, res, next) => {
  try {
    const { field } = req.params;
    
    // Safety check: only allow certain fields to be queried
    const allowedFields = ["department", "publisher",];
    if (!allowedFields.includes(field)) {
      return res.status(400).json({ success: false, message: "Invalid field" });
    }

    const values = await Standard.distinct(field);
    
    res.json({
      success: true,
      data: values.filter(Boolean).sort() // Removes empty values and sorts A-Z
    });
  } catch (error) {
    next(error);
  }
};