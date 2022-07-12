const yup = require("yup");

const cartSchema = yup.object({
  userId: yup.string().required("User Id is required"),
  product: yup.array().of(
    yup.object({
      productId: yup.string().required("productId is required"),
      quantity: yup.number().required("Quantity is required"),
    })
  ),
});

module.exports = cartSchema;
