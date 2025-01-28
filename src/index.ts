import express, { Request, Response } from "express";
import cors from "cors";
import csv from "csv-parser";
import fs from "fs";
import path from "path";

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

type InventoryItem = {
  condition: string;
  description: string;
  title: string;
  timestamp: string;
  custom_label_0: string;
  brand: string;
  product_type: string;
  price: number;
};

// Load and filter data from data.csv
const loadCSVData = (
  filters: Partial<InventoryItem>
): Promise<InventoryItem[]> => {
  const filePath = path.resolve(__dirname, "../sample-data-v2.csv");
  return new Promise((resolve, reject) => {
    const results: InventoryItem[] = [];
    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (row) => {
        // Transform CSV row into InventoryItem object
        const item: InventoryItem = {
          condition: row.condition,
          description: row.description,
          title: row.title,
          timestamp: row.timestamp,
          custom_label_0: row.custom_label_0,
          brand: row.brand,
          product_type: row.product_type,
          price: parseFloat(row.price),
        };

        // Apply filters: check if all filter conditions match the row
        const matchesFilters =
          !filters ||
          Object.entries(filters).every(([key, value]) => {
            const itemValue = item[key as keyof InventoryItem];

            if (typeof itemValue === "string" && typeof value === "string") {
              // Check for partial match
              return itemValue.toLowerCase().includes(value.toLowerCase());
            }

            // For non-string values, ensure they are strictly equal
            return itemValue !== undefined && itemValue === value;
          });

        // Add item to results if it matches the filters
        if (matchesFilters) {
          results.push(item);
        }
      })
      .on("end", () => {
        // Resolve the promise with results array
        resolve(results);
        console.log("results", results.length);
      })
      .on("error", (error) => {
        // Reject the promise if an error occurs
        reject(error);
      });
  });
};

// API endpoint
app.get("/api/inventory", async (req: Request, res: Response) => {
  const filters = req.body as Partial<InventoryItem>;
  console.log("filters:", filters);
  try {
    const data = await loadCSVData(filters);
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: "Error reading the data file", error });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
