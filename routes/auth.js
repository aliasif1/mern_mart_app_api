const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const User = require('../models/User');
const {SALT_ROUNDS} = require('../constants');
const jwt = require('jsonwebtoken');
var validator = require("email-validator");

router.post('/signup', async (req,res) => {
    const {username, email, password} = req.body;
    if (!username || !email || !password){
        return res.status(400).json({error: "All fields must be filled"});
    }
    try{
        // check for bad email
        if(!validator.validate(email)){
            return res.status(400).json({error: 'Email is badly formatted'});
        }
        // check if password is atleast 5 characters 
        if(password.length < 6){
            return res.status(400).json({error: 'Password must be atleast 6 characters in length'});
        }

        // see if a user with the same username or password already exists
        let existingUser;
        existingUser = await User.findOne({username});
        if(existingUser){
            return res.status(400).json({error: "Username already exists"});
        }
        existingUser = await User.findOne({email});
        if(existingUser){
            return res.status(400).json({error: "email already exists"});
        }
        const hashedPassword =  await bcrypt.hash(password, SALT_ROUNDS);
        const newUser = new User({username, email, password: hashedPassword});
        const savedUser = await newUser.save();
        // Create JWT token
        const token = jwt.sign({id: savedUser._id, isAdmin: savedUser.isAdmin}, process.env.SECRET, {expiresIn: "3d"}); 
        res.status(201).json({
            id: savedUser._id,
            username: savedUser.username,
            token
        })
    }
    catch(e){
        res.status(500).json({error: "Something went wrong."})
        // res.status(500).json({error: e.message});
    }
})

router.post('/login', async (req,res) => {
    const {email, password} = req.body;
    if (!email || !password){
        return res.status(400).json({error: "All fields must be filled"});
    }
    try{
        const savedUser = await User.findOne({email});
        if (!savedUser){
            return res.status(400).json({error: "Invalid Email"});
        }
        const isPasswordValid = await bcrypt.compare(password, savedUser.password);
        if (!isPasswordValid){
            return res.status(400).json({error: "Invalid Password"});
        }

        // Create JWT token
        const token = jwt.sign({id: savedUser._id, isAdmin: savedUser.isAdmin}, process.env.SECRET, {expiresIn: "3d"}); 
        res.status(201).json({
            id: savedUser._id,
            username: savedUser.username,
            token
        })
    }
    catch(e){
        // res.status(500).json({error: e.message});
        res.status(500).json({error: "Something went wrong"})
    }
})

module.exports = router;