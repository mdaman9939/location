const express = require("express");
const router = express.Router();
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const res = require("express/lib/response");
const { default: mongoose } = require("mongoose");

const JWT_SECRET = "mysecretkey";

// create a token when user logged in
router.post("/create-token", async (req, res) => {
  try {
    const { email, password } = req.body;

    // email and password both are required
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "email and password both are required" });
    }

    // check email and password in database
    const user = await User.findOne({ email, password });
    if (!user) {
      return res.status(404).json({ message: "email and password not found." });
    }
    const payload = { email: user.email };
    // generate token
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" });
    return res.status(201).json({ message: "Generated Token:", token });
  } catch (error) {
    return res.status(500).json({ message: "Internal Sever Error" });
  }
});

// create post api for user
router.post("/user", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "email and password both are required" });
    }
    const newUser = new User({ email, password });
    const savedUser = await newUser.save();
    res
      .status(201)
      .json({ message: "User created succesfully", data: savedUser });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get("/users", async (req, res) => {
  try {
    const get_users = await User.find();
    return res.status(200).json({ message: "All Users:", data: get_users });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.put("/user/:id", async (req, res) => {
  try {
    const { id } = req.params;
    // required user id
    if (!id) {
      return res.status(400).json({ message: "User id is required." });
    }
    const updatedUser = await User.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    // check if user not found
    if (!updatedUser) {
      return res.status(404).json({ message: "User id not found" });
    }
    return res.status(200).json({ message: "User updated", data: updatedUser });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
});

// delete api
router.delete("/user/:id", async (req, res) => {
  try {
    const { id } = req.params;
    console.log("received delete request for id:", id);
    // id is required for delete items
    if (!id) {
      return res
        .status(400)
        .json({ message: "user id is required for delete" });
    }
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.sendStatus(401).json({ message: "invalid user id enter" });
    }
    const deleteId = await User.findByIdAndDelete(id);
    if (!deleteId) {
      return res.status(400).json({ message: "User id not found." });
    }
    return res.status(200).json({ message: "User deleted successfully." });
  } catch (error) {
    console.error("Delete user error:", error);
    return res.status(500).json({ message: "Internal Sever error" });
  }
});

// get item by id 
router.get("/user/:id", async ( req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({message: "User id is required"})
        }
        if (!mongoose.Types.ObjectId.isValid(id)) {
           return res.status(400).json({ message: "Invalid user id"});
        }
        const getUserId = await User.findById(id);
        if (!getUserId) {
            return res.status(404).json({ message: "User id is not found in the database"})
        }
        return res.status(200).json({ message: "User get by id", data: getUserId});
    } catch (error) {
        return res.status(500).json({ message: "internal server error"})
    }
});
module.exports = router;
