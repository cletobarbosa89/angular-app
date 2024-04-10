import dotenv from 'dotenv';

let auth;

dotenv.config();

export default auth = function(req, res, next) {
    if(req.headers.key == process.env.CUSTOMCONNSTR_key)
        next();
    else
        res.status(401).json({
            code: res.statusCode,
            message: "Unauthorized"
        });
}