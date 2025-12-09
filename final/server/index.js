import express from "express";
import cors from "cors";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;
const DATA_FILE = path.join(__dirname, "data.json");

app.use(cors());
app.use(express.json());

// Helper functions to read/write JSON file
async function readItems() {
  try {
    const data = await fs.readFile(DATA_FILE, "utf-8");
    return JSON.parse(data);
  } catch (err) {
    if (err.code === "ENOENT") {
      await fs.writeFile(DATA_FILE, "[]", "utf-8");
      return [];
    }
    console.error("Error reading data file:", err);
    throw err;
  }
}

async function writeItems(items) {
  await fs.writeFile(DATA_FILE, JSON.stringify(items, null, 2), "utf-8");
}

// Simple root route to confirm server is running
app.get("/", (req, res) => {
  res.send("Car Collection API is running.");
});

// GET /api/items — list all cars
app.get("/api/items", async (req, res) => {
  try {
    const items = await readItems();
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: "Failed to read items." });
  }
});

// POST /api/items — add a car with validation
app.post("/api/items", async (req, res) => {
  try {
    const { make, model, year, transmission, bodyStyle, notes } = req.body;

    // Basic validation
    if (!make || !model || !year) {
      return res.status(400).json({
        error: "Make, model, and year are required."
      });
    }

    const parsedYear = parseInt(year, 10);
    if (Number.isNaN(parsedYear) || parsedYear < 1886 || parsedYear > new Date().getFullYear() + 1) {
      return res.status(400).json({
        error: "Year must be a valid number."
      });
    }

    const items = await readItems();

    const duplicate = items.some((item) => {
      return (
        item.make.toLowerCase() === make.toLowerCase() &&
        item.model.toLowerCase() === model.toLowerCase() &&
        Number(item.year) === parsedYear
      );
    });

    if (duplicate) {
      return res.status(400).json({
        error: "This car (make/model/year) is already in your collection."
      });
    }

    const newItem = {
      id: Date.now().toString(),
      make: make.trim(),
      model: model.trim(),
      year: parsedYear,
      transmission: transmission?.trim() || "",
      bodyStyle: bodyStyle?.trim() || "",
      notes: notes?.trim() || "",
      createdAt: new Date().toISOString()
    };

    items.push(newItem);
    await writeItems(items);

    res.status(201).json(newItem);
  } catch (err) {
    console.error("Error in POST /api/items:", err);
    res.status(500).json({ error: "Failed to add item." });
  }
});

// DELETE /api/items/:id — remove a car (extra)
app.delete("/api/items/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const items = await readItems();
    const index = items.findIndex((item) => item.id === id);

    if (index === -1) {
      return res.status(404).json({ error: "Item not found." });
    }

    const [deleted] = items.splice(index, 1);
    await writeItems(items);

    res.json({ message: "Item deleted.", item: deleted });
  } catch (err) {
    console.error("Error in DELETE /api/items/:id:", err);
    res.status(500).json({ error: "Failed to delete item." });
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});