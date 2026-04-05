const mongoose = require("mongoose");

const abstractSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    authors: [{ type: String }],
    journal: {
      type: String,
      trim: true,
      default: "",
    },
    source: {
      type: String,
      trim: true,
      default: "",
    },
    keyword: [{ type: String }],
    volume: {
      type: String,
      default: null,
      default: "",
    },
    issue: {
      type: String,
      trim: true,
      default: "",
    },
    year: {
      type: String,
      trim: true,
      default: "",
    },
    publicationMonth: {
      type: String,
      trim: true,
      default: "",
    },
    subject: [{ type: String }],
    summary: {
      type: String,
      trim: true,
      default: "",
    },
    status: {
      type: String,
      enum: ["Draft", "Published", "Archived"],
      default: "Draft",
    },

    publishedInAA: {
      type: String,
      trim: true,
      default: "",
    },
    remarks: {
      type: String,
      trim: true,
      default: "",
    },
    url: {
      type: String,
      trim: true,
      default: "",
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Abstract", abstractSchema);
