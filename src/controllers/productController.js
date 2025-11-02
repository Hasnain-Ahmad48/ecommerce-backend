import Product from "../models/productModel.js";
import {cloudinary} from "../utils/cloudinaryConfig.js";

// GET /api/products
const getProducts = async (req, res) => {
  const products = await Product.find({});
  res.json(products);
};

// GET /api/products/:id
const getProductById = async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) return res.json(product);
  res.status(404);
  throw new Error("Product not found");
};

// POST /api/products  (admin)
const createProduct = async (req, res) => {
  const {name, brand, category, description, price, countInStock} = req.body;

  let image = {};
  if (req.file && req.file.path) {
    image = {
      url: req.file.path,
      public_id: req.file.filename,
    };
  }

  const product = new Product({
    name,
    brand,
    category,
    description,
    price,
    countInStock,
    image,
    user: req.user._id,
  });

  const created = await product.save();
  res.status(201).json(created);
};

// PUT /api/products/:id (admin)
const updateProduct = async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  product.name = req.body.name ?? product.name;
  product.brand = req.body.brand ?? product.brand;
  product.category = req.body.category ?? product.category;
  product.description = req.body.description ?? product.description;
  product.price = req.body.price ?? product.price;
  product.countInStock = req.body.countInStock ?? product.countInStock;

  // if new image uploaded, remove old image from cloudinary then assign new
  if (req.file && req.file.path) {
    // delete previous from cloudinary if exists
    if (product.image?.public_id) {
      try {
        await cloudinary.uploader.destroy(product.image.public_id);
      } catch (err) {
        console.warn("Cloudinary deletion failed:", err.message);
      }
    }
    product.image = {url: req.file.path, public_id: req.file.filename};
  }

  const updated = await product.save();
  res.json(updated);
};

// DELETE /api/products/:id (admin)
const deleteProduct = async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  // delete from cloudinary if image exists
  if (product.image?.public_id) {
    try {
      await cloudinary.uploader.destroy(product.image.public_id);
    } catch (err) {
      console.warn("Cloudinary deletion failed:", err.message);
    }
  }

  await Product.findByIdAndDelete(req.params.id);
  res.json({message: "Product removed"});
};

export {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
