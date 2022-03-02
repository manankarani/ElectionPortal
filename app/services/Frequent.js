/* ***************************************************
 *	Purpose: Frequently used Application Utilities   *
 *  Created By: Hardik Thakor         *
 *************************************************** */
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const tokenConfig = require("../../configs/configs").portal.token;

class FrequentUtility {
  /**
   * 1. Returns String with Title Case
   * @param {string} string - String to Convert
   * @return {string} string - Converted String
   */
  async toTitleCase(string) {
    try {
      return string.replace(/\w\S*/g, function (txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
      });
    } catch (e) {
      console.log("!toTitleCase: Error converting String to Title Case!");
      return "";
    }
  }

  /**
   * 2. Returns Randomly generated String with Mentioned Length
   * @param {number} x - Length of String to be generated Randomly
   * @return {string} string - Randomly generated String
   */
  async generateString(x) {
    var s = "";
    while (s.length < x && x > 0) {
      var r = Math.random();
      s +=
        r < 0.1
          ? Math.floor(r * 100)
          : String.fromCharCode(Math.floor(r * 26) + (r > 0.5 ? 97 : 65));
    }
    return s;
  }

  /**
   * 3. To verify if User is Logged In or not
   * @return {boolean}
   */
  async verifyUserAuth(req, res, next) {
    console.log(req.originalUrl);
    try {
      if (req.header("Authorization")) {
        try {
          const userDetails = jwt.verify(
            req.header("Authorization"),
            tokenConfig.privateKey
          );
          // if (userDetails.isSubscriptionOver) {
          //     return res.status(401).json({ success: false, isSubscriptionOver: true, message: '' });
          // } else {
          req.user = userDetails;
          next();
          // }
        } catch (err) {
          console.log(err);
          return res.status(401).json({
            success: false,
            isInvalidToken: true,
            message: "Token Invalid",
          });
        }
      } else {
        return res.status(403).json({
          success: false,
          isInvalidToken: true,
          message: "Unauthorised Request",
        });
      }
    } catch (err) {
      console.log(err);
      return res
        .status(500)
        .json({ success: false, message: "Issue Processing Token " });
    }
  }

  /**
   * 4. Return Token
   * @param {object} info - JSON data to add in Token.
   */
  async createAuthToken(data, period) {
    return jwt.sign(data, tokenConfig.privateKey, {
      // expiresIn: tokenConfig.expiry
    });
  }

  /**
   * 6. Returns Randomly generated Number with Mentioned Length
   * @param {number} placeCount - place Count of Number to be generated Randomly
   * @return {string} string - Randomly generated String
   */
  async generateNumber(placeCount) {
    let size = 1;
    for (let index = 1; index < placeCount; index++) {
      size *= 10;
    }
    return Math.floor(Math.random() * (9 * size)) + size;
  }
}

module.exports = FrequentUtility;
