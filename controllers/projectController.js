const Project = require("../models/project");

const createProject = async (req, res, next) => {
    try {
        const { name, description, status } = req.body;

        if (!name) {
            return res.status(400).json({
                message: "Project name is required"
            });
        }

        const project = await Project.create({
            name,
            description,
            status,
            user: req.user.userId
        });

        res.status(201).json({
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

        res.status(200).json({
            message: "Projects fetched successfully",
            projects
        });

    } catch (error) {
        next(error);
    }
};

const getProject = async (req, res, next) => {
    try {
        const project = await Project.findOne({
            _id: req.params.id,
            user: req.user.userId
        });

        if (!project) {
            return res.status(404).json({
                message: "Project not found"
            });
        }

        res.status(200).json({
            message: "Project fetched successfully",
            project
        });

    } catch (error) {
        next(error);
    }
};

const updateProject = async (req, res, next) => {
    try {
        const { name, description, status } = req.body;

        const updates = {};

        if (name !== undefined) updates.name = name;
        if (description !== undefined) updates.description = description;
        if (status !== undefined) updates.status = status;

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

        res.status(200).json({
            message: "Project updated successfully",
            project
        });

    } catch (error) {
        next(error);
    }
};

const deleteProject = async (req, res, next) => {
    try {
        const project = await Project.findOneAndDelete({
            _id: req.params.id,
            user: req.user.userId
        });

        if (!project) {
            return res.status(404).json({
                message: "Project not found"
            });
        }

        res.status(200).json({
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