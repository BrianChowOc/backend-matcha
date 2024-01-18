const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const userSchema = mongoose.Schema({
  information: {
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  },
  profil: {
    genre: { type: String, required: true },
    sexualOrientation: { type: String, required: true },
    birth: { type: String, required: true },
    city: { type: String, required: true },
  },
  interests: [{ type: String }],
  biographie: { type: String, required: true },
  profilImg: { type: String },
  imageList: [{ type: String }],
  backgroundImage: { type: String },
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("User", userSchema);
