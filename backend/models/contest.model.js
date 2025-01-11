import mongoose from 'mongoose';

const ContestSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  platformName: {
    type: String,
    required:true,
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true,
  },
  link: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

export default mongoose.model('Contest', ContestSchema);