import slugify from "slugify";
import categoryModel from "../models/categoryModel.js";

export const createCategoryController = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).send({ message: "Name is required" });
    }

    const existingCategory = await categoryModel.findOne({ name });
    if (existingCategory) {
      return res.status(200).send({
        success: true,
        message: "Category Already Exists",
      });
    }
    const category =await new categoryModel({
      name,
      slug: slugify(name, { lower: true }), 
    }).save()


    res.status(201).send({
      success: true,
      message: "New category created successfully",
      category,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: "Error creating category",
      error: error.message,
    });
  }
};


//update Category Controller
export const updateCategoryController = async (req, res) => {
  try {
    const { name } = req.body;
    const { id } = req.params;
    if (!name) {
      return res
        .status(400)
        .send({ success: false, message: "Name is required" });
    }
    const category = await categoryModel.findByIdAndUpdate(
      id,
      { name, slug: slugify(name, { lower: true }) }, 
      { new: true }
    );

    if (!category) {
      return res
        .status(404)
        .send({ success: false, message: "Category not found" });
    }

    res.status(200).send({
      success: true,
      message: "Category updated successfully",
      category,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: "Error updating category",
      error: error.message,
    });
  }
};

//get All category Controller

export const categoryController = async (req, res) => {
  try {
    const categories = await categoryModel.find({});
    if (categories.length === 0) {
      return res.status(404).send({
        success: false,
        message: "No categories found",
      });
    }

   
    res.status(200).send({
      success: true,
      message: "All categories list",
      categories,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: "Error fetching categories",
      error: error.message,
    });
  }
};

//single Category Controller
export const singleCategoryController = async (req, res) => {
  try {
    const { slug } = req.params; 
    const category = await categoryModel.findOne({ slug });
    if (!category) {
      return res.status(404).send({
        success: false,
        message: "Category not found",
      });
    }

    res.status(200).send({
      success: true,
      message: "Get Single Category successfully",
      category,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: "Error fetching category",
      error: error.message,
    });
  }
};

// delete Category Controller;

export const deleteCategoryController = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await categoryModel.findById(id);
    if (!category) {
      return res.status(404).send({
        success: false,
        message: "Category not found",
      });
    }
    await categoryModel.findByIdAndDelete(id);
    res.status(200).send({
      success: true,
      message: "Category Deleted Successfully",
    });
  } catch (error) {
    console.error(error); 
    res.status(500).send({
      success: false,
      message: "Error deleting category",
      error: error.message,
    });
  }
};
