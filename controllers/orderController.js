const mongoose = require('mongoose');
const Order = require('../models/orderModel');
const OrderItem = require('../models/orderItemModel');




// Get all orders
exports.getOrders = async (req, res) => {
    try {
      const orders = await Order.find()
        .populate('user', 'name')
        .sort({ dateOrdered: -1 });  // Sort by date from newest to oldest
  
      res.status(200).json(orders);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
};





exports.createOrder = async (req, res) => {
  const { orderItems, shippingAddress1, shippingAddress2, city, zip, country, phone, status, user } = req.body;

  // Create an array to store order item promises
  let orderItemsIds = Promise.all(orderItems.map(async orderItem => {
    let newOrderItem = new OrderItem({
      product: orderItem.product,
      quantity: orderItem.quantity
    });

    newOrderItem = await newOrderItem.save();
    return newOrderItem._id;
  }));

  const orderItemsIdsResolved = await orderItemsIds;

  // Calculate total price
  const totalPrices = await Promise.all(orderItemsIdsResolved.map(async orderItemId => {
    const orderItem = await OrderItem.findById(orderItemId).populate('product', 'price');
    const totalPrice = orderItem.product.price * orderItem.quantity;
    return totalPrice;
  }));

  const totalPrice = totalPrices.reduce((a, b) => a + b, 0);

  let order = new Order({
    orderItems: orderItemsIdsResolved,
    shippingAddress1,
    shippingAddress2,
    city,
    zip,
    country,
    phone,
    status,
    totalPrice,
    user,
  });

  order = await order.save();

  if (!order) {
    return res.status(400).send('The order cannot be created');
  }

  // Populate orderItems and user fields before sending the response
  order = await Order.findById(order._id)
    .populate({
      path: 'orderItems',
      populate: {
        path: 'product',
        select: 'name price'
      }
    })
    .populate('user', 'name');

  res.status(201).send(order);
};



exports.getOrderById = async (req, res) => {
  try {

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid order ID' });
    }

    const order = await Order.findById(req.params.id)
      .populate({
        path: 'orderItems',
        populate: {
          path: 'product',
          populate: {
            path: 'category',
            select: 'name'
          },
          select: 'name price category'
        }
      })
      .populate('user', 'name');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};





exports.updateOrderStatus = async (req, res) => {
  try {
    
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid order ID' });
    }

    // Validate the status
    const { status } = req.body;
    const validStatuses = ['Pending', 'Processed', 'Shipped', 'Delivered', 'Cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true } // Return the updated document
    );

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};




exports.deleteOrderById = async (req, res) => {
  try {
    
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid order ID' });
    }

    // Find the order by ID
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Delete order items associated with the order
    await Promise.all(
      order.orderItems.map(async orderItemId => {
        await OrderItem.findByIdAndDelete(orderItemId);
      })
    );

    // Delete the order
    await Order.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: 'Order and related order items deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};




exports.getTotalSales = async (req, res) => {
  try {
    const totalSales = await Order.aggregate([
      {
        $group: {
          _id: null,
          totalSales: { $sum: "$totalPrice" }
        }
      }
    ]);

    if (!totalSales) {
      return res.status(400).json({ message: 'The total sales cannot be generated' });
    }

    res.status(200).json({ totalSales: totalSales[0].totalSales });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



exports.getOrderCount = async (req, res) => {
  try {
    const orderCount = await Order.countDocuments();

    if (!orderCount) {
      return res.status(400).json({ message: 'The order count cannot be generated' });
    }

    res.status(200).json({ orderCount });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};





exports.getUserOrders = async (req, res) => {
  try {
    const userId = req.params.userid;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }

    const userOrders = await Order.find({ user: userId })
      .populate('orderItems')
      .populate({
        path: 'orderItems',
        populate: {
          path: 'product',
          select: 'name price'
        }
      })
      .sort({ dateOrdered: -1 }); // Sort by date from newest to oldest

    if (!userOrders) {
      return res.status(404).json({ message: 'No orders found for this user' });
    }

    res.status(200).json(userOrders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
