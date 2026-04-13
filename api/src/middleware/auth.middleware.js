const jwt = require('jsonwebtoken');
const User = require('../models/User');


//Read the token from the request
//Check if token is valid
const authMiddleware = async (req, res, next) => {
    console.log("Auth middleware reached");
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")){
        token = req.headers.authorization.split(" ")[1] // splitting "Bearer" & token content & we keep index[1]=>token content
    } else if (req.cookie?.jwt) {
        token = req.cookie.jwt
    }

    if(!token){
        return res.status(401).json({error: "Not authorized, no token provided"})
    }

    try{
        //verify token and extract the userId
        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        const user = await User.findOne({
            _id: decoded.id
        })
        if (!user){
            return res.status(401).json({error: "User no longer exists"})
        }
        req.user = user;
        next();

    } catch (err){
        return res.status(401).json({error: "Not authorized, token failed"})

    }


}

module.exports = authMiddleware