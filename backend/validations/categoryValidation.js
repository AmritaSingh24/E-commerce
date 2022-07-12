const yup = require("yup");

const categorySchema = yup.object({
  categoryname: yup.string().required("Category name is required"),
  categoryId: yup.string().required("category Id is required"),
});

module.exports = categorySchema;