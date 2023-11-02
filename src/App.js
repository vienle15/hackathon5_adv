import express from "express";
import "dotenv/config";
import fs from "fs";

const app = express();
const port = 9999;

const dataPath = "src/models/data.json";

// Middleware để đọc dữ liệu từ JSON
app.use(express.json());

// Lấy danh sách toàn bộ sản phẩm
app.get("/products", (req, res) => {
  fs.readFile(dataPath, "utf8", (err, data) => {
    if (err) {
      res.status(500).send("Lỗi đọc dữ liệu.");
      return;
    }
    const products = JSON.parse(data);
    res.json(products);
  });
});

// Lấy thông tin một sản phẩm theo id
app.get("/products/:id", (req, res) => {
  const productId = parseInt(req.params.id);
  fs.readFile(dataPath, "utf8", (err, data) => {
    if (err) {
      res.status(500).send("Lỗi đọc dữ liệu.");
      return;
    }
    const products = JSON.parse(data);
    const product = products.find((p) => p.id === productId);
    if (product) {
      res.json(product);
    } else {
      res.status(404).send("Sản phẩm không tồn tại.");
    }
  });
});

// Thêm sản phẩm mới
app.post("/products", (req, res) => {
  fs.readFile(dataPath, "utf8", (err, data) => {
    if (err) {
      res.status(500).send("Lỗi đọc dữ liệu.");
      return;
    }
    const products = JSON.parse(data);
    const newProduct = req.body;
    newProduct.id = generateProductId(products);
    products.push(newProduct);
    fs.writeFile(dataPath, JSON.stringify(products), (err) => {
      if (err) {
        res.status(500).send("Lỗi ghi dữ liệu.");
        return;
      }
      res.json(newProduct);
    });
  });
});

// Helper function để tạo id mới cho sản phẩm
function generateProductId(products) {
  const maxId = products.reduce(
    (max, product) => (product.id > max ? product.id : max),
    0
  );
  return maxId + 1;
}

app.listen(port, () => {
  console.log(`Server is running on port http://localhost:${port}`);
});
