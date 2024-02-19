const express = require("express");
const router = express.Router();
const authCtrl = require("../controllers/auth");
const upload = require("../middleware/multer-config");

router.post("/signup", upload, authCtrl.signup);
router.post("/login", authCtrl.login);

module.exports = router;
