import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    identification: {
      type: String,
    },
    name: {
      type: String,
    },
    lastname: {
      type: String,
    },
    birth_date: {
      type: String,
    },
    classroom: {
      type: String,
    },
    career: {
      type: String,
    },
    phone: {
      type: String,
    },
    country: {
      type: String,
    },
    state: {
      type: String,
    },
    address: {
      type: String,
    },
    sgpi: {
      type: String,
    },
    cgpi: {
      type: String,
    },
    year: {
      type: String,
    },
    course: {
      type: String,
    },
    roles: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Role",
      },
    ],
    isRegistrationComplete: {
      type: Boolean,
      default: false,
    },
    verified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("User", userSchema);
