const mongoose = require("mongoose"),
  Schema = mongoose.Schema;

const AppSchema = new Schema(
  {
    name: {
      type: String,
      index: true,
    },
    webhookURL: String,
    appSecret: String,
    initVector: String,
  },
  { timestamps: true }
);

UserSchema.pre("save", function (next) {
  var app = this;

  // encrypt appSecret on app creation/modification of field
  if (!app.isModified("appSecret")) return next();

  const crypto = require("crypto");
  const algorithm = "aes-256-cbc";
  const initVector = crypto.randomBytes(16);

  // unprotected appSecret
  const buf = crypto.randomBytes(64);
  const app_secret = buf.toString("hex");

  const cipher = crypto.createCipheriv(
    algorithm,
    process.env.CRYPT_SECRET,
    initVector
  );

  // encrypt appSecret
  let encryptedData = cipher.update(app_secret, "utf-8", "hex");
  encryptedData += cipher.final("hex");

  this.appSecret = encryptedData;
  this.initVector = initVector;
});

// Create model for application
const App = mongoose.model("App", AppSchema);
module.exports = App;
