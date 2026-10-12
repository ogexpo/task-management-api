
const mongoose = require("mongoose");
const Task = require("../models/Task");
const Project = require("../models/project");

const createTask = async (req, res, next) => {
    try {
        const {
            title,
            description,
            status,
            priority,
            dueDate,
            project
        } = req.body || {};

        // Validate title
        if (typeof title !== "string" || !title.trim()) {
            return res.status(400).json({
                message: "Task title is required"
            });
        }

        if (title.trim().length < 3) {
            return res.status(400).json({
                message: "Task title must be at least 3 characters long"
            });
        }

        if (title.trim().length > 100) {
            return res.status(400).json({
                message: "Task title cannot exceed 100 characters"
            });
        }

        // Validate description
        if (
            description !== undefined &&
            typeof description !== "string"
        ) {
            return res.status(400).json({
                message: "Description must be a string"
            });
        }

        // Validate project ownership
        if (project) {
            if (!mongoose.isValidObjectId(project)) {
                return res.status(400).json({
                    message: "Invalid project ID"
                });
            }

            const projectData = await Project.findOne({
                _id: project,
                user: req.user.userId
            });

            if (!projectData) {
                return res.status(404).json({
                    message: "Project not found"
                });
            }
        }

        const task = await Task.create({
            title: title.trim(),
            description:
                description === undefined
                    ? undefined
                    : description.trim(),
            status,
            priority,
            dueDate,
            user: req.user.userId,
            project: project || undefined
        });

        return res.status(201).json({
            message: "Task created successfully",
            task
        });
    } catch (error) {
        next(error);
    }
};

const getTasks = async (req, res, next) => {
    try {
        const filter = {
            user: req.user.userId
        };

        // Filter by status
        if (req.query.status) {
            const allowedStatuses = [
                "todo",
                "in-progress",
                "completed"
            ];

            if (!allowedStatuses.includes(req.query.status)) {
                return res.status(400).json({
                    message: "Invalid task status"
                });
            }

            filter.status = req.query.status;
        }

        // Pagination
        const page = Number(req.query.page ?? 1);
        const limit = Number(req.query.limit ?? 5);

        if (
            !Number.isInteger(page) ||
            page < 1 ||
            !Number.isInteger(limit) ||
            limit < 1 ||
            limit > 100
        ) {
            return res.status(400).json({
                message:
                    "Page must be positive and limit must be between 1 and 100"
            });
        }

        const skip = (page - 1) * limit;

        const tasks = await Task.find(filter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const totalTasks = await Task.countDocuments(filter);

        return res.status(200).json({
            message: "Tasks fetched successfully",
            tasks,
            pagination: {
                page,
                limit,
                totalTasks,
                totalPages: Math.ceil(totalTasks / limit)
            }
        });
    } catch (error) {
        next(error);
    }
};

const getTask = async (req, res, next) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({
                message: "Invalid task ID"
            });
        }

        const task = await Task.findOne({
            _id: req.params.id,
            user: req.user.userId
        });

        if (!task) {
            return res.status(404).json({
                message: "Task not found"
            });
        }

        return res.status(200).json({
            message: "Task fetched successfully",
            task
        });
    } catch (error) {
        next(error);
    }
};

const updateTask = async (req, res, next) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({
                message: "Invalid task ID"
            });
        }

        const body = req.body || {};

        const allowedFields = [
            "title",
            "description",
            "status",
            "priority",
            "dueDate",
            "project"
        ];

        const updates = {};

        for (const field of allowedFields) {
            if (Object.prototype.hasOwnProperty.call(body, field)) {
                updates[field] = body[field];
            }
        }

        if (Object.keys(updates).length === 0) {
            return res.status(400).json({
                message: "Provide at least one field to update"
            });
        }

        // Validate title
        if (Object.hasOwn(updates, "title")) {
            if (
                typeof updates.title !== "string" ||
                !updates.title.trim()
            ) {
                return res.status(400).json({
                    message: "Task title cannot be empty"
                });
            }

            updates.title = updates.title.trim();

            if (updates.title.length < 3) {
                return res.status(400).json({
                    message:
                        "Task title must be at least 3 characters long"
                });
            }

            if (updates.title.length > 100) {
                return res.status(400).json({
                    message: "Task title cannot exceed 100 characters"
                });
            }
        }

        // Validate description
        if (Object.hasOwn(updates, "description")) {
            if (typeof updates.description !== "string") {
                return res.status(400).json({
                    message: "Description must be a string"
                });
            }

            updates.description = updates.description.trim();
        }

        // Validate project ownership
        if (Object.hasOwn(updates, "project") && updates.project) {
            if (!mongoose.isValidObjectId(updates.project)) {
                return res.status(400).json({
                    message: "Invalid project ID"
                });
            }

            const projectData = await Project.findOne({
                _id: updates.project,
                user: req.user.userId
            });

            if (!projectData) {
                return res.status(404).json({
                    message: "Project not found"
                });
            }
        }

        const task = await Task.findOneAndUpdate(
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

        if (!task) {
            return res.status(404).json({
                message: "Task not found"
            });
        }

        return res.status(200).json({
            message: "Task updated successfully",
            task
        });
    } catch (error) {
        next(error);
    }
};

const deleteTask = async (req, res, next) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({
                message: "Invalid task ID"
            });
        }

        const task = await Task.findOneAndDelete({
            _id: req.params.id,
            user: req.user.userId
        });

        if (!task) {
            return res.status(404).json({
                message: "Task not found"
            });
        }

        return res.status(200).json({
            message: "Task deleted successfully"
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createTask,
    getTasks,
    getTask,
    updateTask,
    deleteTask
};
