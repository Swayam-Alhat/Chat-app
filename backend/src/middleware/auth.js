import JWT from "jsonwebtoken";

export const checkCookie = (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res
        .status(400)
        .json({ success: false, error: "Unauthorized.\n Please Login" });
    }
    const user = JWT.verify(token, process.env.JWT_SECRET);

    req.user = user;

    return next();
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};
