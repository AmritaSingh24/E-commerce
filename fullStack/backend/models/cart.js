const mongoose = require("mongoose");
const {User} = require("./user");
const {Product} = require("./product");

const cartSchema = new mongoose.Schema({
    cartId: {
        type:String,
    },
    userId: {
        type: String,
        ref: User,
    },
    data: {
        type:Date,
    },
    product: [
        {
            productId: {
                type:String,
                ref: Product,
            },
            quantity: {
                type: Number,
                default: 1,
            },
        },
    ],
});

const Cart = mongoose.model("Cart", cartSchema);
exports.Cart = Cart; 