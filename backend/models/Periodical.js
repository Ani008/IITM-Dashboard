const mongoose = require('mongoose');

const periodicalSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true
  },
  subtitle: {
    type: String,
    trim: true,
    default: ''
  },
  authors: [{
    type: String,
    trim: true
  }],
  publisher: {
    type: String,
    trim: true
  },
  issn: {
    type: String,
    trim: true,
    default: ''
  },
  volume: {
    type: String,
    trim: true,
    default: null
  },
  issue: {
    type: String,
    trim: true,
    default: ''
  },
  periodicalMonth: {
    type: String,
    trim: true,
    default: ''
  },
  periodicalYear: {
    type: String,
    trim: true,
    default: null
  },
  series: {
    type: String,
    trim: true,
    default: ''
  },
  notes: {
    type: String,
    trim: true,
    default: ''
  },
  subscriptionDate: {
    type: Date,
    default: null
  },
  frequency: {
    type: String,
    enum: ['Daily', 'Weekly', 'Monthly', 'Quarterly', 'Bi-Monthly', 'Annual']
  },
  receiptDate: {
    type: Date,
    default: null
  },
  departmentToIssue: {
    type: String,
    enum: ['Mechanical', 'Civil', 'Computer', 'Electrical', 'Automotive', ''],
    default: ''
  },
  departmentIssueDate: {
    type: Date,
    default: null
  },
  addOnCopies: {
    type: Number,
    default: 0
  },
  orderNo: {
    type: Number,
    default: null
  },
  poNo: {
    type: String,
    trim: true,
    default: ''
  },
  vendorDetails: {
    name: {
      type: String,
      trim: true,
      default: ''
    },
    phone: {
      type: Number,
      default: null
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      default: ''
    }
  },
  mode: {
    type: String,
    enum: ['Subscription', 'Exchange', 'Free', 'Membership', ''],
    default: ''
  },
  url: {
    type: String,
    trim: true,
    default: ''
  },
  paymentDetails: {
    currency: {
      type: String,
      trim: true,
      default: ''
    },
    amount: {
      type: Number,
      default: null
    }
  },
  remarksForPayment: {
    type: String,
    trim: true,
    default: ''
  },
  language: {
    type: String,
    enum: ['English', 'Marathi', 'Hindi', ''],
    default: ''
  },
  status: {
    type: String,
    enum: ['Active', 'Disposal', 'Inactive'],
    default: 'Active'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Periodical', periodicalSchema);