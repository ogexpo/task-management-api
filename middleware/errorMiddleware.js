const errorHandler = (err, req, res, next) => {

    if (err.name === "CastError") {
        return res.status(400).json({
            message: "Invalid ID format"
        });
    }

    if (err.name === "JsonWebTokenError") {
        return res.status(401).json({
            message: "Not authorized, invalid token"
        });
    }

    if (err.name === "TokenExpiredError") {
        return res.status(401).json({
            message: "Not authorized, token expired"
        });
    }

    res.status(500).json({
        message: err.message || "Something went wrong"
    });
};

module.exports = errorHandler;