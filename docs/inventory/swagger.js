import dotenv from 'dotenv';
import servers from './servers.js';  
import {allPaths} from '../Docs/paths.js';  

dotenv.config();

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'IRO API Documentation',
    version: '1.0.0',
    description: 'API Documentation for IRO',
    contact: {
      name: 'IRO',
      url: 'https://iro-website-bn.onrender.com/',
    },
  },
  servers: servers,  // Correctly use the imported servers array
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
  },
  security: [
    {
      bearerAuth: [],
    },
  ],
  paths: allPaths,  // Ensure this is correctly imported from paths.js
};

export default swaggerDefinition;
