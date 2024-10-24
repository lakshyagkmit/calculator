const express = require('express');
require('dotenv').config();
const dbConnect = require('./config/database.js');
const operationsRoutes = require('./routes/operations.route');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yaml');
const fs = require('fs');

const app = express();

const port = process.env.PORT || 3000;

app.use(express.json());

const path = require('path');
const swaggerFilePath = path.resolve(__dirname, './swagger/swagger.yaml');
console.log('Looking for swagger file at:', swaggerFilePath);

if (!fs.existsSync(swaggerFilePath)) {
  console.error(';Swagger file does not exist at:', swaggerFilePath);
} else {
  const swaggerFile = fs.readFileSync(swaggerFilePath, {
    encoding: 'utf8',
    flag: 'r',
  });
  const swaggerDoc = YAML.parse(swaggerFile);
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc));
}

app.use('/api/operations', operationsRoutes);

//health-check
app.get('/health', (req, res) => {
  res.json({ msg: 'Health ok!' });
});

dbConnect();

app.listen(port, () => {
  console.log('Server is running on port', port);
});

module.exports = { app };
