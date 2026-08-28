const express = require("express");

const router = express.Router();

const {
    createProject,
    getProjects,
    getProject,
     updateProject,
     deleteProject

} = require("../controllers/projectController");

const authMiddleware = require("../middleware/authMiddleware");

router.post("/", authMiddleware, createProject);

router.get("/", authMiddleware, getProjects);

router.get("/:id", authMiddleware, getProject);
router.put("/:id", authMiddleware, updateProject);
router.delete("/:id", authMiddleware, deleteProject);

module.exports = router;