import slugify from "slugify";
import Product from "../models/Product.js";
import fs, { readFileSync } from "fs";
import braintree from "braintree";
import orderModal from "../models/orderModal.js";
import dotenv from "dotenv";

dotenv.config();

// Payment Gateway

var gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId: process.env.BRAINTREE_MERCHANT_ID,
  publicKey: process.env.BRAINTREE_PUBLIC_KEY,
  privateKey: process.env.BRAINTREE_PRIVATE_KEY,
});

export const CreateProductController = async (req, res) => {
  try {
    const { name, slug, desc, price, quantity, shipping, category } =
      req.fields;
    const { photo } = req.files;

    // Validation

    switch (true) {
      case !name:
        return res.status(401).send({ message: "Name is Required" });
      case !desc:
        return res.status(401).send({ message: "Description is Required" });
      case !price:
        return res.status(401).send({ message: "Price is Required" });
      case !quantity:
        return res.status(401).send({ message: "Quantity is Required" });
      case !category:
        return res.status(401).send({ message: "Category is Required" });
      case !photo && !photo.size < 10000:
        return res
          .status(401)
          .send({ message: "Photo is Required and size less than 10mb " });
    }

    const products = new Product({ ...req.fields, slug: slugify(name) });
    if (photo) {
      products.photo.data = readFileSync(photo.path);
      products.photo.contentType = photo.type;
    }
    await products.save();
    res.status(201).send({
      success: true,
      message: "Product Created Successfully",
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while Creating Product",
      error,
    });
  }
};

// Get All Products
export const getProductController = async (req, res) => {
  try {
    const products = await Product.find({})
      .populate("category")
      .select("-photo")
      .limit(12)
      .sort({ createdAt: -1 });
    res.status(200).send({
      success: true,
      countTotal: products.length,
      message: "All Products ",
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while getting all products",
      error,
    });
  }
};

// Get Single Product

export const getSingleProductController = async (req, res) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug })
      .select("-photo")
      .populate("category");
    res.status(200).send({
      success: true,
      message: "Single Product fetched",
      product,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while getting Single Product",
      error,
    });
  }
};

// Get Product Photo

export const getProductPhotoController = async (req, res) => {
  try {
    const product = await Product.findById(req.params.pid).select("photo");
    if (product.photo.data) {
      res.set("Content-type", product.photo.contentType);
      return res.status(200).send(product.photo.data);
    }
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error while getting Product Photo ",
      error,
    });
  }
};

// Delete Product

export const deleteProductContrller = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.pid);
    if (product) {
      return res.status(200).send({
        success: true,
        message: "Successfully Deleted this Product",
        product,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while Deleting product",
      error,
    });
  }
};

// Update Product

export const updateProductController = async (req, res) => {
  try {
    const { name, slug, desc, price, quantity, shipping, category } =
      req.fields;
    const { photo } = req.files;

    // Validation

    // switch (true) {
    //   case !name:
    //     return res.status(401).send({ message: "Name is Required" });
    //   case !desc:
    //     return res.status(401).send({ message: "Description is Required" });
    //   case !price:
    //     return res.status(401).send({ message: "Price is Required" });
    //   case !quantity:
    //     return res.status(401).send({ message: "Quantity is Required" });
    //   case !category:
    //     return res.status(401).send({ message: "Category is Required" });
    //   case !photo && !photo.size < 10000:
    //     return res
    //       .status(401)
    //       .send({ message: "Photo is Required and size less than 10mb " });
    // }

    const product = await Product.findByIdAndUpdate(
      req.params.pid,
      { ...req.fields, slug: slugify(name) },
      { new: true }
    );
    if (photo) {
      product.photo.data = readFileSync(photo.path);
      product.photo.contentType = photo.type;
    }
    await product.save();
    res.status(201).send({
      success: true,
      message: "Product Updated Successfully",
      product,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while Updating Product",
      error,
    });
  }
};

// filters

export const productFiltersController = async (req, res) => {
  try {
    const { checkedCategories, checkedPrice } = req.body;
    let args = {};
    if (checkedCategories.length > 0) args.category = checkedCategories;
    if (checkedPrice.length)
      args.price = { $gte: checkedPrice[0], $lte: checkedPrice[1] };
    // let products = checked;
    const products = await Product.find(args);
    // let products = checked;
    res.status(200).send({
      success: true,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Error while Filtering Products",
      error,
    });
  }
};

//  Product Count

export const productCountController = async (req, res) => {
  try {
    const total = await Product.find({}).estimatedDocumentCount();
    res.status(200).send({
      success: true,
      total,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Error in Product Count",
      error,
    });
  }
};
//  Product List Per Page

export const productListController = async (req, res) => {
  try {
    const perPage = 10;
    const page = req.params.page ? req.params.page : 1;
    const products = await Product.find({})
      .select("-photo")
      .skip((page - 1) * perPage)
      .limit(perPage)
      .sort({ createdAt: -1 });

    res.status(200).send({
      success: true,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Error in Product List Per Page",
      error,
    });
  }
};

// Search Product

export const searchProductController = async (req, res) => {
  try {
    const { keyword } = req.params;
    const results = await Product.find({
      $or: [
        { name: { $regex: keyword, $options: "i" } },
        { desc: { $regex: keyword, $options: "i" } },
      ],
    }).select("-photo");
    res.json(results);
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Error while Searching Product",
      error,
    });
  }
};

// Related Products

export const relatedProductController = async (req, res) => {
  try {
    const { pid, cid } = req.params;
    const products = await Product.find({
      category: cid,
      _id: { $ne: pid },
    })
      .select("-photo")
      .limit(3)
      .populate("category");
    res.status(200).send({
      success: true,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Error while getting Related Products",
      error,
    });
  }
};

// Payment Gateway  api

// token
export const braintreeTokenController = async (req, res) => {
  try {
    gateway.clientToken.generate({}, function (err, response) {
      if (err) {
        res.status(500).send(err);
      } else {
        res.send(response);
      }
    });
  } catch (error) {
    console.log(error, "payment token error");
  }
};

// payments
export const braintreePaymentController = async (req, res) => {
  try {
    const { cart, nonce } = req.body;
    let total = 0;
    cart.map((item) => {
      total += item.price;
    });
    let newTansaction = gateway.transaction.sale(
      {
        amount: total,
        paymentMethodNonce: nonce,
        options: {
          submitForSettlement: true,
        },
      },
      function (error, result) {
        if (result) {
          const order = new orderModal({
            products: cart,
            payment: result,
            buyer: req.user._id,
          }).save();
          res.json({ ok: true });
        } else {
          res.status(500).send(error);
        }
      }
    );
  } catch (error) {
    console.log(error, "payments error");
  }
};
