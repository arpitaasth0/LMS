import jwt from "jsonwebtoken";

const isAuthenticated = (req, res, next) => {
  try {
    // Check if token exists in cookies
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({
        message: "User not authenticated. Token missing.",
        success: false,
      });
    }

    // Verify the token
    jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
      if (err) {
        return res.status(401).json({
          message: "Invalid or expired token.",
          success: false,
        });
      }

      // Set user id in the request object for future use
      req.id = decoded.userId;
      next();
    });
  } catch (error) {
    console.error("Authentication error:", error);
    return res.status(500).json({
      message: "Internal server error.",
      success: false,
    });
  }
};

export default isAuthenticated;
