import { json } from "express";
import { comparePassword, hashPassword } from "../helpers/auth.js";
import orderModal from "../models/orderModal.js";
import userModel from "../models/userModel.js";
import JWT from "jsonwebtoken";

export const registerController = async (req, res) => {
  try {
    const { name, email, password, confirmPassword, role, address, answer } =
      req.body;

    // validation

    if (!name) {
      return res.send({ message: "Name is required" });
    }
    if (!email) {
      return res.send({ message: "Email is required" });
    }
    if (!password) {
      return res.send({ message: "Password is required" });
    }
    if (!confirmPassword) {
      return res.send({ message: "Confirm Password is required" });
    }
    if (!address) {
      return res.send({ message: "Address is required" });
    }
    if (!answer) {
      return res.send({ message: "Answer is required" });
    }
    if (password !== confirmPassword) {
      return res.send({
        message: "Confirm Password Should be equal to Password",
      });
    }

    // checkUser
    const exitingUser = await userModel.findOne({ email: email });

    // exitingUser
    if (exitingUser) {
      res.status(200).send({
        success: false,
        message: "Already register please login ...",
      });
    }

    // register

    const hashedPassword = await hashPassword(password);

    const user = await new userModel({
      name,
      email,
      password: hashedPassword,
      confirmPassword: hashedPassword,
      answer,
      address,
      role,
    }).save();

    res.status(201).send({
      success: true,
      message: "User register Successfully",
      user,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "error in registration",
      error,
    });
  }
};

// Login

export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    // validation
    if (!email || !password) {
      return res.status(404).send({
        success: false,
        message: "Invalid Email or password ",
      });
    }

    // check User

    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "Email is not registered",
      });
    }

    const match = await comparePassword(password, user.password);

    if (!match) {
      return res.status(200).send({
        success: false,
        message: "Invalid Password",
      });
    }

    // token

    const token = await JWT.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "2d",
    });

    res.status(200).send({
      success: true,
      message: "Successfully LogIn",
      user: {
        name: user.name,
        email: user.email,
        _id: user._id,
        role: user.role,
        address: user.address,
      },
      token,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "error in Login",
      error,
    });
  }
};

// Forgot Password

export const forgotPasswordController = async (req, res) => {
  try {
    const { email, answer, newPassword } = req.body;
    if (!email) {
      res.status(400).send("Email is required");
    }
    if (!answer) {
      res.status(400).send("Answer is required");
    }
    if (!newPassword) {
      res.status(400).send("New Password is required");
    }

    // Check

    const user = await userModel.findOne({ email, answer });

    // Validation

    if (!user) {
      return res.status(404).send({
        success: false,
        message: "Wrong Email or Answer",
      });
    }

    const hashed = await hashPassword(newPassword);
    await userModel.findByIdAndUpdate(user._id, { password: hashed });
    res.status(200).send({
      success: true,
      message: " Password Reset Successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Something Went Wrong",
      error,
    });
  }
};

// test controller

export const testController = (req, res) => {
  res.send("Protected route");
};

//  update Profile

export const updateProfileController = async (req, res) => {
  try {
    const { name, email, password, confirmPassword, answer, address } =
      req.body;
    const user = await userModel.findById(req.user._id);

    // Password
    if (password && password.length < 6) {
      return res.json({
        error: "Password is required and must have at least 6 characters ",
      });
    }
    const hashedPassword = password ? await hashPassword(password) : undefined;
    const updatedUser = await userModel.findByIdAndUpdate(
      req.user._id,
      {
        name: name || user.name,

        password: hashedPassword || user.password,
        confirmPassword: confirmPassword || user.confirmPassword,
        answer: answer || user.answer,
        address: address || user.address,
      },
      { new: true }
    );
    res.status(200).send({
      success: true,
      message: "Profile Updated Successfully",
      updatedUser,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Error while updating profile",
      error,
    });
  }
};

// Orders

export const getOrdersController = async (req, res) => {
  try {
    const orders = await orderModal
      .find({ buyer: req.user._id })
      .populate("products", "-photo")
      .populate("buyer", "name");
    res.json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while Getting Orders ",
      error,
    });
  }
};

//  all Orders

export const getAllOrdersController = async (req, res) => {
  try {
    const orders = await orderModal
      .find({})
      .populate("products", "-photo")
      .populate("buyer", "name")
      .sort({ createdAt: "-1" });
    res.json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while Getting Orders ",
      error,
    });
  }
};

//  order status

export const orderStatusController = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    const orders = await orderModal.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );
    res.json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while updating Order",
      error,
    });
  }
};
