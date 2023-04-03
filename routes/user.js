const express = require('express');
const { verifyToken } = require('../middlewares/authorizationMiddleware');
const router = express.Router();
const User = require('../models/User');

// Get all users(only admin)
router.get('/', verifyToken, async (req, res) => {
    if(!req.user.isAdmin){
        return res.status(400).json({error: "Unauthorized"})
    }
    try{
        const users = await User.find().select('-password');
        res.status(200).json(users);
    }
    catch(e){
        res.status(500).json({error: e.message});
    }  
})

// Get a single user(admin plus specific user)
router.get('/:id', verifyToken, async (req, res) => {
    if(req.params.id !== req.user.id){
        if (!req.user.isAdmin){
            return res.status(400).json({error: "Unauthorized"})
        }
    }
    try{
      const user = await User.findById(req.params.id).select('-password');
      if (!user) {
        return res.status(400).json({error: "No such user exists"})
      }
      res.status(200).json(user);
    }
    catch(e){
      res.status(500).json({error: e.message});
    }  
  })


// Delete a user(admin plus specific user)
router.delete('/:id', verifyToken, async (req, res) => {
    if(req.params.id !== req.user.id){
        if (!req.user.isAdmin){
            return res.status(400).json({error: "Unauthorized"})
        }
    }
    try{
      const user = await User.findByIdAndDelete(req.params.id).select('-password');
      if (!user) {
        return res.status(400).json({error: "No such user exists"})
      }
      res.status(200).json(user);
    }
    catch(e){
      res.status(500).json({error: e.message});
    }  
  })

// update a user(admin plus specific user)
router.patch('/:id', verifyToken, async (req, res) => {
    if(req.params.id !== req.user.id){
        if (!req.user.isAdmin){
            return res.status(400).json({error: "Unauthorized"})
        }
    }
    try{
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(400).json({error: "No such user exists"})
        }
        const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true }).select('-password');
        res.status(200).json(updatedUser);
    }
    catch(e){
      res.status(500).json({error: e.message});
    }  
  })

module.exports = router;