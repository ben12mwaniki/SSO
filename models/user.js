const mongoose = require("mongoose"),
  Schema = mongoose.Schema,
  bcrypt = require("bcrypt"),
  SALT_WORK_FACTOR = 10,
  uniqueValidator = require("mongoose-unique-validator");

// Create schema for User
const UserSchema = new Schema(
  {
    username: {
      type: String,
      match: [/^[a-zA-Z0-9]+$/, "invalid username"],
      lowercase: true,
      required: [true, "The username text field is required"],
      unique: [true, "Username is already taken"],
      index: true,
    },
    email: {
      type: String,
      match: [/\S+@\S+\.\S+/, "invalid email"],
      lowercase: true,
      required: [true, "The email text field is required"],
      unique: [true, "Email already in use"],
      index: true,
    },
    password: {
      type: String,
      minlength: 6,
      required: [true, "The password text field is required"],
    },
    activated: {
      type: Boolean,
      default: false,
    },
    activationToken: String,
    activationExpiry: Date,
    resetToken: String,
    resetExpiry: Date,
    firstName: String,
    lastName: String,
    registered: Boolean,
    address: { unit: Number, street: String, country: String, postal: String },
    phone: { type: Number, maxlength: 10 },
    userType: {
      type: String,
    },
    licenseNumber: String,
    isAdmin: {
      type: Boolean,
    },
    faxNumber: Number,
    healthInsurance: {
      number: String,
      expiryYear: { type: String, minlength: 2, maxlength: 4 },
      expiryMonth: { type: String, maxlength: 2 },
    },

    alternatePhone: { type: String, maxlength: 10 },
    organizationName: String,
  },
  { timestamps: true }
);

UserSchema.pre("save", function (next) {
  var user = this;

  // only hash the password if it has been modified (or is new)
  if (!user.isModified("password")) return next();

  // generate a salt
  bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
    if (err) return next(err);

    // hash the password using new salt
    bcrypt.hash(user.password, salt, function (err, hash) {
      if (err) return next(err);

      // override the cleartext password with the hashed one
      user.password = hash;
      next();
    });
  });
});

//Password validation
UserSchema.methods.comparePassword = function (candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
    if (err) return cb(err);
    cb(null, isMatch);
  });
};

UserSchema.plugin(uniqueValidator, { message: "is already taken" });

// Create model for User
const User = mongoose.model("User", UserSchema);
module.exports = User;
