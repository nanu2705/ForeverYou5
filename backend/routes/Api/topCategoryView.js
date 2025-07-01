// routes/Api/topCategoryView.js
import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dataFilePath = path.join(__dirname, '../../data.json');
const categoryJsonPath = path.join(__dirname, '../../category.json');

// ✅ Get all products grouped by top category

app.get('/api/all-products-by-top-category', (req, res) => {
  fs.readFile(dataFilePath, 'utf8', (err, dataContent) => {
    if (err) return res.status(500).json({ error: 'Error reading data.json' });

    fs.readFile(categoryJsonPath, 'utf8', (err2, catContent) => {
      if (err2) return res.status(500).json({ error: 'Error reading category.json' });

      try {
        const allCategories = JSON.parse(dataContent);
        const topCategories = JSON.parse(catContent);

        const result = topCategories.map(topCat => {
          const matchedCategories = allCategories.filter(cat =>
            topCat.categories.includes(cat.route_category)
          );

          const allProducts = matchedCategories.flatMap(cat => cat.products);

          return {
            title: topCat.title,
            categoryRef: topCat.categoryRef,
            products: allProducts
          };
        });

        res.status(200).json({ success: true, data: result });
      } catch (e) {
        res.status(500).json({ error: 'Error parsing JSON data' });
      }
    });
  });
});

app.get('/api/products-by-top-category/:ref', (req, res) => {
  const ref = req.params.ref.toLowerCase();

  try {
    const topCategories = JSON.parse(fs.readFileSync(categoryJsonPath, 'utf8'));
    const allProducts = JSON.parse(fs.readFileSync(dataFilePath, 'utf8'));

    // Get top category block from category.json
    const matchedTopCat = topCategories.find(
      (cat) => cat.categoryRef.toLowerCase() === ref
    );

    if (!matchedTopCat) {
      return res.status(404).json({ error: 'Top category not found' });
    }

    const result = [];

    matchedTopCat.categories.forEach((subcategoryName) => {
      const matched = allProducts.find(
        (item) =>
          item.title?.toLowerCase() === ref &&
          item.category?.toLowerCase() === subcategoryName.toLowerCase()
      );

      if (matched) {
        result.push({
          category: matched.category,
          route_category: matched.route_category || matched.category.toLowerCase().replace(/\s+/g, '-'),
          products: matched.products || [],
        });
      }
    });

    res.status(200).json(result);
  } catch (e) {
    console.error("Error:", e);
    res.status(500).json({ error: 'Server error' });
  }
});




export default app;
