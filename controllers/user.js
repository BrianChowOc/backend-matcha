const User = require("../models/user");
const fs = require("fs");
const bcrypt = require("bcrypt");
const { log } = require("console");

exports.getAllUser = async (req, res, next) => {
  try {
    const users = await User.find();

    const usersWithoutPassword = users.map((user) => {
      const userWithoutPassword = { ...user._doc };
      delete userWithoutPassword.information.password;
      return userWithoutPassword;
    });
    res.status(200).json(usersWithoutPassword);
  } catch {
    res.status(500).json({ error });
  }
};

exports.getOneUser = (req, res, next) => {
  User.findOne({ _id: req.params.id })
    .then((user) => {
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      const userWithoutPassword = { ...user._doc };
      delete userWithoutPassword.information.password;
      return res.status(200).json(user);
    })
    .catch((error) => res.status(500).json({ error }));
};

exports.modifyUser = (req, res, next) => {
  User.findOne({ _id: req.auth.userId }).then((user) => {
    const information = JSON.parse(req.body.information);
    const profil = JSON.parse(req.body.profil);
    const interests = JSON.parse(req.body.interests);
    bcrypt
      .hash(information.password, 10)
      .then((hash) => {
        information.password = hash;
        User.updateOne(
          { _id: req.params.id },
          {
            information,
            profil,
            interests,
            biographie: req.body.biographie,
            profilImg: `${req.protocol}://${req.get("host")}/images/${
              req.files.profilImg[0].filename
            }`,
            picture1: `${req.protocol}://${req.get("host")}/images/${
              req.files.picture1[0].filename
            }`,
            picture2: `${req.protocol}://${req.get("host")}/images/${
              req.files.picture2[0].filename
            }`,
            picture3: `${req.protocol}://${req.get("host")}/images/${
              req.files.picture3[0].filename
            }`,
            picture4: `${req.protocol}://${req.get("host")}/images/${
              req.files.picture4[0].filename
            }`,
            backgroundImage: `${req.protocol}://${req.get("host")}/images/${
              req.files.backgroundImage[0].filename
            }`,
          }
        )
          .then(() => res.status(200).json({ message: "User modified !" }))
          .catch((error) => res.status(400).json({ error }));
      })
      .catch((error) => {
        console.log("ERROR", error);
        res.status(500).json({ error })});
  });
};

exports.deleteUser = (req, res, next) => {
  User.findOne({ _id: req.auth.userId })
    .then((user) => {
      const filename = user.profilImg.split("/images/")[1];
      fs.unlink(`images/${filename}`, () => {
        User.deleteOne({ _id: req.auth.userId })
          .then(() => res.status(200).json({ message: "User deleted !" }))
          .catch((error) => res.status(400).json({ error }));
      });
    })
    .catch((error) => res.status(500).json({ error }));
};
