const mongoose = require('mongoose');
const Product = require('./../models/productModel');


exports.getProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};






exports.postProducts = async (req, res) => {
  try {
    const { name, description, richDescription, image, images, brand, price, category, countInStock, rating, numReviews, isFeatured, dateCreated } = req.body;

    if (!name || !description || !brand || !price || !category || countInStock === undefined) {
      return res.status(400).json({ message: 'All required fields must be provided' });
    }

    // Validate the category field
    if (!mongoose.Types.ObjectId.isValid(category)) {
      return res.status(400).json({ message: 'Invalid category ID' });
    }

    // Create a product with the category field as an ObjectId
    const product = new Product({
      name: req.body.name,
      description: req.body.description,
      richDescription: req.body.richDescription,
      image: req.body.image,
      images: req.body.images,
      brand: req.body.brand,
      price: req.body.price,
      category: new mongoose.Types.ObjectId(req.body.category), // Correctly use 'new' with ObjectId
      countInStock: req.body.countInStock,
      rating: req.body.rating,
      numReviews: req.body.numReviews,
      isFeatured: req.body.isFeatured,
      dateCreated: req.body.dateCreated
    });

    const newProduct = await product.save();
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};





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




exports.updateProductById = async (req, res) => {
  try {
    // Validate the provided product ID
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid product ID' });
    }

    // Validate the provided category ID if it exists in the request body
    if (req.body.category && !mongoose.Types.ObjectId.isValid(req.body.category)) {
      return res.status(400).json({ message: 'Invalid category ID' });
    }

    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true }).populate('category');

    if (!updatedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};




exports.deleteProductById = async (req, res) => {
  try {
    // Validate the provided product ID
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid product ID' });
    }

    const deletedProduct = await Product.findByIdAndDelete(req.params.id);

    if (!deletedProduct) {
      return res.status(404).json({ message: 'Product not found' });
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

    // Validate each category ID
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





