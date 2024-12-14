const express = require("express");
const userRouter = express.Router();
const { body, validationResult } = require("express-validator");
const userModel = require("../models/user.model");
const bcrypt = require("bcrypt");
const { mquery } = require("mongoose");
const jwt=require('jsonwebtoken');
// Render register form
userRouter.get("/register", (req, res) => {
    res.render("register", { errors: [] }); // Always pass an empty `errors` array initially
});

// Handle register form submission
userRouter.post(
    "/register",
    [
        body("username").trim().isLength({ min: 3 }).withMessage("Username must be at least 3 characters long"),
        body("email").trim().isEmail().withMessage("Invalid email address"),
        body("password").trim().isLength({ min: 5 }).withMessage("Password must be at least 5 characters long"),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            // Pass errors back to the view
            return res.status(400).render("register", {
                errors: errors.array(),
            });
        }

        const { username, email, password } = req.body;

        try {
            // Hash the password
            const hashedPassword = await bcrypt.hash(password, 10);

            // Save the new user
            const newUser = await userModel.create({
                username,
                email,
                password: hashedPassword,
            });

            // Send success response
            res.redirect('/user/login')// Replace this with a redirect if needed
        } catch (err) {
            console.error(err);
            res.status(500).render("register", {
                errors: [{ msg: "Server error. Please try again later." }],
            });
        }
    }
);


userRouter.get("/login", (req, res) => {
    res.render("login", { errors: [] });
});
userRouter.post("/login", 
    [
        body("username").trim().isLength({ min: 3 }).withMessage("Username must be at least 3 characters long"),
        body("password").trim().isLength({ min: 5 }).withMessage("Password must be at least 5 characters long"),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).render("login", {
                errors: errors.array(),
                message: 'invalid'
            });
        }
        const { username, password } = req.body;
        const user = await userModel.findOne({
              username: username
        })
        if(!user){
            return res.status(400).json({
                message: 'usernAE OR PASSWORD INCORRECT'
            })
        }
        const isMatch= await bcrypt.compare(password,user.password)
        if(!isMatch){
            return res.status(400).json({
                message: 'usernAE OR PASSWORD INCORRECT'})
        }
        const token = jwt.sign({
            userId: user._id,
            email:user.email,
            username: user.usernamme
        },
        process.env.JWT_SECRET,
    )
    res.cookie('token',token)
    res.redirect('/home')
    }
);
module.exports = userRouter;
