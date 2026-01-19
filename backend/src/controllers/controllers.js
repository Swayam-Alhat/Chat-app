import User from "../model/user.model.js";
import JWT from "jsonwebtoken";
import bcrypt from "bcrypt";
import Message from "../model/message.model.js";

export const handleSignup = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name: name,
      email: email,
      password: hashedPassword,
    });

    const payload = { id: user._id, email: user.email };
    const token = JWT.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1hr",
    });

    res.cookie("token", token, {
      maxAge: 1000 * 60 * 60, // 1 hr
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    });

    return res.status(201).json({
      success: true,
      message: "User created",
      user: { name: user.name, email: user.email },
    });
  } catch (error) {
    // mongoDB email unique error
    if (error?.code === 11000) {
      return res
        .status(400)
        .json({ success: false, error: "Email already exist" });
    }
    return res.status(500).json({ success: false, error: error.message });
  }
};

export const handleLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(400).json({ success: false, error: "Invalid email" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, error: "Invalid password" });
    }

    const payload = { id: user._id, email: user.email };

    const token = JWT.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1hr",
    });

    res.cookie("token", token, {
      maxAge: 1000 * 60 * 60,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    });

    return res
      .status(200)
      .json({ success: true, message: "Login successfull" });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

export const handleLogout = (req, res) => {
  try {
    res.clearCookie("token");
    return res
      .status(200)
      .json({ success: true, message: "Logout successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

export const showUsers = async (req, res) => {
  try {
    // Promise runs multiple operations in parallel
    const [currentUser, users] = await Promise.all([
      User.findById(req.user.id, { password: 0 }),
      User.find({ _id: { $ne: req.user.id } }, { password: 0 }),
    ]);

    return res.status(200).json({
      success: true,
      message: "list of all users",
      users: users,
      currentUser: currentUser,
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

// send messages
export const showMessages = async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [
        { sender: req.user.id, receiver: req.params.id },
        { sender: req.params.id, receiver: req.user.id },
      ],
    }).sort({ createdAt: 1 });

    return res.status(200).json({
      success: true,
      message: "Message from db & server",
      messages: messages,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const addMessage = async (req, res) => {
  try {
    const message = await Message.create({
      sender: req.user.id,
      receiver: req.params.id,
      message: req.body.message,
    });
    return res.status(200).json({
      success: true,
      message: "Message stored successfully",
      messageData: message,
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};
