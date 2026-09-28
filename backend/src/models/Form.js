import mongoose from "mongoose";
import { FORM_STATUS, AVAILABILITY_TYPES, FIELD_TYPES } from "../constants/form.constants.js";


const fieldSchema = new mongoose.Schema({
  type: {
    type: String,
    emum: Object.values(FIELD_TYPES),
    required: true,
  },
  label: {
    type: String,
    required: true,
    trim: true,
    maxLength: 500,
  },
  options: {
    type: [String],
    default: [],
  },
}, { _id: true });


const formSchema = new mongoose.Schema({
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
    maxLength: 200,
  },
  description: {
    type: String,
    trim: true,
    maxLength: 1000,
    default: "",
  },
  status: {
    type: String,
    enum: Object.values(FORM_STATUS),
    default: FORM_STATUS.DRAFT,
    required: true,
  },
  availability: {
    type: String,
    enum: Object.values(AVAILABILITY_TYPES),
    default: AVAILABILITY_TYPES.ALWAYS,
    required: true,
  },
  fields: {
    type: [fieldSchema],
    default: [],
  }
}, { timestamps: true });


const Form = mongoose.model("Form", formSchema);

export default Form;