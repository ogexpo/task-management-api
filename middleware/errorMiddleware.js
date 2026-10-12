
const errorHandler = (err, req, res, next) => {
    if (res.headersSent) {
        return next(err);
    }

    if (err.name === "CastError") {
        return res.status(400).json({
            message: "Invalid ID format"
        });
    }

    if (err.name === "ValidationError") {
        return res.status(400).json({
            message: "Validation failed. Please check your input."
        });
    }

    if (
        err.name === "JsonWebTokenError" ||
        err.name === "TokenExpiredError" ||
        err.name === "NotBeforeError"
    ) {
        return res.status(401).json({
            message: "Invalid or expired authentication token"
        });
    }

    if (err.code === 11000) {
        return res.status(409).json({
            message: "Duplicate value already exists"
        });
    }

    console.error("Unhandled error:", err);

    return res.status(500).json({
        message: "Internal server error"
    });
};

module.exports = errorHandler;
