const mongoose = require('mongoose');
const Category = require('./../models/categoryModel');
const fs = require('fs');
const path = require('path');
const upload = require('./../helpers/upload');




exports.getCategories = async (req, res) => {
    try {
        const categories = await Category.find();
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}




// Create a new category with image uploads
exports.postCategories = [
    // Middleware to handle image uploads
    upload.fields([{ name: 'image', maxCount: 1 }, { name: 'icon', maxCount: 1 }]), 
    async (req, res) => {
        try {
            const { name, color } = req.body;

            if (!name || color === undefined) {
                return res.status(400).json({ message: 'All required fields must be provided' });
            }

            // Validate icon image type
            if (req.files.icon && req.files.icon[0].mimetype !== 'image/png') {
                return res.status(400).json({ message: 'Icon must be a PNG image' });
            }

            const category = new Category({
                name: name,
                color: color,
                icon: req.files.icon ? req.files.icon[0].path : '',
                image: req.files.image ? req.files.image[0].path : ''
            });

            const newCategory = await category.save();
            res.status(201).json(newCategory);
        } catch (error) {
            res.status(500).json({ message: 'Server error', error: error.message });
        }
    }
];




exports.getCategoryById = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }
        res.status(200).json(category);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}




// Update a category by ID with image uploads
exports.updateCategoryById = [
    // Middleware to handle image uploads
    upload.fields([{ name: 'image', maxCount: 1 }, { name: 'icon', maxCount: 1 }]), 
    async (req, res) => {
        try {
            const category = await Category.findById(req.params.id);
            if (!category) {
                return res.status(404).json({ message: 'Category not found' });
            }

            // Validate icon image type
            if (req.files.icon && req.files.icon[0].mimetype !== 'image/png') {
                return res.status(400).json({ message: 'Icon must be a PNG image' });
            }

            // Prepare updated data
            const updatedData = {
                ...req.body,
                icon: req.files.icon ? req.files.icon[0].path : req.body.icon,
                image: req.files.image ? req.files.image[0].path : req.body.image
            };

            // Remove old icon if a new one is uploaded
            if (req.files.icon && category.icon) {
                const oldIconPath = path.join(__dirname, '..', category.icon);
                if (fs.existsSync(oldIconPath)) {
                    fs.unlinkSync(oldIconPath);
                }
            }

            // Remove old image if a new one is uploaded
            if (req.files.image && category.image) {
                const oldImagePath = path.join(__dirname, '..', category.image);
                if (fs.existsSync(oldImagePath)) {
                    fs.unlinkSync(oldImagePath);
                }
            }

            const updatedCategory = await Category.findByIdAndUpdate(req.params.id, updatedData, { new: true });

            if (!updatedCategory) {
                return res.status(404).json({ message: 'Category not found' });
            }

            res.status(200).json(updatedCategory);
        } catch (error) {
            res.status(500).json({ message: 'Server error', error: error.message });
        }
    }
]





exports.deleteCategoryById = async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: 'Invalid category ID' });
        }

        const deletedCategory = await Category.findByIdAndDelete(req.params.id);

        if (!deletedCategory) {
            return res.status(404).json({ message: 'Category not found' });
        }

        // Remove associated images
        if (deletedCategory.icon) {
            const oldIconPath = path.join(__dirname, '..', deletedCategory.icon);
            if (fs.existsSync(oldIconPath)) {
                fs.unlinkSync(oldIconPath);
            }
        }

        if (deletedCategory.image) {
            const oldImagePath = path.join(__dirname, '..', deletedCategory.image);
            if (fs.existsSync(oldImagePath)) {
                fs.unlinkSync(oldImagePath);
            }
        }

        res.status(200).json({ message: 'Category deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
