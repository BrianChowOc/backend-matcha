const User = require("../models/user");
const fs = require('fs');
const bcrypt = require("bcrypt");

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
            req.file.filename
          }`,
        }
      )
        .then(() => res.status(200).json({ message: "User modified !" }))
        .catch((error) => res.status(400).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
    
  });
};

exports.deleteUser = (req, res, next) => {
  User.findOne({_id: req.auth.userId})
  .then(user => {
    const filename = user.profilImg.split("/images/")[1];
    fs.unlink(`images/${filename}`, () => {
      User.deleteOne({ _id: req.auth.userId })
      .then(() => res.status(200).json({ message: "User deleted !" }))
      .catch((error) => res.status(400).json({ error }));
    })
   
  })
  .catch((error) => res.status(500).json({ error }))
  
};
