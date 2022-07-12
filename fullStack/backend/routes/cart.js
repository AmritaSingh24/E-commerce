const {Cart} = require("../models/cart");
const express = require("express");
const router = express.Router();
const {Product} = require("../models/product");
const {User} = require("../models/user");

const cartSchema = require("../validations/cartValidation");
const validations = require("../middlewares/validationMiddleware");
const asyncMiddleware = require("../middlewares/async");

router.post( "/", validations(cartSchema), asyncMiddleware(async(req, res) => {

    const {userId, product} = req.body;
    let cart = await Cart.find({userId});

    if(!cart) {
        return res.send({
            success: false,
            msg: "Cart not found",
        });
    }

    cart = new Cart({
        userId,
        product,
    });

    cart.date = new Date();
    cart = await cart.save();

    res.send({
        success: true,
        cart,
        msg: "cart added successfully"
    });
}));

router.get("/", asyncMiddleware(async (req, res) => {
    let cart = await Cart.find();
    res.send({
        success: true,
        cart,
    });
}));

router.delete("/:cartId", asyncMiddleware(async (req, res) => {
    const {cartId} = req.params;
    let cart = await Cart.findOneAndRemove({cartId});
    res.send({
        success:true,
      msg: "Cart deleted successfully",
    });
}));

router.put("/:cartId", asyncMiddleware(async(req, res) => {
    const {cartId} = req.params;
    newCart = {
        userId : req.body.userId,
        product: req.body.product,
    };
    let cart = await Cart.findOneAndUpdate({cartId}, newCart);
    
    if(!cart)
    return res.send({
        success: false,
        msg: "The product with the given ID was not found.",
    });

    res.send({
        success: true,
        cart,
    });
}));

const getCartProducts = async (cart) => {
    let { cartId, userId} = cart;
    let products = [];
    for await (let item of cart.product.map(async (product) => {
        let {productId, quantity} = product;
        let productDetails = await Product.find({ productId});
        return { productId, productDetails:productDetails[0], quantity};

    })){
        products.push(item);
    }
    return { cartId, products, userId };
};

const getAllCarts  = async (carts) => {
    let cartData = [];

    for await (let cart of carts.map(async (item) => {
        return getCartProducts(item);
    })) {
        cartData.push(cart);
    }
    return { cartData};
};

router.get("/:userId", asyncMiddleware(async (req, res) => {
    const userId = req.params.userId;
    let cart = await Cart.find({userId});
    cart = await getAllCarts(cart);
    res.send({
        success: true,
        cart,
    });
}));




module.exports = router;