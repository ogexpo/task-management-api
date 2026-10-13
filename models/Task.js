
const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, "Task title is required"],
            trim: true,
            minlength: 3,
            maxlength: 100
        },
        description: {
            type: String,
            trim: true,
            default: ""
        },
        status: {
            type: String,
            enum: ["todo", "in-progress", "completed"],
            default: "todo"
        },
        priority: {
            type: String,
            enum: ["low", "medium", "high"],
            default: "medium"
        },
        dueDate: {
            type: Date
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        project: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Project",
            default: undefined
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Task", taskSchema);
