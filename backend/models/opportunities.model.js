import mongoose from 'mongoose';

const opportunitiesSchema = new mongoose.Schema({
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
  link: {
    type: String,
    required: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, { 
  timestamps: true 
});

export default mongoose.model('Opportunities', opportunitiesSchema);