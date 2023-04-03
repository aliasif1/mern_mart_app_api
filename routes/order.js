const express = require('express');
const { verifyToken } = require('../middlewares/authorizationMiddleware');
const router = express.Router();
const Order = require('../models/Order');

// create a new order (user can create a order)
router.post('/', verifyToken, async (req,res) => {
    try{
        const userId = req.user.id;
        const newOrder = new Order({userId, ...req.body});
        const savedOrder = await newOrder.save();
        res.status(201).json(savedOrder);
    }
    catch(e){
        res.status(500).json({error: e.message});
    }
})

// update a order (only admin)
router.patch('/:id', verifyToken, async (req, res) => {
    if (!req.user.isAdmin){
        return res.status(400).json({error: "Unauthorized"})
    }
    try{
        const order = await Order.findById(req.params.id);
        if (!order) {
            return res.status(400).json({error: "No such order exists"})
        }
        const updatedOrder = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json(updatedOrder);
    }
    catch(e){
      res.status(500).json({error: e.message});
    }  
  })

// get all users orders (only admin)
router.get('/', verifyToken, async (req, res) => {
    if(!req.user.isAdmin){
        return res.status(400).json({error: "Unauthorized"})
    }
    try{
        const orders = await Order.find();
        res.status(200).json(orders);
    }
    catch(e){
        res.status(500).json({error: e.message});
    }  
})

// Get a users orders (admin and user)
// id is user id
router.get('/find/:userId', verifyToken, async (req, res) => {
    if(req.params.userId !== req.user.id){
        if (!req.user.isAdmin){
            return res.status(400).json({error: "Unauthorized"})
        }
    }
    try{
      const orders = await Order.find({userId: req.params.userId}).sort({createdAt: -1});
      if (!orders) {
        return res.status(400).json({error: "No orders exists for the user"})
      }
      res.status(200).json(orders);
    }
    catch(e){
      res.status(500).json({error: e.message});
    }  
  })


// delete a order(only admin)
router.delete('/:id', verifyToken, async (req, res) => {
    if (!req.user.isAdmin){
        return res.status(400).json({error: "Unauthorized"})
    }
    try{
      const order = await Order.findByIdAndDelete(req.params.id);
      if (!order) {
        return res.status(400).json({error: "No such order exists"})
      }
      res.status(200).json(order);
    }
    catch(e){
      res.status(500).json({error: e.message});
    }  
  })

module.exports = router;