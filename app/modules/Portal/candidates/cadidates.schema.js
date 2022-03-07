const mongoose = require("mongoose");
const schema = mongoose.Schema;

const CandidatesSchema = new schema({
  candidateId: { type: String, required: true },
  name: { type: String, required: true },
  guj_name: { type: String, required: true },
  age: { type: Number, required: true },
  mobile: { type: Number, required: true },
  email: { type: String },
  address: { type: String },
  village: { type: String },
  imageUrl: { type: String },
  votes: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});
mongoose.model("Candidates", CandidatesSchema, "Candidates");
