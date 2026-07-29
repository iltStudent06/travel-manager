const express = require('express');
const { readStore, writeStore, nextId } = require('../data/dataStore');
const validateRequiredFields = require('../middleware/validateRequiredFields');
const asyncHandler = require('../middleware/asyncHandler');

const router = express.Router();

router.get(
  '/',
  asyncHandler(async (req, res) => {
    const { destinationId } = req.query;
    const data = await readStore();
    let results = data.packages;

    if (destinationId) {
      const destId = Number(destinationId);
      results = results.filter((item) => item.destinationId === destId);
    }

    res.status(200).json(results);
  })
);

router.get(
  '/:id',
  asyncHandler(async (req, res) => {
    const id = Number(req.params.id);
    const data = await readStore();
    const packageItem = data.packages.find((item) => item.id === id);

    if (!packageItem) {
      return res.status(404).json({ error: 'Package not found' });
    }

    return res.status(200).json(packageItem);
  })
);

router.post(
  '/',
  validateRequiredFields(['title', 'destinationId', 'price', 'durationDays']),
  asyncHandler(async (req, res) => {
    const data = await readStore();
    const newPackage = {
      id: nextId(data.packages),
      title: req.body.title,
      destinationId: Number(req.body.destinationId),
      price: Number(req.body.price),
      durationDays: Number(req.body.durationDays)
    };

    data.packages.push(newPackage);
    await writeStore(data);

    return res.status(201).json(newPackage);
  })
);

router.put(
  '/:id',
  validateRequiredFields(['title', 'destinationId', 'price', 'durationDays']),
  asyncHandler(async (req, res) => {
    const id = Number(req.params.id);
    const data = await readStore();
    const index = data.packages.findIndex((item) => item.id === id);

    if (index === -1) {
      return res.status(404).json({ error: 'Package not found' });
    }

    const updated = {
      id,
      title: req.body.title,
      destinationId: Number(req.body.destinationId),
      price: Number(req.body.price),
      durationDays: Number(req.body.durationDays)
    };

    data.packages[index] = updated;
    await writeStore(data);

    return res.status(200).json(updated);
  })
);

router.delete(
  '/:id',
  asyncHandler(async (req, res) => {
    const id = Number(req.params.id);
    const data = await readStore();
    const index = data.packages.findIndex((item) => item.id === id);

    if (index === -1) {
      return res.status(404).json({ error: 'Package not found' });
    }

    data.packages.splice(index, 1);
    await writeStore(data);

    return res.status(204).send();
  })
);

module.exports = router;