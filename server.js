const express = require("express");
const methodOverride = require("method-override")
const app = express();
const bp = require("body-parser");
const exphbs = require("express-handlebars");

//Temp DB
const Product = require("./db/products.js");
const DB_Product = new Product();

const Article = require("./db/articles.js");
const DB_Article = new Article();

const PORT = process.env.PORT;

app.use(methodOverride("_method"))
app.use(express.static("public"));

app.use(bp.urlencoded({ extended: true }));
app.engine(".hbs", exphbs({ defaultLayout: "layout", extname: ".hbs" }));
app.set("view engine", ".hbs");

app.get("/", (req, res) => {
  res.render("home");
})

app.get("/products/new", (req, res) => {
  //Temporary object is made to check for product(also used in aricle) so that it can be used with handlebars to check for conditionals
  //Used often below to differentiate between products and articles in shared hbs files
  const ifProduct = { Product: "Yes" };
  res.render("new", ifProduct);
})

app.get("/products/edit", (req, res) => {
  const ifProduct = { Product: "Yes" };
  res.render("edit", ifProduct);
})

app.get("/products/blankedit", (req, res) => {
  console.log(req.url, "DAFUQAMILOOKINGAT")
  const id = req.query.id;
  console.log(typeof id, "typeofid")
  allArr = DB_Product.all();
  console.log(allArr, "ALLARR");
  filteredArr = allArr.filter(product => product.id === parseInt(id));
  filteredObj = filteredArr[0];
  console.log(filteredArr, "GIVE ME MY FUCKING FILTEREDARR");
  console.log(filteredObj, "THIS SHOULD BE MY FUCKING ANSWER");
  if (filteredArr.length > 0) {
    if (isNaN(((filteredObj).name)) === true && isNaN(((filteredObj).price)) === false && isNaN(((filteredObj).inventory)) === false) {
      const submittedProduct = filteredObj;
      DB_Product.updateItemById(id, submittedProduct);
      res.redirect(`/products/${id}`);
    } else {
      const ifProduct = { Product: "Yes", Error: "Input" };
      res.render("edit-redirect-one", ifProduct);
    }
  } else {
    const ifProduct = { Product: "Yes", Error: "ID" };
    res.render("edit-redirect-two", ifProduct);
  }
})

app.get("/products/:id/edit", (req, res) => {
  const { id } = req.params;
  const product = DB_Product.getItemById(id);
  res.render("edit", product);
})

app.get("/products/:id", (req, res) => {
  const { id } = req.params;
  const product = DB_Product.getItemById(id);
  res.render("product", product);
})

app.get("/products", (req, res) => {
  const products = DB_Product.all();
  const prodObj = { Products: { products } }
  if (products.length > 0) {
    res.render("index", prodObj);
  } else {
    const ifProduct = { Product: "Yes" };
    res.render("index", ifProduct);
  }
})

app.put("/products/:id", (req, res) => {
  const { id } = req.params;
  if (isNaN(((req.body).name)) === true && isNaN(((req.body).price)) === false && isNaN(((req.body).inventory)) === false) {
    const submittedProduct = req.body;
    DB_Product.updateItemById(id, submittedProduct);
    res.redirect(`/products/${id}`);
  } else {
    const ifProduct = { Product: "Yes", Error: "Input" };
    res.render("edit-redirect", ifProduct);
  }

})

app.post("/products", (req, res) => {
  if (isNaN(((req.body).name)) === true && isNaN(((req.body).price)) === false && isNaN(((req.body).inventory)) === false) {
    const submittedProduct = req.body;
    DB_Product.add(submittedProduct);
    res.redirect("/products");
  } else {
    const ifProduct = { Product: "Yes" };
    res.render("new-redirect", ifProduct);
  }
})

app.get("/articles/new", (req, res) => {
  const ifArticle = { Article: "Yes" };
  res.render("new", ifArticle)
})

app.get("/articles", (req, res) => {
  const articles = DB_Article.all();
  if (articles.length > 0) {
    res.render("index", { articles });
  } else {
    const ifArticle = { Article: "Yes" };
    res.render("index", ifArticle);
  }
})

app.post("/articles", (req, res) => {
  if (isNaN(((req.body).title)) === true && isNaN(((req.body).body)) === true && isNaN(((req.body).author)) === true) {
    const submittedArticle = req.body;
    DB_Article.add(submittedArticle);
    res.redirect("/articles");
  } else {
    const ifArticle = { Article: "Yes" };
    res.render("new-redirect", ifArticle);
  }
})



app.listen(PORT, () => {
  console.log(`Started app on port: ${PORT}`);
});