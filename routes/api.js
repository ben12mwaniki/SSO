const { response } = require("express");
const express = require("express");
const router = express.Router();
const User = require("../models/user");
var mailer = require("../services/mailer");
var middleware = require("../middleware/middleware");
var crypto = require("crypto");
const jwt = require("jsonwebtoken");
const App = require("../models/app");

router.post("/registration", (req, res) => {
  if (req.body.username && req.body.email && req.body.password) {
    User.create(req.body)
      .then((data) => {
        if (data) {
          //mail sending
          crypto.randomBytes(20, (err, buf) => {
            // Ensure the activation code is unique.
            data.activationToken = data._id + buf.toString("hex");

            // Set expiration time to 24 hours.
            data.activationExpiry = Date.now() + 24 * 3600 * 1000;

            var link =
              "http://localhost:3000/activation/" + data.activationToken;

            // Sending activation email
            mailer.send({
              to: req.body.email,
              subject: "Welcome",
              html:
                'Please click <a href="' +
                link +
                '"> here </a> to activate your account.',
            });

            data.registered = false; //True after user creates a profile
            data
              .save()
              .then(() => {
                //send webhook to all type 1-PAs

                return res.status(201).send({
                  message: `The activation email has been sent to ${data.email}, please click the activation link within 24 hours.`,
                });
              })
              .catch((err) => {
                return res.status(500).send({ error: err.message });
              });
          });
        }
      })
      .catch((err) => res.status(409).json({ error: err.message }));
  } else {
    res.status(400).json({
      error: "An input field is empty",
    });
  }
});

router.get("/activation/:activationToken", (req, res) => {
  User.findOne({
    activationToken: req.params.activationToken,
  })
    .then((user) => {
      if (!user) {
        return res.status(404).send({
          error: `Your activation link is invalid`,
        });
      }
      if (user.activationExpiry < Date.now()) {
        User.deleteOne({ _id: user._id })
          .then(() => {
            return res.status(403).send({
              error: `Your activation link has expired. Please register again`,
            });
          })
          .catch((err) => {
            console.log(err);
            return res.status(500).send({ error: err.message });
          });
      } else {
        // activate and save
        user.activated = true;
        user.activationToken = undefined;
        user.activationExpiry = undefined;
        user
          .save()
          .then(() => {
            return res.status(200).send({
              message: "Account activation successful! Redirecting to login...",
            });
          })
          .catch((err) => {
            return res.status(500).send({ error: err.message });
          });
      }
    })
    .catch((err) => {
      return res.status(500).send({ error: err.message });
    });
});

router.post("/login", (req, res) => {
  if (req.body.email && req.body.password) {
    User.findOne(
      { email: req.body.email },
      "username password activated registered userType"
    )
      .then((data) => {
        if (!data) {
          return res.status(404).json({ error: "User does not exist" });
        }

        data.comparePassword(req.body.password, function (err, isMatch) {
          if (err) return res.status(500).json({ error: err.message });
          if (!isMatch) {
            return res.status(400).json({ error: "Incorrect Password" });
          }
          if (!data.activated) {
            return res.status(403).send({
              error: "Please click the activation link sent to your email",
            });
          } else {
            if (!data.registered) {
              const token = jwt.sign(
                {
                  username: data.username,
                  id: data._id,
                  registered: data.registered,
                },
                process.env.CRYPT_SECRET,
                { expiresIn: "24h" }
              );

              return res
                .cookie("jwt", token, { httpOnly: true })
                .status(200)
                .json({
                  message: "User not registered!",
                  username: data.username,
                  userType: data.userType,
                });
            } else {
              const token = jwt.sign(
                {
                  username: data.username,
                  id: data._id,
                  registered: data.registered,
                },
                process.env.USER_SECRET,
                { expiresIn: "24h" }
              );

              return res
                .cookie("jwt", token, { httpOnly: true })
                .status(200)
                .json({
                  message: "Success!",
                  username: data.username,
                  userType: data.userType,
                });
            }
          }
        });
      })
      .catch((err) => {
        res.status(404).send({ error: err.message });
      });
  } else {
    res.status(400).json({
      error: "An input field is empty",
    });
  }
});

router.post("/pwdreset_link", (req, res) => {
  if (req.body.email) {
    User.findOne({ email: req.body.email })
      .then((data) => {
        if (!data) {
          return res.status(404).json({ error: "User does not exist" });
        }

        //Send link to email
        crypto.randomBytes(20, (err, buf) => {
          // Ensure the reset code is unique.
          data.resetToken = data._id + buf.toString("hex");

          data.resetExpiry = Date.now() + 3600 * 1000;
          var link = "http://localhost:3000/reset_pwd/" + data.resetToken;

          mailer.send({
            to: req.body.email,
            subject: "Password Reset Link",
            html:
              'Please click <a href="' +
              link +
              '"> here </a> to reset your password.',
          });

          data
            .save()
            .then((data) => {
              res.status(200).send({
                message: "The link has been sent to your email",
              });
            })
            .catch((err) => {
              return res.status(500).send({ error: err.message });
            });
        });
      })
      .catch((err) => {
        res.status(404).send({ error: err.message });
      });
  } else {
    res.status(400).json({
      error: "An input field is empty",
    });
  }
});

router.patch("/reset_pwd", async (req, res) => {
  if (!req.body.newPwd) {
    return res.status(400).json({ error: "An input field is empty" });
  }
  if (!req.body.resetToken) {
    return res
      .status(400)
      .json({ error: "Please try this later with a valid link" });
  }
  await User.findOne({
    resetToken: req.body.resetToken,
    // check if the expiry time > the current time
    resetExpiry: { $gt: Date.now() },
  })
    .then((data) => {
      if (!data) {
        return res.status(400).send({ error: "Invalid link" });
      } else {
        data.password = req.body.newPwd;
        data.resetToken = undefined;
        data.resetExpiry = undefined;
        data
          .save()
          .then(() => {
            return res
              .status(200)
              .send({ message: "Your password has been reset" });
          })
          .catch((err) => {
            return res.status(500).send({ error: err.message });
          });
      }
    })
    .catch((err) => {
      res.status(404).send({ error: err.message });
    });
});

router.patch("/change_pwd", middleware.authorization, async (req, res) => {
  if (!req.body.oldPwd || !req.body.newPwd) {
    return res.status(400).json({ error: "An input field is empty" });
  }

  User.findById(req.userId, "password")
    .then((data) => {
      if (!data) {
        return res.status(404).send({ error: "User not found" });
      }
      data.comparePassword(req.body.oldPwd, function (err, isMatch) {
        if (err) return res.status(500).json({ error: err.message });
        if (!isMatch) {
          return res.status(400).json({ error: "Incorrect Password" });
        } else {
          data.password = req.body.newPwd;
          data
            .save({ validateModifiedOnly: true })
            .then(
              res.status(200).send({ message: "Password updated successfully" })
            )
            .catch((err) => {
              return res.status(500).send({ error: err.message });
            });
        }
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(404).send({ error: err.message });
    });
});

router.patch("/create_profile", middleware.authorization, (req, res) => {
  User.findById(req.userId, "username registered userType")
    .then((user) => {
      if (!user) {
        return res.status(404).send({ error: "User not found" });
      }
      user.firstName = req.body.firstName;
      user.lastName = req.body.lastName;
      user.address.unit = req.body.address_unit;
      user.address.street = req.body.address_street;
      user.address.postal = req.body.address_postal;
      user.address.country = req.body.address_country;
      user.phone = req.body.phone;
      user.userType = req.body.userType;

      if (user.userType === "Patient") {
        user.healthInsurance.number = req.body.healthInsurance_number;
        user.healthInsurance.expiryMonth = req.body.healthInsurance_expiryMonth;
        user.healthInsurance.expiryYear = req.body.healthInsurance_expiryYear;
        user.alternatePhone = req.body.alternatePhone;
      }
      if (user.userType === "Doctor") {
        user.licenseNumber = req.body.licenseNumber;
        user.isAdmin = false;
        user.faxNumber = req.body.faxNumber;
      }
      if (user.userType === "Group") {
        user.organizationName = req.body.organizationName;
        user.faxNumber = req.body.faxNumber;
      }
      user.registered = true;
      user
        .save({ validateModifiedOnly: true })
        .then(() => {
          middleware.updateWebhook(req.body);

          const token = jwt.sign(
            {
              username: user.username,
              id: user._id,
              registered: user.registered,
            },
            process.env.USER_SECRET,
            { expiresIn: "24h" }
          );

          return res.cookie("jwt", token, { httpOnly: true }).status(200).json({
            message: "Profile created successfully",
            username: user.username,
            userType: user.userType,
          });
        })
        .catch((err) => {
          return res.status(500).send({ error: err.message });
        });
    })
    .catch((err) => {
      return res.status(404).send({ error: err.message });
    });
});

router.patch("/modify_profile", middleware.authorization, (req, res) => {
  User.findById(req.userId, "userType")
    .then((user) => {
      if (!user) {
        return res.status(404).send({ error: "User not found" });
      }

      //Modifying common parts of the Profile
      if (req.body.firstName !== "") {
        user.firstName = req.body.firstName;
      }
      if (req.body.lastName !== "") {
        user.lastName = req.body.lastName;
      }
      if (req.body.address_unit !== "") {
        user.address.unit = req.body.address_unit;
      }
      if (req.body.address_street !== "") {
        user.address.street = req.body.address_street;
      }
      if (req.body.address_country !== "") {
        user.address.country = req.body.address_country;
      }
      if (req.body.address_postal !== "") {
        user.address.postal = req.body.address_postal;
      }
      if (req.body.phone !== "") {
        user.phone = req.body.phone;
      }

      //Modifying Patient Profile
      if (user.userType === "Patient") {
        if (req.body.healthInsurance_number !== "") {
          user.healthInsurance.number = req.body.healthInsurance_number;
        }
        if (req.body.healthInsurance_expiryMonth !== "") {
          user.healthInsurance.expiryMonth =
            req.body.healthInsurance_expiryMonth;
        }
        if (req.body.healthInsurance_expiryYear !== "") {
          user.healthInsurance.expiryYear = req.body.healthInsurance_expiryYear;
        }
        if (req.body.alternatePhone !== "") {
          user.alternatePhone = req.body.alternatePhone;
        }
      }
      //Modifying Doctor Profile
      if (user.userType === "Doctor") {
        if (req.body.licenseNumber !== "") {
          user.licenseNumber = req.body.licenseNumber;
        }
        if (req.body.faxNumber !== "") {
          user.faxNumber = req.body.faxNumber;
        }
      }
      //Modifying Group Profile
      if (user.userType === "Group") {
        if (req.body.organizationName !== "") {
          user.organizationName = req.body.organizationName;
        }
        if (req.body.faxNumber !== "") {
          user.faxNumber = req.body.faxNumber;
        }
      }

      user
        .save()
        .then(() => {
          middleware.updateWebhook(req.body);
          return res.status(200).send({
            message: "Profile updated successfully",
          });
        })
        .catch((err) => {
          return res.status(500).send({
            error: err.message,
          });
        });
    })
    .catch((err) => {
      return res.status(404).send({ error: err.message });
    });
});

router.get("/logout", middleware.authorization, (req, res) => {
  return res.clearCookie("jwt").status(200).json({ message: "Success!" });
});
//Check if user is logged in
router.get("/authentication", middleware.authorization, (req, res) => {
  return res.status(200).send({
    username: req.username,
    userType: req.userType,
  });
});

//Ask user to validate their password
router.post("/reauthentication", middleware.authorization, (req, res) => {
  User.findOne({ _id: req.userId }, "password")
    .then((user) => {
      if (!user) {
        return res.sendStatus(404);
      } else {
        user.comparePassword(req.body.password, function (err, isMatch) {
          if (err) return res.sendStatus(500);
          if (!isMatch) {
            return res.sendStatus(401);
          } else {
            return res.sendStatus(200);
          }
        });
      }
    })
    .catch(() => {
      return res.sendStatus(404);
    });
});

router.post("/app_registration", middleware.authorization, (req, res) => {
  if (req.body.appType === "type-1" && !req.body.webhookURL) {
    return res.status(400).send({ error: "WebhookURL is required" });
  }
  App.create(req.body)
    .then((data) => {
      if (data) {
        const buf = crypto.randomBytes(64);
        data.appSecret = buf.toString("hex");

        data
          .save()
          .then(() => {
            if (req.body.appType === "type-2") {
              const token = jwt.sign(
                {
                  appId: data._id,
                },
                data.plainAppSecret,
                { expiresIn: "24h" }
              );

              return res.status(200).json({
                message: "App created successfully!",
                token: token,
              });
            }

            return res.status(200).json({
              message: "App created successfully!",
              appSecret: data.plainAppSecret,
            });
          })
          .catch((err) => {
            return res.status(500).send({ error: err.message });
          });
      }
    })
    .catch((err) => {
      //Add error 409 for resource with name already exists
      return res.status(500).send({ error: err.message });
    });
});

//To be used by type-2 app
//Request info of user: userID
router.get("/UserInfo", middleware.authorizeApp, (req, res) => {
  User.findById(req.query.userId, { password: 0 })
    .then((user) => {
      if (!user) {
        return res.status(404).send({ error: "User not found" });
      }
      return res.status(200).json(user);
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).send({ error: err.message });
    });
});

//Request info of logged in user
router.get("/user", middleware.authorization, (req, res) => {
  User.findById(req.userId, { password: 0 })
    .then((user) => {
      if (!user) {
        return res.status(404).send({ error: "User not found" });
      }
      return res.status(200).json(user);
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).send({ error: err.message });
    });
});

router.get("/apps", (req, res) => {
  App.find({}, "appName webhookURL appType")
    .then((data) => {
      if (!data) {
        return res
          .status(200)
          .send({ message: "There are no registered apps" });
      }
      return res.status(200).send(data);
    })
    .catch((err) => {
      res.status(500).send({ error: err.message });
    });
});

router.get("/", (req, res) => {
  res.status(200).send("Welcome to Trakadis lab");
});

//For testing (possible feature in the future)
router.delete("/users/:id", middleware.authorization, (req, res, next) => {
  User.findOneAndDelete({ _id: req.params.id })
    .then((data) => res.json(data))
    .catch(next);
});

//For testing
router.get("/users", (req, res, next) => {
  //Return all users, exposing id, username and email
  User.find({}, "username address email")
    .then((data) => res.json(data))
    .catch(next);
});

module.exports = router;
