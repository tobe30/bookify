import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const Register = async (req, res) => {
  try {
    if (!process.env.JWT_SECRET_KEY) {
      return res.status(500).json({
        success: false,
        message: "JWT secret is not configured",
      });
    }

    const { fullName, regNumber, email, password } = req.body;

    if (!fullName || !regNumber || !email || !password) {
      return res.status(400).json({
        success: false,
        message:
          "Full name, registration number, email and password are required",
      });
    }

    if (regNumber.trim().length < 5) {
      return res.status(400).json({
        success: false,
        message: "Registration number must contain at least 5 characters",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must contain at least 6 characters",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const normalizedRegNumber = regNumber.toUpperCase().trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(normalizedEmail)) {
      return res.status(400).json({
        success: false,
        message: "Enter a valid email address",
      });
    }

    const existingUser = await User.findOne({
      $or: [
        { email: normalizedEmail },
        { regNumber: normalizedRegNumber },
      ],
    });

    if (existingUser) {
      const field =
        existingUser.email === normalizedEmail
          ? "Email address"
          : "Registration number";

      return res.status(409).json({
        success: false,
        message: `${field} already exists`,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      fullName: fullName.trim(),
      regNumber: normalizedRegNumber,
      email: normalizedEmail,
      password: hashedPassword,
      role: "user",
    });

    const token = jwt.sign(
      {
        userId: newUser._id,
        role: newUser.role,
      },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "7d" }
    );

    res.cookie("jwt", token, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    });

    return res.status(201).json({
      success: true,
      message: "Account created successfully",
      user: {
        _id: newUser._id,
        fullName: newUser.fullName,
        regNumber: newUser.regNumber,
        email: newUser.email,
        role: newUser.role,
        createdAt: newUser.createdAt,
      },
    });
  } catch (error) {
    if (error?.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Email address or registration number already exists",
      });
    }

    console.error("Error in registration controller:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const Login = async (req, res) => {
  try {
    if (!process.env.JWT_SECRET_KEY) {
      return res.status(500).json({
        success: false,
        message: "JWT secret is not configured",
      });
    }

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const user = await User.findOne({
      email: normalizedEmail,
    }).select("+password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const passwordIsCorrect = await bcrypt.compare(password, user.password);

    if (!passwordIsCorrect) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const token = jwt.sign(
      {
        userId: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "7d" }
    );

    res.cookie("jwt", token, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    });

    return res.status(200).json({
      success: true,
      message: "Login successful",
      user: {
        _id: user._id,
        fullName: user.fullName,
        regNumber: user.regNumber,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error("Error in login controller:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const Logout = async (_req, res) => {
  try {
    res.clearCookie("jwt", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    });

    return res.status(200).json({
      success: true,
      message: "Logout successful",
    });
  } catch (error) {
    console.error("Error in logout controller:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
