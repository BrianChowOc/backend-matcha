const bcrypt = require("bcrypt");
const User = require("../models/user");
const jwt = require("jsonwebtoken");

exports.signup = (req, res, next) => {
  
  const information = JSON.parse(req.body.information);
  const profil = JSON.parse(req.body.profil);
  const interests = JSON.parse(req.body.interests);

  bcrypt
    .hash(information.password, 10)
    .then((hash) => {
      information.password = hash;
      const user = new User({
        information,
        profil,
        biographie: req.body.biographie,
        interests,
        profilImg: `${req.protocol}://${req.get("host")}/images/${
          req.file.filename
        }`,
      });
      user
        .save()
        .then(() => res.status(201).json({ message: "User created !" }))
        .catch((error) => res.status(400).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};

exports.login = (req, res, next) => {
  User.findOne({ "information.email": req.body.email })
    .then((user) => {
      if (!user) {
        return res.status(401).json({ message: "Incorrect informations" });
      }
      bcrypt
        .compare(req.body.password, user.information.password)
        .then((valid) => {
          if (!valid) {
            return res.status(401).json({ message: "Incorrect informations" });
          }
          res.status(200).json({
            userId: user._id,
            token: jwt.sign({ userId: user._id }, "RANDOM_TOKEN_SECRET", {
              expiresIn: "24h",
            }),
          });
        })
        .catch((error) => res.status(500).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};
