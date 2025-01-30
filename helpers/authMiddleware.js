require('dotenv').config();
const expressJwt = require('express-jwt');
const unless = require('express-unless');



const isRevoked = async (req, payload, done) => {
  if (!payload.isAdmin) {
    return done(null, true); // Revoke token if user is not an admin
  }
  done();
};


const authMiddleware = expressJwt({
  secret: process.env.JWT_TOKEN,
  algorithms: ['HS256'],
  isRevoked: isRevoked
}).unless({
  path: [
    // Excluded category routes
    { url: /\/api\/v1\/categories\/.*/, methods: ['GET'] },
    { url: /\/api\/v1\/categories/, methods: ['GET'] }, // This line ensures root categories route is also excluded

    // Excluded product routes
    { url: /\/api\/v1\/products\/get\/count/, methods: ['GET'] },
    { url: /\/api\/v1\/products\/get\/featured\/.*/, methods: ['GET'] },
    { url: /\/api\/v1\/products\/filter/, methods: ['GET'] },
    { url: /\/api\/v1\/products\/.*/, methods: ['GET'] },
    { url: /\/api\/v1\/products/, methods: ['GET'] },  // This line ensures root categories route is also excluded

    // Excluded user routes
    { url: '/api/v1/users/login', methods: ['POST'] },
    { url: '/api/v1/users', methods: ['POST'] },
    { url: '/api/v1/users/get/count', methods: ['GET'] } 
  ]
});

module.exports = authMiddleware;
