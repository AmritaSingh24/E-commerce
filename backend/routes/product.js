const { Product } = require("../models/product");
const { Category } = require("../models/category");
const multer = require("multer");
const express = require("express");
const validation = require("../middlewares/validationMiddleware");
const productSchema = require("../validations/productValidation");
const asyncMiddleware = require("../middlewares/async");
const router = express.Router();

// image store
const Storage = multer.diskStorage({
  destination: "uploads",
  filename: (req, file, cb) => {
    const fileName = file.originalname.toLowerCase().split(" ").join("-");
    cb(null, fileName);
  },
});

const maxSize = 1 * 1024 * 1024; // for 1MB

const upload = multer({
  storage: Storage,
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype == "image/png" ||
      file.mimetype == "image/jpg" ||
      file.mimetype == "image/jpeg"
    ) {
      cb(null, true);
    } else {
      cb(new Error("Only .png, .jpg and .jpeg format allowed!"), false);
      return {
        success: false,
        msg: "Only .png, .jpg and .jpeg format allowed!",
      };
    }
  },
  limits: { fileSize: maxSize },
});

//create

router.post(
  "/",
  upload.single("img"),
  validation(productSchema),
  asyncMiddleware(async (req, res) => {
    let category = await Category.find({ categoryName: req.body.category });
    if (category.length === 0) {
      return res.send({
        success: false,
        msg: "Category not found. Plaese add category first",
      });
    }
    let newProduct = await Product.findOne({ name: req.body.name });
    if (newProduct)
      return res.send({ success: false, msg: "This product already stored" });

    newProduct = new Product({
      productId: req.body.productId,
      name: req.body.name,
      desc: req.body.desc,
      img: req.file.filename,
      category: req.body.category,
      price: req.body.price,
    });

    const savedProduct = await newProduct.save();
    res.send({ success: true, savedProduct });
  })
);

// Update
router.put(
  "/:productId",
  validation(productSchema),
  asyncMiddleware(async (req, res) => {
    const updateProduct = await Product.findOneAndUpdate(
      { productId: req.params.productId },
      {
        $set: req.body,
      },
      {
        new: true,
      }
    );

    res.send({ success: true, updateProduct });
  })
);

// Delete
router.delete(
  "/:productId",
  asyncMiddleware(async (req, res) => {
    const deleteProduct = await Product.findOneAndDelete({
      productId: req.params.productId,
    });
    if (!deleteProduct)
      return res.send({ success: false, message: "Product not found" });
    res.send({ success: true, message: "Product has been deleted...." });
  })
);

// Get Product
router.get(
  "/:productId",
  asyncMiddleware(async (req, res) => {
    const product = await Product.findOne({ productId: req.params.productId });
    res.send({ success: true, product });
  })
);

// Get all products
router.get(
  "/",
  asyncMiddleware(async (req, res) => {
    const productSort = req.query.sort;
    const fetchCategory = req.query.category;
    const productLimit = req.query.limit;

    let products;
    if (productSort) {
      products = await Product.find().sort(productSort);
    } else if (productLimit) {
      products = await Product.find().limit(productLimit);
    }
    // Product category
    else if (fetchCategory) {
      products = await Product.find({
        category: {
          $in: [fetchCategory],
        },
      });
    } else {
      products = await Product.find();
    }
    res.send({ success: true, products });
  })
);

module.exports = router;
