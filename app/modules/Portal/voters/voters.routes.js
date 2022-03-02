const VotersController = require("./voters.controller");
const config = require("../../../../configs/configs").portal.baseApiUrl;
module.exports = function (app, express) {
  const router = express.Router();

  router.post("/addVote", (req, res) => {
    return new VotersController().boot(req, res).addVote();
  });

  app.use(config, router);
};
