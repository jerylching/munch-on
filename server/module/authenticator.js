const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
dotenv.config({ path: "./../.env" });

const generateAccessToken = (user) => {
  const data = { id: user._id, email: user.email, username: user.username };
  const secret = process.env.JWT_SECRET;
  return jwt.sign(data, secret, { expiresIn: "6h" });
};

const verifyAccessToken = (req, res, next) => {
  let token = req.headers.authorization;
  console.log("Received Token:", token);
  console.log(process.env.JWT_SECRET);

  if (!token) {
    return res
      .status(401)
      .json({ message: "Unauthorized: Token not provided" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Unauthorized: Invalid token" });
    }

    // Access email and username from the decoded token
    const userEmail = decoded.email;
    const username = decoded.username;

    // Attach user information to the request object
    req.user = {
      ...decoded,
      email: userEmail,
      username: username,
    };

    console.log("Decoded Token:", decoded);
    console.log("User Email:", userEmail);
    console.log("Username:", username);

    next();
  });
};

const authenticate = async (req, res, User) => {
  const { email, username, password } = req.body;
  console.log(req.body);

  const user = await User.findOne({ $or: [{ email }, { username }] });

  if (user && (await bcrypt.compare(password, user.password))) {
    const token = generateAccessToken(user);

    res.header("Authorization", `Bearer ${token}`);
    console.log("Generated Token:", token);
    res.status(200).json({
      user: user.username,
      email,
      success: true,
      token: token,
      status: "Successful Log In",
    });
  } else {
    res.status(401).json({
      status: "Invalid",
    });
  }
};

module.exports = { authenticate, verifyAccessToken };
