import dotenv from 'dotenv';

dotenv.config();

const { PORT, MONGO_URI, MONGO_URI_prod } = process.env;

const servers = [
  {
    url: `http://localhost:${PORT}/`,
    description: 'Development server',
  },
  {
    url: `${MONGO_URI_prod}`,
    description: 'Production server',
  },
];

export default servers;
