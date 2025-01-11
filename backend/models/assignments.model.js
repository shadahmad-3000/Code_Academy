import mongoose from 'mongoose';

const assignmentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    minlength: 5
  },
  description: {
    type: String,
    required: true,
    trim: true,
    minlength: 10
  },
  course: {
    type: String,
    required: true,
  },
  dueDate: {
    type: Date,
    required: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
}, { 
  timestamps: true 
});

export default mongoose.model('Assignment', assignmentSchema);