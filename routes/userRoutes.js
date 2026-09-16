const express = require("express");

const router = express.Router();

const {
    getUsers,
    createUser,
    loginUser
} = require("../controllers/userController");

const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/authorizeMiddleware");

router.get("/", protect, getUsers);
router.get("/admin-test", protect, authorize("admin"), (req, res) => {
    res.json({
        message: "Welcome Admin"
    });
});

router.post("/", createUser);

router.post("/login", loginUser);


module.exports = router;