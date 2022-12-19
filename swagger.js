const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'AHA backend',
    description: 'AHA backend exam'
  },
  host: 'localhost:3000',
  schemes: ['http']
};

const outputFile = './src/config/swagger.json';
const endpointsFiles = ['./src/server/routes/index_route.js'];

swaggerAutogen(outputFile, endpointsFiles, doc);
