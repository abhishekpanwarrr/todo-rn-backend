import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const userExist = await User.findOne({ email });
    if (userExist) {
      return res
        .status(404)
        .json({ msg: "User already exist with this email" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });
    await newUser.save();
    newUser.password = undefined;
    res.status(201).json({ msg: "User created successfully", data: newUser });
  } catch (error) {
    console.log("🚀 ~ register ~ error:", error);
    res.status(500).json({ msg: "Error in createing user" });
  }
};

// const login = async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(404).json({ error: "User not found" });
//     }
//     const isPasswordValid = await bcrypt.compare(password, user?.password);

//     if (!isPasswordValid) {
//       return res.status(401).json({ msg: "Invalid password" });
//     }
//     const tokenPayload = {
//       userId: user._id,
//       name: user.name,
//       email: user.email,
//     };

//     const token = jwt.sign(tokenPayload, process.env.ACCESS_TOKEN_SECRET, {
//       expiresIn: "1w",
//     });
//     res
//       .status(200)
//       .json({ msg: "Login successful", token, user: tokenPayload });
//   } catch (error) {
//     console.log("🚀 ~ login ~ error:", error);
//     res.status(500).json({ msg: "Error in login user" });
//   }
// };

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ status: 400, msg: "User does not exist" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ status: 400, msg: "Invalid credentials" });
    }
    const userWithoutPassword = { ...user._doc };
    delete userWithoutPassword.password;
    const token = jwt.sign(
      { userId: user?._id, email: user?.email, name: user?.name },
      process.env.ACCESS_TOKEN_SECRET
    );

    res.status(200).json({ status: 200, token, user: userWithoutPassword });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
export { register, login };
