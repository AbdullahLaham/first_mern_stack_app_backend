import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import User from '../models/user.js';

export const signIn = async (req, res) => {
    const { email, password } = req.body; // just  email, password is accepted in signIn
    try {
        const existingUser = await User.findOne({ email });
        if (!existingUser) return res.status(404).json({ message: "user doesn't exist"});
        // const isPasswordCorrect = await bcrypt.compare(password, existingUser?.password);
        // console.log(password, existingUser?.password)
        if (!(password ==  existingUser?.password)) {
            return res.status(400).json({ message: "Invalid Credentials"})
        } else {
            const token = jwt.sign({email: existingUser?.email, password: existingUser?.password}, 'test', {expiresIn: '1h'});
            res.status(200).json({ result: existingUser, token })
        }
    } catch (err) {
        res.status(500).json({ message: "Something went wrong " });
    }
}
export const signUp = async (req, res) => {
    const { email, password, confirmPassword, firstName, lastName } = req.body;
    console.log('ff', email, password, confirmPassword, firstName, lastName);
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(404).json({ message: "user already exists"});
        if (password !== confirmPassword) {
            return res.status(404).json({ message: "Password don't match"});
        }
        const hashedPassword = await bcrypt.hash(password, 12);
        const result = await User.create({email, password: password, name: `${firstName} ${lastName}`, })
        console.log('gg')
        const token = jwt.sign({email: result?.email, id: result?._id}, 'test', {expiresIn: '1h'});
        res.status(200).json({ result, token })
    }
    catch (error) {
        res.status(500).json({ message: "Something went wrong " });
    }
}