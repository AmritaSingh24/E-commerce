const { Product } = require("../models/product");
const { Category } = require("../models/category");
const express = require("express");
const router = express.Router();
const asyncMiddleware = require("../middlewares/async");

router.get(
  "/",
  asyncMiddleware(async (req, res) => {
    const category = await Category.find();
    res.send({
      success: true,
      category,
    });
  })
);

router.get(
  "/:category",
  asyncMiddleware(async (req, res) => {
    const category = req.params.category;
    const limit = Number(req.query.limit) || 0;
    const sort = req.query.sort == "desc" ? -1 : 1;
    const categoryProduct = await Product.find({
      category,
    })
      .sort({ id: sort })
      .limit({ limit });

    res.send({
      success: true,
      categoryProduct,
    });
  })
);

router.post(
  "/",
  asyncMiddleware(async (req, res) => {
    const { categoryName } = req.body;
    let category = await Category.findOne({ categoryName });

    if (category) {
      return res.send({ success: false, msg: "Category already present." });
    }

    category = new Category({
      categoryName,
      categoryId: req.body.categoryId
    });

    await category.save();
    return res.send({
      success: true,
      category,
    });
  })
);

module.exports = router;
