const { register, login, getAllUsers } = require("../controller/userController");

const router = require("express").Router();

router.post("/register", register)
router.post("/login", login)
router.get("/alluser/:id", getAllUsers)

module.exports = router;