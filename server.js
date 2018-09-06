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

app.get("/products/:id/delete", (req, res) => {
  const { id } = req.params;
  DB_Product.deleteItemById(id);
  const products = DB_Product.all();
  const prodObj = { Products: { products } }
  if (products.length > 0) {
    res.render("indexDeleted", prodObj);
  } else {
    const ifProduct = { Product: { products } };
    res.render("indexDeleted", ifProduct);
  }
})

app.get("/products/:id/edit", (req, res) => {
  const { id } = req.params;
  const product = DB_Product.getItemById(id);
  res.render("edit", { Products: product });
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
    const { id } = req.params;
    const product = DB_Product.getItemById(id);
    const ifProduct = { Product: "Yes", Error: "Input", product };
    res.render("edit-redirect-one", ifProduct);
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

app.delete("/products/:id"), (req, res) => {
  const { id } = req.params;
  DB_Product.deleteItemById(id);
  res.redirect("/products");
}

app.get("/articles/new", (req, res) => {
  const ifArticle = { Article: "Yes" };
  res.render("new", ifArticle)
})

app.get("/articles/edit", (req, res) => {
  const ifArticle = { Article: "Yes" };
  res.render("edit", ifArticle);
})

app.get("/articles/blankedit", (req, res) => {
  let stringInfo = ((req.url.split("?"))[1]);
  let newArr = stringInfo.split("&").join("=").split("=");
  const title = newArr[1];
  let allArr = DB_Article.all();
  let filteredArr = allArr.filter(article => title === article.title);
  if (filteredArr.length > 0) {
    if (isNaN(newArr[1]) === true && isNaN(newArr[3]) === true && isNaN(newArr[5]) === true) {
      const articleArr = newArr;
      DB_Article.updateItemByTitleBlank(title, articleArr);
      res.redirect(`/articles/${title}`);
    } else {
      const urlArtObj = { title: newArr[1], body: newArr[3], author: newArr[5] }
      const ifArticle = { Article: "Yes", Error: "Input", urlArtObj };
      res.render("edit-redirect-one", ifArticle);
    }
  } else {
    const urlArtObj = { title: newArr[1], body: newArr[3], author: newArr[5] }
    const ifArticle = { Article: "Yes", Error: "Title", urlArtObj };
    res.render("edit-redirect-two", ifArticle);
  }
})

app.get("/articles/:title/delete", (req, res) => {
  const { title } = req.params;
  DB_Article.deleteItemByTitle(title);
  const articles = DB_Article.all();
  const artObj = { Articles: { articles } }
  if (articles.length > 0) {
    res.render("indexDeleted", artObj);
  } else {
    const ifArticle = { Article: { articles } };
    res.render("indexDeleted", ifArticle);
  }
})

app.get("/articles/:title/edit", (req, res) => {
  const { title } = req.params;
  const article = DB_Article.getItemByTitle(title);
  res.render("edit", { Articles: article });
})

app.get("/articles/:title", (req, res) => {
  const { title } = req.params;
  const product = DB_Article.getItemByTitle(title);
  res.render("article", product);
})

app.get("/articles", (req, res) => {
  const articles = DB_Article.all();
  const artObj = { Articles: { articles } }
  if (articles.length > 0) {
    res.render("index", artObj);
  } else {
    const ifArticle = { Article: "Yes" };
    res.render("index", ifArticle);
  }
})

app.put("/articles/:title", (req, res) => {
  const { title } = req.params;
  if (isNaN(((req.body).title)) === true && isNaN(((req.body).body)) === true && isNaN(((req.body).author)) === true) {
    const submittedArticle = req.body;
    DB_Article.updateItemByTitle(title, submittedArticle);
    res.redirect(`/articles/${title}`);
  } else {
    const { title } = req.params;
    const article = DB_Article.getItemByTitle(title);
    const ifArticle = { Article: "Yes", Error: "Input", article };
    res.render("edit-redirect-one", ifArticle);
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