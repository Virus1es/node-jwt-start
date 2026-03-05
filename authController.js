const User = require('./models/User');
const Role = require('./models/Role');
const bcrypt = require('bcryptjs');

class AuthController {
    async registration(req, res) {
        try{
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