const jwt = require('jsonwebtoken');
const dotenv = require("dotenv")
dotenv.config()

const authMiddleware = (req, res, next)=>{
    const token = req.headers.token.split(' ')[1]
    jwt.verify(token, process.env.ACCESS_TOKEN, (err,user)=> {
        if(err){
            return res.status(404).json({
                message: "The authentication",
                status: "ERROR"
            })
        }

        if(user?.isAdmin){
            next()
        }else{
            return res.status(404).json({
                message: "The authentication",
                status: "ERROR"
            })
        }
        console.log("user",user)
      });
}
// const authUserMiddleware = (req, res, next)=>{
//     const token = req.headers.token.split(' ')[1]
//     const userId = req.params.id
//     jwt.verify(token, process.env.ACCESS_TOKEN,(err,user) =>{
//         if(err){
//             return res.status(404).json({
//                 message: "The authentication",
//                 status: "ERROR"
//             })
//         }
//         if(user?.isAdmin|| user?.id === userId){
//             next();
//         }else{
//             return res.status(404).json({
//                 message: "The authentication",
//                 status: "ERROR"
//             })
//         }
//         console.log("user",user)
//       });
// }

const authUserMiddleware = (req, res, next) => {
    const authHeader = req.headers.token;

    // Kiểm tra token
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
            message: "No token provided",
            status: "ERROR"
        });
    }

    const token = authHeader.split(' ')[1];

    jwt.verify(token, process.env.ACCESS_TOKEN, (err, user) => {
        if (err) {
            return res.status(403).json({
                message: "Token is invalid or expired",
                status: "ERROR"
            });
        }

        // Kiểm tra quyền truy cập
        if (user?.isAdmin || user?.id === req.params.id) {
            return next();
        } else {
            return res.status(403).json({
                message: "You do not have permission",
                status: "ERROR"
            });
        }
    });
};
module.exports = {
    authMiddleware,
    authUserMiddleware
}