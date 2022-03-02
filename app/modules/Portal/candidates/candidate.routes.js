const CandidateController = require("./candidate.controller");
const config = require("../../../../configs/configs").portal.baseApiUrl;
module.exports = function (app, express) {
  const router = express.Router();

  router.post("/addCandidate", (req, res) => {
    return new CandidateController().boot(req, res).addCandidate();
  });

  app.use(config, router);
};
