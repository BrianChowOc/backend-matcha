const User = require("../models/user");

exports.getAllUser = async (req, res, next) => {
  try {
    const users = await User.find();

    const usersWithoutPassword = users.map(user => {
      const userWithoutPassword = {...user._doc}
      delete userWithoutPassword.information.password;
      return userWithoutPassword;
    })
    res.status(200).json(usersWithoutPassword)
  }
  catch {
    res.status(500).json({ error })
  }
};

exports.getOneUser = (req, res, next) => {
  User.findOne({ _id: req.params.id })
    .then((user) => {
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      const userWithoutPassword = {...user._doc}
      delete userWithoutPassword.information.password;
      return res.status(200).json(user);
    })
    .catch((error) => res.status(500).json({ error }));
};

exports.modifyUser = (req, res, next) => {
  User.updateOne({ _id: req.params.id }, { ...req.body, _id: req.params.id })
    .then(() => res.status(200).json({ message: "User modified !" }))
    .catch((error) => res.status(400).json({ error }));
};

exports.deleteUser = (req, res, next) => {
  User.deleteOne({ _id: req.params.id })
    .then(() => res.status(200).json({ message: "User deleted !" }))
    .catch((error) => res.status(400).json({ error }));
};

