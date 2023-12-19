const User = require("./../models/userModel");
const authenticator = require("./../module/authenticator");
const bcrypt = require("bcrypt");

exports.register = async (req, res) => {
  const { email, password, username, firstName, lastName } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const user = new User({
      email,
      password: hashedPassword,
      username,
      firstName,
      lastName,
    });
    await user.save();
    res.status(201).json({
      status: "success",
      data: {
        user,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
    console.log(err);
  }
};

exports.logIn = async (req, res) => {
  await authenticator.authenticate(req, res, User);
};

exports.getAllUsers = async (req, res) => {
  try {
    const user = await User.find(req.query);
    res.status(200).json({
      user,
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      status: "success",
      data: {
        user,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(400).json({
      status: "fail",
      message: err,
    });
    console.log("error");
  }
};

exports.deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(201).json({
      status: "success",
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};
