const express = require("express");
const userCtrl = require("../controllers/user");
const router = express.Router();
const auth = require("../middleware/auth");
const upload = require("../middleware/multer-config");

router.get("/", auth, userCtrl.getAllUser);
router.get("/:id", auth, userCtrl.getOneUser);
router.put("/:id", auth, upload, userCtrl.modifyUser);
router.delete("/:id", auth, userCtrl.deleteUser);

module.exports = router;
