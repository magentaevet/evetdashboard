const jwt = require('jsonwebtoken');
const User = require("../model/userSchema");


const Authenticate = async (req, res, next) => {
    try {
        const token = req.cookies.jwttoken;
        const verifyTokens = jwt.verify(token, process.env.SECRET_KEY);
        const rootUser = await User.findOne({ _id: verifyTokens._id, "tokens.token": token });
         console.log("Rootuser",rootUser);
        if (!rootUser) {
            throw new Error('User Not Found');
        }
        req.token = token;
        req.rootUser = rootUser;
        req.userID = rootUser._id;

        next();

    } catch (err) {
        res.status(400).send("Unauthorized : No token Provide");
        console.log(err);
    }
}

module.exports = Authenticate;