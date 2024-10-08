const User = require("../models/UserModel")
const bcrypt = require("bcrypt")
const { genneralAccessToken, genneralRefreshToken } = require("./jwtService")

const createUser = (newUser) => {
    return new Promise(async (resolve, reject) => {
        const { name, email, password, confirmPassword, phone } = newUser

        try {
            const checkUser = await User.findOne({
                email: email
            })
            if (checkUser !== null) {
                resolve({
                    status: "ERR",
                    message: "The email is already"
                })
            }
            const hash = bcrypt.hashSync(password, 10);
            const createdUser = await User.create({
                name,
                email,
                password: hash,
                phone
            })
            if (createdUser) {
                resolve({
                    status: "OK",
                    message: "SUCCESS",
                    data: createdUser
                })
            }

        } catch (e) {
            reject(e)
        }
    })
}
const loginUser = (userLogin) => {
    return new Promise(async (resolve, reject) => {

        const { email, password } = userLogin

        try {
            const checkUser = await User.findOne({
                email: email
            })

            if (checkUser === null) {
                return reject({
                    status: "ERR",
                    message: "The user is not define"
                })
            }
            const comparePassword = bcrypt.compareSync(password, checkUser.password);
            if (!comparePassword) {
                return reject({
                    status: "ERR",
                    message: "The pasword or user is incorrect",
                })
            }
            const access_token = await genneralAccessToken({
                id: checkUser._id,
                isAdmin: checkUser.isAdmin
            })
            const refresh_token = await genneralRefreshToken({
                id: checkUser._id,
                isAdmin: checkUser.isAdmin
            })
            resolve({
                status: "OK",
                message: "SUCCESS",
                access_token,
                refresh_token
            })

        } catch (e) {
            reject(e)
        }
    })
}
const updateUser = (id, data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkUser = await User.findById(id)
            if (checkUser === null) {
                resolve({
                    status: "ERR",
                    message: "The user is not define"
                })
            }
            const updatedUser = await User.findByIdAndUpdate(id, data, { new: true })
            resolve({
                status: "OK",
                message: "SUCCESS",
                data: updatedUser
            })

        } catch (e) {
            reject(e)
        }
    })
}
const deleteUser = (id) => {
    return new Promise(async (resolve, reject) => {

        try {
            const checkUser = await User.findById(id)
            if (checkUser === null) {
                resolve({
                    status: "OK",
                    message: "The user is not define"
                })
            }
            await User.findByIdAndDelete(id)
            resolve({
                status: "OK",
                message: "Delete user success"
            })

        } catch (e) {
            reject(e)
        }
    })
}
const deleteManyUser = (ids) => {
    return new Promise(async (resolve, reject) => {

        try {
            await User.deleteMany({_id: ids})
            resolve({
                status: "OK",
                message: "Delete user success"
            })

        } catch (e) {
            reject(e)
        }
    })
}
const getAllUser = () => {
    return new Promise(async (resolve, reject) => {

        try {
            const allUser = await User.find()
            resolve({
                status: "OK",
                message: "Success",
                data: allUser
            })

        } catch (e) {
            reject(e)
        }
    })
}
const getDetailsUser = async (id) => {
    return new Promise(async (resolve, reject) => {

        try {
            const user = await User.findById(id)
            if (!user) {
                return resolve({
                    status: "ERR",
                    message: "The user is not define"
                })
            }
            console.log(user);
            
            resolve({
                status: "OK",
                message: "Success",
                data: user
            })

        } catch (e) {
            reject(e)
        }
    })
}

module.exports = {
    createUser,
    loginUser,
    updateUser,
    deleteUser,
    getAllUser,
    getDetailsUser,
    deleteManyUser
}