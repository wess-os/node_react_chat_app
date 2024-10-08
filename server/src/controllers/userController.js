const User = require('../models/userModel');
const bcrypt = require('bcrypt');

module.exports.register = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;

        // check user already exists
        const usernameCheck = await User.findOne({ username });
        if (usernameCheck) return res.json({ msg: 'Esse usuário já existe', status: false });

        // check email already exists
        const emailCheck = await User.findOne({ email });
        if (emailCheck) return res.json({ msg: 'Esse email já existe', status: false });

        // hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // create user
        const user = await User.create({
            email,
            username,
            password: hashedPassword,
        });

        delete user.password;
        return res.json({ user, status: true });
    } catch (error) {
        next(error);
    }
};

module.exports.login = async (req, res, next) => {
    try {
        const { username, password } = req.body;

        // find user
        const user = await User.findOne({ username });
        if (!user) return res.json({ msg: 'Usuário ou senha incorretos', status: false });

        // check password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) return res.json({ msg: 'Usuário ou senha incorretos', status: false });

        delete user.password;
        return res.json({ user, status: true });
    } catch (error) {
        next(error);
    }
};

module.exports.setAvatar = async (req, res, next) => {
    try {
        const userId = req.params.id;
        const avatarImage = req.body.image;

        const userData = await User.findByIdAndUpdate(
            userId, {
                isAvatarImageSet: true,
                avatarImage,
            }
        );

        return res.json({ 
            isSet: userData.isAvatarImageSet, 
            image: userData.avatarImage 
        });
    } catch (error) {
        next(error);
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
    } catch (error) {
        next(error);
    }
}