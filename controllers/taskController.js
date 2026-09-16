
const Task = require("../models/Task");
const Project = require("../models/project");
const mongoose = require("mongoose");

const createTask = async (req, res, next) => {
  try {
    const { title, description, status, priority, dueDate, project } = req.body;

    if (project && !mongoose.isValidObjectId(project)) {
      return res.status(400).json({
        message: "Invalid project ID",
      });
    }

    if (project) {
      const projectData = await Project.findById(project);

      if (!projectData) {
        return res.status(404).json({
          message: "Project not found",
        });
      }

      if (projectData.user.toString() !== req.user.userId) {
        return res.status(403).json({
          message: "You do not have access to this project",
        });
      }
    }

    console.log("Reached Task.create");

    const task = await Task.create({
      title,
      description,
      status,
      priority,
      dueDate,
      user: req.user.userId,
      project,
    });

    res.status(201).json({
      message: "Task created successfully",
      task,
    });
  } catch (error) {
    next(error);
  }
};

const getTasks = async (req, res, next) => {
  try {
    const filter = {
      user: req.user.userId,
    };

    if (req.query.status) {
      filter.status = req.query.status;
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;

    const tasks = await Task.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalTasks = await Task.countDocuments(filter);

    res.status(200).json({
      message: "Tasks fetched successfully",
      tasks,
      pagination: {
        page,
        limit,
        totalTasks,
        totalPages: Math.ceil(totalTasks / limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

const getTask = async (req, res, next) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      user: req.user.userId,
    });

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    res.status(200).json({
      message: "Task fetched successfully",
      task,
    });
  } catch (error) {
    next(error);
  }
};

const updateTask = async (req, res, next) => {
  try {
    const { title, description, status, priority, dueDate, project } = req.body;

    if (project && !mongoose.isValidObjectId(project)) {
      return res.status(400).json({
        message: "Invalid project ID",
      });
    }

    if (project) {
      const projectData = await Project.findById(project);

      if (!projectData) {
        return res.status(404).json({
          message: "Project not found",
        });
      }

      if (projectData.user.toString() !== req.user.userId) {
        return res.status(403).json({
          message: "You do not have access to this project",
        });
      }
    }

    const updates = {
      title,
      description,
      status,
      priority,
      dueDate,
      project,
    };

    const task = await Task.findOneAndUpdate(
      {
        _id: req.params.id,
        user: req.user.userId,
      },
      updates,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    res.status(200).json({
      message: "Task updated successfully",
      task,
    });
  } catch (error) {
    next(error);
  }
};

const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      user: req.user.userId,
    });

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    res.status(200).json({
      message: "Task deleted successfully",
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
  deleteTask,
};

