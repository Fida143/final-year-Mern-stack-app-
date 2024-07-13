import slugify from "slugify";
import CategoryModel from "../models/Category.js";

export const CreateCategoryController = async (req, res) => {
  try {
    const { name } = req.body;

    // Validation

    if (!name) {
      return res.status(401).send({
        message: "Name is Required",
      });
    }

    // is Alredy existing Category
    const existingCategory = await CategoryModel.findOne({ name });

    if (existingCategory) {
      return res.status(200).send({
        success: false,
        message: "Category Alredy Exists",
      });
    }

    const catergory = await new CategoryModel({
      name,
      slug: slugify(name),
    }).save();
    res.status(201).send({
      success: true,
      message: "New Category Created",
      catergory,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in Category ",
      error,
    });
  }
};

// Update Category
export const UpdateCategoryController = async (req, res) => {
  try {
    const { name } = req.body;
    const { id } = req.params;

    const category = await CategoryModel.findByIdAndUpdate(
      id,
      { name, slug: slugify(name) },
      { new: true }
    );
    console.log(category);
    res.status(200).send({
      success: true,
      message: "Category Update Successfully",
      category,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error While Updating Category ",
      error,
    });
  }
};

// Get All Categories

export const GetCategoryController = async (req, res) => {
  try {
    const categories = await CategoryModel.find({});
    res.status(200).send({
      success: true,
      message: "All Categories list",
      categories,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while getting Category ",
    });
  }
};

// Get Single Category

export const GetSingleCategoryController = async (req, res) => {
  try {
    const category = await CategoryModel.findOne({ slug: req.params.slug });
    res.status(200).send({
      success: true,
      message: "Getting Single Category Successfully ",
      category,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in Getting Single Category",
      error,
    });
  }
};

export const DeleteCategoryController = async (req, res) => {
  try {
    const { id } = req.params;
    await CategoryModel.findByIdAndDelete(id);
    res.status(200).send({
      success: true,
      message: "Category Deleted Successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while Deleting Category",
      error,
    });
  }
};
