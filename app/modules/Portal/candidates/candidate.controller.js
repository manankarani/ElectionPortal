const mongoose = require("mongoose");
const Controller = require("../../Base/Controller");
const FrequentUtility = require("../../../services/Frequent");
const frequentUtility = new FrequentUtility();
const Candidates = mongoose.model("Candidates");

class CandidatesController extends Controller {
  async addCandidate() {
    try {
      let newCandidate = this.req.body;
      newCandidate["candidateId"] = await this.verifyAndPrepareCandidateId();

      const candidate = new Candidates({
        ...newCandidate,
      });

      await candidate.save();
      return this.res.status(200).json({
        success: true,
        message: "Candidate Added Successfully",
      });
    } catch (error) {
      console.error(error);
      return this.res.status(500).json({
        success: false,
        message: "A110: Error in adding candidate",
        error: error,
      });
    }
  }

  async getCandidates() {
    try {
      const candidates = await Candidates.find({});
      return this.res.status(200).json({
        success: true,
        message: "Candidates fetched successfully",
        data: candidates,
      });
    } catch (error) {
      console.error(error);
      return this.res.status(500).json({
        success: false,
        message: "A110: Error in fetching candidates",
        error: error,
      });
    }
  }

  async verifyAndPrepareCandidateId(initial = "CAN") {
    let newId = await frequentUtility.generateNumber(6);
    let isUnique = false;
    while (!isUnique) {
      let candidateRecord = await Candidates.findOne({
        candidateId: initial + newId,
      }).countDocuments();
      if (!candidateRecord) {
        isUnique = true;
      } else {
        newId = await frequentUtility.generateNumber(6);
      }
    }
    return initial + newId;
  }
}

module.exports = CandidatesController;
