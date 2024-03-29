import User from "../models/user";
import { hashPassword, comparePassword } from "../helpers/auth";
import jwt from "jsonwebtoken";
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

export const register = async (req, res) => {
  try {
    // validation
    const { username, email, password } = req.body;
    if (!username) {
      return res.json({
        error: "username is required",
      });
    }
    if (!password || password.length < 6) {
      return res.json({
        error: "Password is required and should be 6 characters long",
      });
    }
    const exist = await User.findOne({ email });
    if (exist) {
      return res.json({
        error: "Email is taken",
      });
    }
    // hash password
    const hashedPassword = await hashPassword(password);

    // create account in stripe
    const customer = await stripe.customers.create({
      email,
    });
    // console.log("stripe customer created on signup", customer);

    try {
      const user = await new User({
        username,
        email,
        password: hashedPassword,
        stripe_customer_id: customer.id,
      }).save();

      // create signed token
      const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });

      //   console.log(user);
      const { password, ...rest } = user._doc;
      return res.json({
        token,
        user: rest,
      });
    } catch (err) {
      console.log(err);
    }
  } catch (err) {
    console.log(err);
  }
};

export const login = async (req, res) => {
  try {
    // check email
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.json({
        error: "No user found",
      });
    }
    // check password
    const match = await comparePassword(req.body.password, user.password);
    if (!match) {
      return res.json({
        error: "Wrong password",
      });
    }
    // create signed token
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    const { password, ...rest } = user._doc;

    res.json({
      token,
      user: rest,
    });
  } catch (err) {
    console.log(err);
  }
};
// all users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

//user last month
export const getUsersJoinedLastMonth = async (req, res) => {
  try {
    const currentDate = new Date();
    const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    const users = await User.find({
      createdAt: { $gte: startOfMonth, $lte: endOfMonth },
    });
    res.json(users);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal server error" });
  }
};


export const deleteUserById = async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    await stripe.customers.del(user.stripe_customer_id);
    await User.findByIdAndDelete(userId);
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    if (error.name === 'CastError') {
      res.status(400).json({ error: 'Invalid user ID' });
    } else {
      console.log(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
};