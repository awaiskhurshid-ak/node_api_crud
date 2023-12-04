const express = require('express')
const app = express()
//const mongoose = require('mongoose')
const Product = require('./ProductModel/Product_Model')
const { default: mongoose } = require('mongoose')
require('dotenv').config()

app.use(express.json())

//Get all products
app.get('/products', async (req, res) => {
    try {
        const products = await Product.find()
        res.json(products)
    } catch (err) {
        res.status(500).json({message: err.message})
    }
})


// Create a new product
app.post('/products', async (req, res) => {
    try {
        const product = new Product({
            name: req.body.name,
            price: req.body.price,
            image: req.body.image
        })
        await product.save()
        res.send(product)
    } catch (err) {
        console.log(err.message)
        res.status(500).json({message: err.message})
    }
})

// Get one product from the database
app.get('/products/:id',async (req, res) => {
    try {
        const product = await Product.findById(req.params.id)
        res.json(product)
    } catch (err) {
        res.status(500).json({message: err.message})
    }
}) 

// Update one product 
app.patch('/products/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id)
        if (!product) {
            return res.status(404).json({ message: 'Product not found' })
        }
        if (req.body.name != null) {
            product.name = req.body.name
        }
        if (req.body.price != null) {
            product.price = req.body.price
        }
        if (req.body.image != null) {
            product.image = req.body.image
        }
        await product.save()
        res.json(product)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

//Delete one product
app.delete('/products/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id)
        if (!product) {
            return res.status(404).json({ message: 'Product not found' })
        }
        await Product.deleteOne({ _id: req.params.id })
        res.json({ message: 'Deleted Product' })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

//MongoDB connection using
mongoose.
connect(process.env.MONGODB_URL).
then(() => {
        console.log('Connected to MongoDB')
        app.listen(3000, ()=> console.log('Server ready'))
}).
catch(err => console.log(err))
