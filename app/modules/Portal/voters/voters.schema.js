const mongoose = require("mongoose");
const schema = mongoose.Schema;

const VoteSchema = new schema({
  voteId: { type: String, required: true },
  candidates: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Candidates",
    },
  ],
});
mongoose.model("Vote", VoteSchema, "Vote");

const VoterSchema = new schema({
  voterId: { type: String, required: true },
  name: { type: String, required: true },
  age: { type: Number, required: true },
  mobile: { type: Number, required: true },
  email: { type: String },
  address: { type: String },
  village: { type: String },
  hasVoted: { type: Boolean, default: false },
  smsSent: { type: Boolean, default: false },
  vote: { type: mongoose.Schema.Types.ObjectId, ref: "ElectionVotes" },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});
mongoose.model("Voter", VoterSchema, "Voter");
