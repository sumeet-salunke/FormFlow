import mongoose from "mongoose";


const answerSchema = new mongoose.Schema({
  fieldId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  value: {
    type: mongoose.Schema.Types.Mixed,

  },
}, {
  _id: false
})


const responseSchema = new mongoose.Schema({
  formId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Form",
    required: true,
  },
  answers: {
    type: [answerSchema],
    required: true
  },
  submittedAt: {
    type: Date,
    default: Date.now,
  }
});

const Response = mongoose.model("Response", responseSchema);

export default Response;