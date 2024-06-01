import jwt from "jsonwebtoken";
import User from "../../../models/v1/user.model.js";


const authenticate = async (req, res, next) => {
    try {
        const authorization = req.headers.authorization;
        const [bearer, token] = authorization.split(' ');
        if(bearer !== undefined && bearer !== "Bearer") {
            return res.status(401).json({
                message: 'Malformed header'
            });
        }
        if(token === undefined || token === "") {
            return res.status(401).json({
                message: 'Token is required to access this route'
            });
        }
        const {email, _id} = jwt.verify(token, process.env.JWT_SECRET, null, null);
        const user = await User.findOne({
            email, _id, "auth.token": token
        });
        if (!user) {
            return res.status(401).json({
                message: 'Authentication failed'
            });
        }
        req.user = user;
        next()
    }catch (e) {
        res.status(500).json({message: e.message});
    }
}

export default authenticate;