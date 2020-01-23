const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ExpenseMember = new Schema({
  _id: {
    type: mongoose.Types.ObjectId,
    required: true
  },
  displayName: {
    type: String,
    required: true
  },
  amountPaid: {
    type: Number,
    required: true
  },
  totalToPay: {
    type: Number,
    required: true
  },
  avatarURL: {
    type: String,
    required: true
  },
  complete: {
    type: Boolean,
    required: true
  }
});

const ExpenseSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  cost: {
    type: Number,
    required: true
  },
  totalRemaining: {
    type: Number,
    required: true
  },
  totalPaid: {
    type: Boolean,
    required: true
  },
  members:{
    type: [ExpenseMember],
    required: true
  }
});

const MsgSchema = new Schema({
  groupID:{
    type:String,
    required: true
  },
  isMsg:{
    type:Boolean,
    required: true
  },
  creatorID: {
    type:String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  expense: {
    type: ExpenseSchema,
    required: false
  },
  date: {
    type: Date,
    default: Date.now
  },
  deleted: {
    type:Boolean,
    default: false
  }
});

mongoose.model('messages', MsgSchema);