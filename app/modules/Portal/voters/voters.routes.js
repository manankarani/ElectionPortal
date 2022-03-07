const VotersController = require("./voters.controller");
const config = require("../../../../configs/configs").portal.baseApiUrl;
module.exports = function (app, express) {
  const router = express.Router();

  router.post("/addVote", (req, res) => {
    return new VotersController().boot(req, res).addVote();
  });
  router.get("/getVotes", (req, res) => {
    return new VotersController().boot(req, res).getVotes();
  });
  router.get("/getTotalVotes", (req, res) => {
    return new VotersController().boot(req, res).getTotalVotes();
  });
  router.post("/addVoter", (req, res) => {
    return new VotersController().boot(req, res).addVoter();
  });
  router.get("/getVoter", (req, res) => {
    return new VotersController().boot(req, res).getVoter();
  });
  router.get("/endVoting", (req, res) => {
    return new VotersController().boot(req, res).endVoting();
  });
  router.post("/showBallot", (req, res) => {
    return new VotersController().boot(req, res).showBallot();
  });
  app.use(config, router);
};
