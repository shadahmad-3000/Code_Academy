import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
    },
    logo: {
      public_id: String,
      url: String,
    },
    image1: {
      public_id: String,
      url: String,
    },
    image2: {
      public_id: String,
      url: String,
    },
    image3: {
      public_id: String,
      url: String,
    },
    phone: {
      type: String,
    },
    state: {
      type: String,
    },
    city: {
      type: String,
    },
    country: {
      type: String,
      default: "Venezuela",
    },
    postal_code: {
      type: String,
    },
    municipality: {
      type: String,
    },
    parish: {
      type: String,
    },
    address: {
      type: String,
    },
    economic_activity: {
      type: String,
    },
    economic_division: {
      type: String,
    },
    economic_group: {
      type: String,
    },
    economic_class: {
      type: String,
    },
    website: {
      type: String,
    },
    facebook: {
      type: String,
    },
    instagram: {
      type: String,
    },
    role: {
      type: String,
      required: true,
    },
    workspace: {
      type: String,
    },
    title4: {
      type: String,
    },
    description4: {
      type: String,
    },
    price4: {
      type: Number,
    },
    image4: {
      public_id: String,
      url: String,
    },
    title5: {
      type: String,
    },
    description5: {
      type: String,
    },
    price5: {
      type: Number,
    },
    image5: {
      public_id: String,
      url: String,
    },
    title6: {
      type: String,
    },
    description6: {
      type: String,
    },
    price6: {
      type: Number,
    },
    image6: {
      public_id: String,
      url: String,
    },
    title7: {
      type: String,
    },
    description7: {
      type: String,
    },
    price7: {
      type: Number,
    },
    image7: {
      public_id: String,
      url: String,
    },
    user: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

postSchema.index({ title: 'text' });

export default mongoose.model("Post", postSchema);
