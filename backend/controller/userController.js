const User = require("../model/userModel");
const bycrip = require ("bcrypt");

module.exports.register = async (req, res, next) => {
    try {
        const {username, email, password} = req.body;
        const usernameCheck = await User.findOne({username});
        if (usernameCheck)
            return res.json({msg: "username already used", status: false});
        const emailCheck = await User.findOne({email});
        if (emailCheck)
            return res.json({msg: "email already used", status: false});
        const hashedPassword = await bycrip.hash(password, 10);
        const user = await User.create({
            username,
            email,
            password: hashedPassword,
        });
        delete user.password;
        return res.json({status: true, user});
    } catch (ex) {
        next(ex);
    }

};

module.exports.login = async (req, res, next) => {
    try {
        const {username, password} = req.body;
        const user = await User.findOne({username});
        if (!user)
            return res.json({msg: "incorrect username and password", status: false});
        const isPassword = await bycrip.compare(password, user.password);
        if (!isPassword)
            return res.json({msg: "incorrect username and password", status: false});
        delete user.password;
        return res.json({status: true, user});
    } catch (ex) {
        next(ex);
    }

};

module.exports.getAllUsers = async (req, res, next) => {
    try {
      const users = await User.find({ _id: { $ne: req.params.id } }).select([
        "email",
        "username",
        "avatarImage",
        "_id",
      ]);
      return res.json(users);
    } catch (ex) {
      next(ex);
    }
  };