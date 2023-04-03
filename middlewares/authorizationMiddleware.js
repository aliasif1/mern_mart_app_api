const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token){
        return res.status(400).json({error: 'Missing JWT Token'});
    }
    try{
        const tokenData = jwt.verify(token, process.env.SECRET);
        req.user = tokenData
        next();
    }
    catch(e){
        res.status(400).json({error: e.message});
    }
}

module.exports = {verifyToken}