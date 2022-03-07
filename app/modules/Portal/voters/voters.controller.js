const mongoose = require("mongoose");
const Controller = require("../../Base/Controller");
const FrequentUtility = require("../../../services/Frequent");
const frequentUtility = new FrequentUtility();
const Vote = mongoose.model("Vote");
const Voter = mongoose.model("Voter");
const Candidates = mongoose.model("Candidates");
var async = require("async");

class VotersController extends Controller {
  async addVoter() {
    try {
      let newVoter = this.req.body;
      newVoter["voterId"] = await this.verifyAndPrepareVoterId();
      const voter = new Voter(newVoter);
      await voter.save();
      // io.emit("showBallot",{
      //   voterId: newVoter.voterId,
      //   name: newVoter.name,
      // })
      return this.res.status(200).json({
        success: true,
        message: "Voter Added Successfully",
      });
    } catch (error) {
      console.log(error);
      return this.res.status(500).json({
        success: false,
        message: "A110: Error in adding voter",
      });
    }
  }

  async addVote() {
    try {
      const { voterId, candidates } = this.req.body;
      const candIds = candidates.map((cand) => cand.candidateId);
      const voter = await Voter.findOne({
        voterId: voterId,
      });

      // guard clauses
      if (!voter) {
        return this.res.status(400).json({
          success: false,
          message: "A120: Voter not found",
        });
      }
      if (voter.hasVoted) {
        return this.res.status(400).json({
          success: false,
          message: "A130: Voter has already voted",
        });
      }
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
          data: candIds,
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
            async.mapLimit(
              candidateIds,
              7,
              async (candidateId) => {
                const cVote = await Candidates.findOneAndUpdate(
                  {
                    _id: candidateId,
                  },
                  {
                    $inc: { votes: 1 },
                  }
                );
                return cVote;
              },
              async (err, cVotes) => {
                if (err) {
                  console.log(err);
                  return this.res.status(500).json({
                    success: false,
                    message: "A110: Error in adding vote",
                  });
                } else {
                  //success case
                  const vote = new Vote({
                    voteId: voteId,
                    candidates: candidateIds,
                  });
                  vote.save();

                  const voter = await Voter.findOneAndUpdate(
                    {
                      voterId: voterId,
                    },
                    {
                      hasVoted: true,
                    }
                  );
                  io.emit("vote", {
                    voteId: voteId,
                    voterId: voterId,
                  });

                  io.emit("wait", {
                    voterId: voterId,
                  });

                  return this.res.status(200).json({
                    success: true,
                    message: "Vote Added Successfully",
                  });
                }
              }
            );
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

  async getVotes() {
    try {
      const topCandidates = await Candidates.find({})
        .sort({ votes: -1 })
        .limit(2);
      return this.res.status(200).json({
        success: true,
        message: "Votes fetched successfully",
        data: topCandidates,
      });
    } catch (error) {
      console.error(error);
      return this.res.status(500).json({
        success: false,
        message: "A110: Error in fetching votes",
      });
    }
  }

  async getTotalVotes() {
    try {
      const totalVotes = await Vote.find({}).countDocuments();
      return this.res.status(200).json({
        success: true,
        message: "Total Votes fetched successfully",
        data: totalVotes,
      });
    } catch (error) {
      console.error(error);
      return this.res.status(500).json({
        success: false,
        message: "A110: Error in fetching votes",
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

  async verifyAndPrepareVoterId(initial = "DT") {
    let newId = await frequentUtility.generateNumber(6);
    let isUnique = false;
    while (!isUnique) {
      let voterRecord = await Voter.findOne({
        voterId: initial + newId,
      }).countDocuments();
      if (!voterRecord) {
        isUnique = true;
      } else {
        newId = await frequentUtility.generateNumber(6);
      }
    }
    return initial + newId;
  }

  async getVoter() {
    try {
      const { voterId } = this.req.query;
      const voter = await Voter.findOne({
        voterId: voterId,
      });
      if (!voter) {
        return this.res.status(400).json({
          success: false,
          message: "A120: Voter not found",
        });
      }
      return this.res.status(200).json({
        success: true,
        message: "Voter fetched successfully",
        data: voter,
      });
    } catch (error) {
      console.error(error);
      return this.res.status(500).json({
        success: false,
        message: "A110: Error in fetching voter",
      });
    }
  }

  async endVoting() {
    try {
      const totalVotes = await Vote.find({}).countDocuments();
      const topCandidates = await Candidates.find({})
        .sort({ votes: -1 })
        .limit(2);
      return this.res.status(200).json({
        success: true,
        message: "Voting ended successfully",
        data: {
          totalVotes: totalVotes,
          topCandidates: topCandidates,
        },
      });
    } catch (error) {
      console.error(error);
      return this.res.status(500).json({
        success: false,
        message: "A110: Error in fetching votes",
      });
    }
  }

  async showBallot() {
    try {
      const { voterId } = this.req.body;
      if(!voterId) {
        return this.res.status(400).json({
          success: false,
          message: "A120: Voter not found",
        });
      }
      io.emit("showBallot", voterId);
      return this.res.status(200).json({
        success: true,
        message: "Ballot shown successfully",
      });
    } catch (error) {
      console.error(error);
      return this.res.status(500).json({
        success: false,
        message: "A110: Error sending ballot",
      });
    }
  }
}

module.exports = VotersController;
