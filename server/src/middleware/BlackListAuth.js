const BlackListToken = require('../models/blacklistToken')

const VerifyBlackList = async (req, res, next) => {
    const token = req.headers.token;

    try {
        const blacklisted = await BlackListToken.exists({ token: token });

        if (blacklisted) {
            return res.status(401).json({
                statusCode: 401,
                status: "Unauthorized",
                message: "Unauthorized Token!",
            });
        }

        next();
    } catch (error) {
        console.error("Error during token verification:", error);
        return res.status(500).json({
            statusCode: 500,
            status: "Internal Server Error",
            message: "Error during token verification",
        });
    }
};

module.exports = VerifyBlackList;