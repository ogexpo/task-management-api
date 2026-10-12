
const mongoose = require("mongoose");
const Project = require("../models/project");

const createProject = async (req, res, next) => {
    try {
        const { name, description, status } = req.body || {};

        if (typeof name !== "string" || !name.trim()) {
            return res.status(400).json({
                message: "Project name is required"
            });
        }

        if (name.trim().length > 100) {
            return res.status(400).json({
                message: "Project name cannot exceed 100 characters"
            });
        }

        if (
            description !== undefined &&
            typeof description !== "string"
        ) {
            return res.status(400).json({
                message: "Description must be a string"
            });
        }

        const project = await Project.create({
            name: name.trim(),
            description,
            status,
            user: req.user.userId
        });

        return res.status(201).json({
            message: "Project created successfully",
            project
        });
    } catch (error) {
        next(error);
    }
};

const getProjects = async (req, res, next) => {
    try {
        const projects = await Project.find({
            user: req.user.userId
        });

        return res.status(200).json({
            message: "Projects fetched successfully",
            projects
        });
    } catch (error) {
        next(error);
    }
};

const getProject = async (req, res, next) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({
                message: "Invalid project ID"
            });
        }

        const project = await Project.findOne({
            _id: req.params.id,
            user: req.user.userId
        });

        if (!project) {
            return res.status(404).json({
                message: "Project not found"
            });
        }

        return res.status(200).json({
            message: "Project fetched successfully",
            project
        });
    } catch (error) {
        next(error);
    }
};

const updateProject = async (req, res, next) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({
                message: "Invalid project ID"
            });
        }

        const { name, description, status } = req.body || {};
        const updates = {};

        if (name !== undefined) {
            if (typeof name !== "string" || !name.trim()) {
                return res.status(400).json({
                    message: "Project name cannot be empty"
                });
            }

            if (name.trim().length > 100) {
                return res.status(400).json({
                    message: "Project name cannot exceed 100 characters"
                });
            }

            updates.name = name.trim();
        }

        if (description !== undefined) {
            if (typeof description !== "string") {
                return res.status(400).json({
                    message: "Description must be a string"
                });
            }

            updates.description = description;
        }

        if (status !== undefined) {
            updates.status = status;
        }

        if (Object.keys(updates).length === 0) {
            return res.status(400).json({
                message: "Provide at least one valid field to update"
            });
        }

        const project = await Project.findOneAndUpdate(
            {
                _id: req.params.id,
                user: req.user.userId
            },
            updates,
            {
                new: true,
                runValidators: true
            }
        );

        if (!project) {
            return res.status(404).json({
                message: "Project not found"
            });
        }

        return res.status(200).json({
            message: "Project updated successfully",
            project
        });
    } catch (error) {
        next(error);
    }
};

const deleteProject = async (req, res, next) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({
                message: "Invalid project ID"
            });
        }

        const project = await Project.findOneAndDelete({
            _id: req.params.id,
            user: req.user.userId
        });

        if (!project) {
            return res.status(404).json({
                message: "Project not found"
            });
        }

        return res.status(200).json({
            message: "Project deleted successfully"
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createProject,
    getProjects,
    getProject,
    updateProject,
    deleteProject
};
