const App = require("../models/app");
const jwt = require("jsonwebtoken");
var crypto = require("crypto");
const axios = require("axios");
const User = require("../models/user");

module.exports.authorizeApp = function (req, res, next) {
  const rawToken = req.headers.authorization;
  if (!rawToken) {
    return res.status(401).send({
      error: "Action unauthorized",
    });
  }

  //removing bearer keyword
  const token = rawToken.slice(7);
  //parsing the payload of jwt token
  const payload = JSON.parse(
    Buffer.from(token.split(".")[1], "base64").toString()
  );

  App.findById(payload.appId, "appSecret initVector")
    .then((app) => {
      if (!app) {
        return res.status(404).send({ error: "App not found" });
      }
      try {
        const data = jwt.verify(token, app.plainAppSecret);
        return next();
      } catch (error) {
        return res.status(403).send({ error: "Forbidden" });
      }
    })
    .catch((err) => {
      return res.status(500).send({ error: err.message });
    });
};

module.exports.authorization = function (req, res, next) {
  const token = req.cookies.jwt;
  if (!token) {
    return res.status(401).send({
      error: "Action unauthorized. Please login first",
    });
  }
  try {
    const data = jwt.verify(token, process.env.USER_SECRET);
    req.userId = data.id;
    req.username = data.username;
    User.findById(req.userId, "userType")
      .then((user) => {
        if (!user) return res.status(404).send({ error: "User not found" });
        req.userType = user.userType;
        return next();
      })
      .catch((err) => {
        return res.status(500).send({ error: err.message });
      });
  } catch {
    return res.status(403).send({ error: "Forbidden" });
  }
};

module.exports.updateWebhook = async function (data) {
  //Create MD5 checksum of the stringified data
  var hash = crypto
    .createHash("md5")
    .update(JSON.stringify(data))
    .digest("hex");

  //Send req.body to Webhook URL for all type-1 apps
  App.find({ appType: "type-1" }, "webhookURL appSecret initVector")
    .then((apps) => {
      for (const v of apps) {
        console.log(
          "Opening request............................................."
        );
        var JWT = jwt.sign(
          {
            md5Checksum: hash,
          },
          v.plainAppSecret,
          { expiresIn: "5m" }
        );

        var headers = {
          Authorization: "Bearer " + JWT,
        };

        try {
          axios
            .post(v.webhookURL, data, {
              headers: headers,
            })
            .then((res) => {
              console.log("Webhook request success status" + res.statusText);
            })
            .catch((err) => {
              console.log("Webhook request error " + err.message);
            });
        } catch (error) {
          console.log("Error caught " + error.message);
        }

        console.log(
          "Closing request ******************************************************"
        );
      }
    })
    .catch((err) => {
      return res.status(500).send({ error: err.message });
    });
};
