const Category = require('./../models/categoryModel');


exports.getCategories = async(req, res) => {
    try {
        const categories = await Category.find();
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}


exports.postCategories = async (req, res) => {
    try {
        const category = new Category({
            name: req.body.name,
            color: req.body.color,
            icon: req.body.icon,
            image: req.body.image
        });


        if (!req.body.name || !req.body.color === undefined) {
            return res.status(400).json({ message: 'All required fields must be provided' });
        }

        
        const newCategory = await category.save();
        res.status(201).json(newCategory);

        } catch (error) {
            res.status(500).json({ message: error.message });
        }  
};


exports.getCategoryById = async(req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) {
            return res.status(404).json({ message: 'Category not found' })
        }
        res.status(200).json(category);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


exports.updateCategoryById = async(req, res) => {
    try {
        const {id} = req.params;
        const updatedData = req.body;

        const updatedCategory = await Category.findByIdAndUpdate(id, updatedData, {new: true});

        if (!updatedCategory) {
            return res.status(404).json({ message: 'Category not found' });
        }

        res.status(200).json(updatedCategory);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deleteCategoryById = async (req, res) => {
    try {
        const id = req.params.id;

        const deletedCategory = await Category.findByIdAndDelete(id);

        if (!deletedCategory) {
            return res.status(404).json({ message: 'Category not found' })
        }
        
        res.status(200).json({ message: 'Category deleted successfully' });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


