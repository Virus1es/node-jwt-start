const User = require('./models/User');
const Role = require('./models/Role');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {validationResult} = require('express-validator');
const {secret} = require('./config');

const generateAccessToken = (id, roles) => {
    const payload = {
        id,
        roles
    };
    return jwt.sign(payload, secret, {expiresIn: "24h"});
}

class AuthController {
    async registration(req, res) {
        try{
            const errors = validationResult(req);
            if(!errors.isEmpty()){
                return res.status(400).json({message: 'Registration error', errors})
            }

            const {username, password} = req.body;
            const candidate = await User.findOne({username});
            if(candidate){
                return res.status(400).json({message: 'User already exists'});
            }

            const hashPassword = bcrypt.hashSync(password, 7);
            const userRole = await Role.findOne({value: "USER"});
            await User.create({username, password: hashPassword, roles: [userRole.value]});
            return res.json({message: 'User create is success'});
        } catch (e) {
            console.log(e);
            res.status(400).json({message: 'Registration error'});
        }
    }

    async login(req, res) {
        try{
            const {username, password} = req.body;
            const user = await User.findOne({username});
            if(!user) {
                return res.status(400).json({message: `No user with that username: ${username}`});
            }

            const validPassword = bcrypt.compareSync(password, user.password);
            if(!validPassword) {
                return res.status(400).json({message: 'Password don\'t match'});
            }

            const token = generateAccessToken(user._id, user.roles);
            return res.json({token});
        } catch (e) {
            console.log(e);
            res.status(400).json({message: 'Login error'});
        }
    }

    async getUsers(req, res) {
        try{
            res.json(await User.find());
        } catch (e) {
            console.log(e);
        }
    }
}

module.exports = new AuthController();