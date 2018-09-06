const express = require("express");
const Router = express.Router();

const Product = require("../db/products.js");
const DB_Product = new Product();

Router.get("/products/new", (req, res) => {
  const ifProduct = { Product: "Yes" };
  res.render("new", ifProduct);
})

Router.get("/products/edit", (req, res) => {
  const ifProduct = { Product: "Yes" };
  res.render("edit", ifProduct);
})

Router.get("/products/delete", (req, res) => {
  const ifProduct = { Product: "Yes" };
  res.render("delete", ifProduct);
})

Router.get("/products/blankedit", (req, res) => {
  let stringInfo = ((req.url.split("?"))[1]);
  let newArr = stringInfo.split("&").join("=").split("=");
  const id = newArr[1];
  let allArr = DB_Product.all();
  let filteredArr = allArr.filter(product => parseInt(product.id) === parseInt(id));
  if (filteredArr.length > 0) {
    if (isNaN(newArr[3]) === true && isNaN(newArr[5]) === false && isNaN(newArr[7]) === false) {
      const productArr = newArr;
      DB_Product.updateItemByIdBlank(id, productArr);
      res.redirect(`/products/${id}`);
    } else {
      const urlProdObj = { id: newArr[1], name: newArr[3], price: newArr[5], inventory: newArr[7] }
      const ifProduct = { Product: "Yes", Error: "Input", urlProdObj };
      res.render("edit-redirect-one", ifProduct);
    }
  } else {
    const urlProdObj = { id: newArr[1], name: newArr[3], price: newArr[5], inventory: newArr[7] }
    const ifProduct = { Product: "Yes", Error: "ID", urlProdObj };
    res.render("edit-redirect-two", ifProduct);
  }
})

Router.get("/products/:id/delete", (req, res) => {
  const { id } = req.params;
  DB_Product.deleteItemById(id);
  const allArr = DB_Product.all();
  if (allArr.length > 0) {
    const products = DB_Product.all();
    const prodObj = { Products: { products } }
    res.render("indexDeleted", prodObj);
  } else {
    const products = DB_Product.all();
    const ifProduct = { Product: { products } };
    res.render("indexDeleted", ifProduct);
  }
})

Router.get("/products/:id/edit", (req, res) => {
  const { id } = req.params;
  const product = DB_Product.getItemById(id);
  res.render("edit", { Products: product });
})

Router.get("/products/:id", (req, res) => {
  const { id } = req.params;
  const product = DB_Product.getItemById(id);
  res.render("product", product);
})

Router.get("/products/search/:name", (req, res) => {
  const { name } = req.params;
  let allArr = DB_Product.all();
  let filteredArr = allArr.filter(product => product.name === name);
  if (filteredArr.length > 0) {
    const product = DB_Product.getItemByName(name);
    res.render("product", product);
  } else {
    const products = DB_Product.all();
    const prodObj = { Products: { products } }
    if (products.length > 0) {
      res.render("index-redirect", prodObj);
    } else {
      const ifProduct = { Product: "Yes" };
      res.render("index-redirect", ifProduct);
    }
  }
})

Router.get("/products", (req, res) => {
  const products = DB_Product.all();
  const prodObj = { Products: { products } }
  if (products.length > 0) {
    res.render("index", prodObj);
  } else {
    const ifProduct = { Product: "Yes" };
    res.render("index", ifProduct);
  }
})

Router.post("/products", (req, res) => {
  if (isNaN(((req.body).name)) === true && isNaN(((req.body).price)) === false && isNaN(((req.body).inventory)) === false) {
    const submittedProduct = req.body;
    DB_Product.add(submittedProduct);
    res.redirect("/products");
  } else {
    const ifProduct = { Product: "Yes" };
    res.render("new-redirect", ifProduct);
  }
})

Router.put("/products/:id", (req, res) => {
  const { id } = req.params;
  if (isNaN(((req.body).name)) === true && isNaN(((req.body).price)) === false && isNaN(((req.body).inventory)) === false) {
    const submittedProduct = req.body;
    DB_Product.updateItemById(id, submittedProduct);
    res.redirect(`/products/${id}`);
  } else {
    const { id } = req.params;
    const product = DB_Product.getItemById(id);
    const ifProduct = { Product: "Yes", Error: "Input", product };
    res.render("edit-redirect-one", ifProduct);
  }
})

Router.delete("/products/:name", (req, res) => {
  const { name } = req.params;
  const allArr = DB_Product.all();
  const specific = DB_Product.getItemByName(name);
  let filteredArr = allArr.filter(product => product.name === name);
  if (filteredArr.length > 0) {
    if (allArr.length - 1 > 0) {
      DB_Product.deleteItemByName(name);
      const products = DB_Product.all();
      const prodObj = { Products: { products } };
      res.render("indexDeleted", prodObj);
    } else {
      DB_Product.deleteItemById(id);
      const products = DB_Product.all();
      const ifProduct = { Product: { products } };
      res.render("indexDeleted", ifProduct);
    }
  } else {
    const ifProduct = { Product: "Yes", Error: "ID", SpecificProduct: specific };
    res.render("delete-redirect", ifProduct);
  }
})

module.exports = Router;