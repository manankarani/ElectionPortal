const mongoose = require("mongoose");
const Controller = require("../../Base/Controller");
const FrequentUtility = require("../../../services/Frequent");
const frequentUtility = new FrequentUtility();
const Vote = mongoose.model("Vote");
const Voter = mongoose.model("Voter");
const Candidates = mongoose.model("Candidates");
var async = require("async");

class VotersController extends Controller {
  async addVote() {
    try {
      const { candidates } = this.req.body;
      const candIds = candidates.map((cand) => cand.candidateId);
      if (candidates.length !== 2) {
        return this.res.status(400).json({
          success: false,
          message: "A110: Invalid number of candidates",
        });
      }
      if (new Set(candIds).size !== candIds.length) {
        return this.res.status(400).json({
          success: false,
          message: "A110: Duplicate candidates",
        });
      }

      const voteId = await this.verifyAndPrepareVoteId();
      async.mapLimit(
        candidates,
        7,
        async (candidate) => {
          const candidateId = await Candidates.findOne({
            candidateId: candidate.candidateId,
          }).select("_id");
          return candidateId;
        },
        (err, candidateIds) => {
          if (err) {
            console.log(err);
            return this.res.status(500).json({
              success: false,
              message: "A110: Error in adding vote",
            });
          } else {
            console.log(candidateIds);
            const vote = new Vote({
              voteId: voteId,
              candidates: candidateIds,
            });
            vote.save();
            return this.res.status(200).json({
              success: true,
              message: "Vote Added Successfully",
            });
          }
        }
      );
    } catch (error) {
      console.error(error);
      return this.res.status(500).json({
        success: false,
        message: "A110: Error in adding vote",
      });
    }
  }

  async verifyAndPrepareVoteId(initial = "DT") {
    let newId = await frequentUtility.generateNumber(6);
    let isUnique = false;
    while (!isUnique) {
      let voteRecord = await Vote.findOne({
        voteId: initial + newId,
      }).countDocuments();
      if (!voteRecord) {
        isUnique = true;
      } else {
        newId = await frequentUtility.generateNumber(6);
      }
    }
    return initial + newId;
  }
}

module.exports = VotersController;
