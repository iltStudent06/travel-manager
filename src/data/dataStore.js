const fs = require('fs/promises');
const path = require('path');

const defaultPath = path.join(__dirname, 'store.json');
const dataFilePath = process.env.DATA_FILE
  ? path.resolve(process.cwd(), process.env.DATA_FILE)
  : defaultPath;

const emptySchema = {
  destinations: [],
  packages: []
};

async function ensureStoreExists() {
  try {
    await fs.access(dataFilePath);
  } catch {
    await fs.mkdir(path.dirname(dataFilePath), { recursive: true });
    await fs.writeFile(dataFilePath, JSON.stringify(emptySchema, null, 2), 'utf-8');
  }
}

async function readStore() {
  await ensureStoreExists();
  const raw = await fs.readFile(dataFilePath, 'utf-8');
  return JSON.parse(raw);
}

async function writeStore(data) {
  await fs.writeFile(dataFilePath, JSON.stringify(data, null, 2), 'utf-8');
  return data;
}

function nextId(items) {
  if (!items.length) {
    return 1;
  }
  return Math.max(...items.map((item) => item.id)) + 1;
}

module.exports = {
  readStore,
  writeStore,
  nextId
};