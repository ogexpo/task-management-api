const express = require("express");

const router = express.Router();

const {
    getUsers,
    createUser,
    loginUser
} = require("../controllers/userController");

const protect = require("../middleware/authMiddleware");

router.get("/", protect, getUsers);

router.post("/", createUser);

router.post("/login", loginUser);

module.exports = router;