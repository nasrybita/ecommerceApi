# E-commerce API

**Click here** 👉 [![API Documentation](https://img.shields.io/badge/API-Documentation-brightgreen)](https://documenter.getpostman.com/view/25728822/2sAYX3qNah) 



## Table of Contents

1. [Introduction](#introduction)
2. [Features](#features)
3. [Technologies](#technologies)
4. [Architecture](#architecture)
5. [Installation](#installation)
6. [Usage](#usage)
7. [API Endpoints](#api-endpoints)
8. [Contact](#contact)

## Introduction

Welcome to the E-commerce API project! This API is built using Node.js, Express, MongoDB, and follows the MVC architectural pattern. It provides a robust backend for an e-commerce platform.

## Features

- User authentication and authorization
- Product management
- Order processing
- Category filtering


## Technologies

- **Node.js**: JavaScript runtime built on Chrome's V8 JavaScript engine
- **Express**: Fast, unopinionated, minimalist web framework for Node.js
- **MongoDB**: NoSQL database for storing product and user data
- **Mongoose**: MongoDB object modeling tool
- **JWT**: JSON Web Token for authentication
- **Postman**: API documentation and testing

## Architecture

The project follows the Model-View-Controller (MVC) pattern:

- **Models**: Represent the data structure
- **Views**: Not used in this API-only backend
- **Controllers**: Handle the business logic

## Installation

To get started with this project, follow these steps:

1. Clone the repository:
   
   ```bash
   git clone https://github.com/nasrybita/ecommerceApi.git
   cd ecommerceApi
 
2. Install dependencies:
   
   ```bash
   npm install

3. Set up environment variables:
   * Create `.env` file in the root directory
   * Add the following environment variables:


   ```
   MONGO_URI=your_mongo_db_connection_string
   JWT_SECRET=your_jwt_secret

4. Start the server:
   
   ```bash
   npm start

## usage

Use Postman to test the API endpoints. The Postman documentation is included in the repository.



## API Endpoints

Here are some of the key endpoints:



### User Authentication

* `POST /api/v1/users`: Register a new user
* `POST /api/v1/users/login`: Login a user
* `GET /api/v1/users`: Retrieve a list of users
* `GET /api/v1/users/:id`: Retrieve a user by ID
* `GET /api/v1/users/get/count`: Retrieve total number of users
* `DELETE /api/v1/users/:id`: Delete a user by ID
* `PUT /api/v1/users/:id`: Update a user's details by ID



### Product Management

* `GET /api/v1/products`: Retrieve all products
* `POST /api/v1//products`: Create a new product
* `GET /api/v1/products/:id`: Retrieve a product by ID
* `PUT /api/v1/products/:id`: Update a product by ID
* `DELETE /api/v1/products/:id`: Delete a product by ID
* `GET /api/v1/products/get/count`: Retrieve total number of products
* `GET /api/v1/products/get/featured/{{limit}}`: Retrieve a list of featured products
* `GET /api/v1/products/filter?categories=category_id1,category_id2`: Retrieve a list of products filtered by category IDs



### Order Processing

* `POST /api/v1/orders`: Create a new order
* `GET /api/v1/orders`: Retrieve a list of all orders
* `GET /api/v1/orders/:id`: Retrieve an order by ID
* `PUT /api/v1/orders/:id`: Update order status by ID
* `DELETE /api/v1/orders/:id`: Delete an order by ID
* `GET /api/v1/orders/get/totalsales`: Calculate and retrieve total sales amount
* `GET /api/v1/orders/get/count`: Retrieves total number of orders
* `GET /api/v1/orders/get/userorders/:userId`: Retrieves list of a user orders



### Category Filtering

* `POST /api/v1/categories`: Create a new category
* `GET /api/v1/categories`: Retrieve a list of all categories
* `GET /api/v1/categories/:id`: Retrieve a category by ID
* `PUT /api/v1/categories/:id`: Update a category by ID
* `DELETE /api/v1/categories/:id`: Delete a category by ID


## Contact

If you have any questions or need further assistance, please contact me at [nasrybita@gmail.com].

**Click here** 👉 [![API Documentation](https://img.shields.io/badge/API-Documentation-brightgreen)](https://documenter.getpostman.com/view/25728822/2sAYX3qNah) 
