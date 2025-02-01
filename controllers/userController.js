const mongoose = require('mongoose');
const User = require('./../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');



exports.getUsers = async (req, res) => {
    try {
      const users = await User.find().select('name email'); 
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  




  exports.postUsers = async (req, res) => {
    try {
      const { name, email, passwordHash, street, apartment, city, zip, country, phone, isAdmin } = req.body;
  
      if (!name || !email || !passwordHash) {
        return res.status(400).json({ message: 'Name, email, and password are required' });
      }
  
      // Check for duplicate email
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'Email is already registered' });
      }
  
      // Hash the password
      const hashedPassword = await bcrypt.hash(passwordHash, 10);
  
      const user = new User({
        name,
        email,
        passwordHash: hashedPassword,
        street,
        apartment,
        city,
        zip,
        country,
        phone,
        isAdmin
      });
  
      const newUser = await user.save();
      res.status(201).json(newUser);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  




exports.getUserById = async (req, res) => {
  try {
    const userId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }
    
    const user = await User.findById(userId).select('-passwordHash'); 

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};




exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Compare password
    const isMatch = bcrypt.compareSync(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Generate token
    const token = jwt.sign(
      { userId: user._id, email: user.email, isAdmin: user.isAdmin},
      process.env.JWT_TOKEN, 
      { expiresIn: '2h' }
    );

    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};




exports.getUserCount = async (req, res) => {
  try {
    const userCount = await User.countDocuments();
    res.status(200).json({ count: userCount });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};




exports.deleteUserById = async (req, res) => {
  try {
    const userId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }

    const user = await User.findByIdAndDelete(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};




exports.updateUserById = async (req, res) => {
  try {
    const userId = req.params.id;
    const { name, email, street, apartment, city, zip, country, phone, isAdmin } = req.body;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update user fields
    user.name = name || user.name;
    user.email = email || user.email;
    user.street = street || user.street;
    user.apartment = apartment || user.apartment;
    user.city = city || user.city;
    user.zip = zip || user.zip;
    user.country = country || user.country;
    user.phone = phone || user.phone;
    user.isAdmin = isAdmin !== undefined ? isAdmin : user.isAdmin;

    const updatedUser = await user.save();

    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

