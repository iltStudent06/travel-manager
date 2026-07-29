const express = require('express');
const { readStore, writeStore, nextId } = require('../data/dataStore');
const validateRequiredFields = require('../middleware/validateRequiredFields');
const asyncHandler = require('../middleware/asyncHandler');

const router = express.Router();

router.get(
  '/',
  asyncHandler(async (req, res) => {
    const { destination, country } = req.query;
    const data = await readStore();
    let results = data.destinations;

    if (destination) {
      const query = String(destination).toLowerCase();
      results = results.filter((item) => item.name.toLowerCase().includes(query));
    }

    if (country) {
      const query = String(country).toLowerCase();
      results = results.filter((item) => item.country.toLowerCase().includes(query));
    }

    res.status(200).json(results);
  })
);

router.get(
  '/:id',
  asyncHandler(async (req, res) => {
    const id = Number(req.params.id);
    const data = await readStore();
    const destinationItem = data.destinations.find((item) => item.id === id);

    if (!destinationItem) {
      return res.status(404).json({ error: 'Destination not found' });
    }

    return res.status(200).json(destinationItem);
  })
);

router.post(
  '/',
  validateRequiredFields(['name', 'country', 'description']),
  asyncHandler(async (req, res) => {
    const data = await readStore();
    const newDestination = {
      id: nextId(data.destinations),
      name: req.body.name,
      country: req.body.country,
      description: req.body.description
    };

    data.destinations.push(newDestination);
    await writeStore(data);

    res.status(201).json(newDestination);
  })
);

router.put(
  '/:id',
  validateRequiredFields(['name', 'country', 'description']),
  asyncHandler(async (req, res) => {
    const id = Number(req.params.id);
    const data = await readStore();
    const index = data.destinations.findIndex((item) => item.id === id);

    if (index === -1) {
      return res.status(404).json({ error: 'Destination not found' });
    }

    const updated = {
      id,
      name: req.body.name,
      country: req.body.country,
      description: req.body.description
    };

    data.destinations[index] = updated;
    await writeStore(data);

    return res.status(200).json(updated);
  })
);

router.delete(
  '/:id',
  asyncHandler(async (req, res) => {
    const id = Number(req.params.id);
    const data = await readStore();
    const index = data.destinations.findIndex((item) => item.id === id);

    if (index === -1) {
      return res.status(404).json({ error: 'Destination not found' });
    }

    data.destinations.splice(index, 1);
    await writeStore(data);

    return res.status(204).send();
  })
);

module.exports = router;