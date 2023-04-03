const express = require('express');
const { verifyToken } = require('../middlewares/authorizationMiddleware');
const router = express.Router();
const Product = require('../models/Product');

// create a new product (only admin can create a product)
router.post('/', verifyToken, async (req,res) => {
    if(!req.user.isAdmin){
        return res.status(400).json({error: "Unauthorized"})
    }
    try{
        const newProduct = new Product(req.body);
        const savedProduct = await newProduct.save();
        res.status(201).json(savedProduct);
    }
    catch(e){
        res.status(500).json({error: e.message});
    }
})

// get all products (anyone can see all products)
router.get('/', async (req, res) => {
    try{
        const products = req.query.category ? await Product.find({categories: req.query.category}) : await Product.find();
        res.status(200).json(products);
    }
    catch(e){
        res.status(500).json({error: e.message});
    }  
})

// Get a single product (anyone can see products)
router.get('/:id', async (req, res) => {
    try{
      const product = await Product.findById(req.params.id);
      if (!product) {
        return res.status(400).json({error: "No such product exists"})
      }
      res.status(200).json(product);
    }
    catch(e){
      res.status(500).json({error: e.message});
    }  
  })


// delete a product(only admin)
router.delete('/:id', verifyToken, async (req, res) => {
    if(!req.user.isAdmin){
        return res.status(400).json({error: "Unauthorized"})
    }
    try{
      const product = await Product.findByIdAndDelete(req.params.id);
      if (!product) {
        return res.status(400).json({error: "No such product exists"})
      }
      res.status(200).json(product);
    }
    catch(e){
      res.status(500).json({error: e.message});
    }  
  })

// update a product(only admin)
router.patch('/:id', verifyToken, async (req, res) => {
    if(!req.user.isAdmin){
        return res.status(400).json({error: "Unauthorized"})
    }
    try{
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(400).json({error: "No such product exists"})
        }
        const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true })
        res.status(200).json(updatedProduct);
    }
    catch(e){
      res.status(500).json({error: e.message});
    }  
  })

module.exports = router;