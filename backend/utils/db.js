const fs = require("fs");
const path = require("path");

/**
 * Small helper utilities to read/write JSON "collections" stored as files.
 * Acts as a lightweight file-based database so the project runs
 * without needing an external database server.
 */

const dataDir = path.join(__dirname, "..", "data");

function filePath(collection) {
  return path.join(dataDir, `${collection}.json`);
}

function readCollection(collection) {
  const file = filePath(collection);
  if (!fs.existsSync(file)) {
    fs.writeFileSync(file, "[]", "utf-8");
  }
  const raw = fs.readFileSync(file, "utf-8");
  try {
    return JSON.parse(raw || "[]");
  } catch (err) {
    console.error(`Failed to parse ${collection}.json:`, err.message);
    return [];
  }
}

function writeCollection(collection, data) {
  const file = filePath(collection);
  fs.writeFileSync(file, JSON.stringify(data, null, 2), "utf-8");
  return data;
}

module.exports = { readCollection, writeCollection };
