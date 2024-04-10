import dotenv from 'dotenv';

const auth = {};
dotenv.config();

auth.isAuthenticated = (req, res) => {
    if(process.env.CUSTOMCONNSTR_key == req.headers.key) {
        res.status(200).send({
            "status": res.statusCode,
            "message": "Success",
            "authenticated": true
        });
    } else {
        res.status(200).send({
            "status": res.statusCode,
            "message": "Success",
            "authenticated": false
        });
    }
};

export default auth;