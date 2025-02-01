const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const Product = require('./../models/productModel');
const upload = require('./../helpers/upload');



exports.getProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};



// Create a new product with image uploads
exports.postProducts = [
    // Middleware to handle image uploads
    upload.fields([{ name: 'image', maxCount: 1 }, { name: 'images', maxCount: 5 }]), 
    async (req, res) => {
        try {
            const { name, description, richDescription, brand, price, category, countInStock, rating, numReviews, isFeatured, dateCreated } = req.body;

            if (!name || !description || !brand || !price || !category || countInStock === undefined) {
                return res.status(400).json({ message: 'All required fields must be provided' });
            }

            if (!mongoose.Types.ObjectId.isValid(category)) {
                return res.status(400).json({ message: 'Invalid category ID' });
            }

            const product = new Product({
                name: name,
                description: description,
                richDescription: richDescription,
                image: req.files.image ? req.files.image[0].path : '',
                images: req.files.images ? req.files.images.map(file => file.path) : [],
                brand: brand,
                price: price,
                category: new mongoose.Types.ObjectId(category),
                countInStock: countInStock,
                rating: rating,
                numReviews: numReviews,
                isFeatured: isFeatured,
                dateCreated: dateCreated
            });

            const newProduct = await product.save();
            res.status(201).json(newProduct);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
];




exports.getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).populate('category');

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};



// Update a product by ID with image uploads
exports.updateProductById = [
    // Middleware to handle image uploads
    upload.fields([{ name: 'image', maxCount: 1 }, { name: 'images', maxCount: 5 }]), 
    async (req, res) => {
        try {
            const product = await Product.findById(req.params.id);
            if (!product) {
                return res.status(404).json({ message: 'Product not found' });
            }

            // Prepare updated data
            const updatedData = {
                ...req.body,
                image: req.files.image ? req.files.image[0].path : req.body.image,
                images: req.files.images ? req.files.images.map(file => file.path) : req.body.images
            };

            // Remove old main image if a new one is uploaded
            if (req.files.image && product.image) {
                const oldImagePath = path.join(__dirname, '..', product.image);
                if (fs.existsSync(oldImagePath)) {
                    fs.unlinkSync(oldImagePath);
                }
            }

            // Remove old additional images if new ones are uploaded
            if (req.files.images && product.images && product.images.length > 0) {
                product.images.forEach(imagePath => {
                    const oldImagePath = path.join(__dirname, '..', imagePath);
                    if (fs.existsSync(oldImagePath)) {
                        fs.unlinkSync(oldImagePath);
                    }
                });
            }

            if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
                return res.status(400).json({ message: 'Invalid product ID' });
            }

            if (req.body.category && !mongoose.Types.ObjectId.isValid(req.body.category)) {
                return res.status(400).json({ message: 'Invalid category ID' });
            }

            const updatedProduct = await Product.findByIdAndUpdate(req.params.id, updatedData, { new: true, runValidators: true }).populate('category');

            if (!updatedProduct) {
                return res.status(404).json({ message: 'Product not found' });
            }

            res.status(200).json(updatedProduct);
        } catch (error) {
            console.error('Error:', error); // Log the error for debugging
            res.status(500).json({ message: error.message });
        }
    }
];




exports.deleteProductById = async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: 'Invalid product ID' });
        }

        const deletedProduct = await Product.findByIdAndDelete(req.params.id);

        if (!deletedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Remove associated images
        if (deletedProduct.image) {
            const oldImagePath = path.join(__dirname, '..', deletedProduct.image);
            if (fs.existsSync(oldImagePath)) {
                fs.unlinkSync(oldImagePath);
            }
        }

        if (deletedProduct.images && deletedProduct.images.length > 0) {
            deletedProduct.images.forEach(imagePath => {
                const oldImagePath = path.join(__dirname, '..', imagePath);
                if (fs.existsSync(oldImagePath)) {
                    fs.unlinkSync(oldImagePath);
                }
            });
        }

        res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};




exports.getProductsCount = async (req, res) => {
    try {
        const productCount = await Product.countDocuments();
        res.status(200).json({ count: productCount });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};




exports.getFeaturedProducts = async (req, res) => {
    try {
        const limit = parseInt(req.params.limit) || 0;

        const featuredProducts = await Product.find({ isFeatured: true }).limit(limit);

        res.status(200).json(featuredProducts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};




exports.getFilteredProducts = async (req, res) => {
    try {
        if (!req.query.categories) {
            return res.status(400).json({ message: 'Categories query parameter is required' });
        }

        const categoryIds = req.query.categories.split(',').map(id => id.trim());

        const objectIdArray = categoryIds.map(id => {
            if (!mongoose.Types.ObjectId.isValid(id)) {
                throw new Error(`Invalid category ID: ${id}`);
            }
            // Convert each category ID to an ObjectId
            return new mongoose.Types.ObjectId(id);
        });

        const filteredProducts = await Product.find({ category: { $in: objectIdArray } });

        res.status(200).json(filteredProducts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
