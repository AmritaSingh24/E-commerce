const express = require("express");
const app = express();
const mongoose = require("mongoose");
const userRouter = require("./routes/user");
const productRouter = require("./routes/product");
const cartRouter = require("./routes/cart");
const categoryRouter = require("./routes/category");
const cors = require("cors");
const error = require("./middlewares/error");

mongoose
  .connect("mongodb://localhost/e-commerce")
  .then(() => console.log("Connected to mongoDB..."))
  .catch((err) => console.log("Could not connect to mongoDB...", err));

app.use(express.json());
app.use(cors());
app.use("/uploads", express.static("uploads"));
app.use("/api/users", userRouter);
app.use("/api/products", productRouter);
app.use("/api/carts", cartRouter);
app.use("/api/category", categoryRouter);
app.use(error);

app.listen(4000, () => {
  console.log("backend server is runnning");
});
