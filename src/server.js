require('dotenv').config();

const express = require('express');
const path = require('path');
const requestLogger = require('./middleware/requestLogger');
const { notFoundHandler, errorHandler } = require('./middleware/errorHandler');

const destinationsRouter = require('./routes/destinations');
const packagesRouter = require('./routes/packages');

const app = express();
const port = Number(process.env.PORT) || 3000;

app.use(express.json());
app.use(requestLogger);
app.use(express.static(path.join(__dirname, '..', 'public')));

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.use('/api/destinations', destinationsRouter);
app.use('/api/packages', packagesRouter);

app.use(notFoundHandler);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Travel Manager API running on port ${port}`);
});