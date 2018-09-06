const express = require("express");
const Router = express.Router();

const Article = require("../db/articles.js");
const DB_Article = new Article();

Router.get("/articles/new", (req, res) => {
  const ifArticle = { Article: "Yes" };
  res.render("new", ifArticle)
})

Router.get("/articles/edit", (req, res) => {
  const ifArticle = { Article: "Yes" };
  res.render("edit", ifArticle);
})

Router.get("/articles/delete", (req, res) => {
  const ifArticle = { Article: "Yes" };
  res.render("delete", ifArticle);
})

Router.get("/articles/blankedit", (req, res) => {
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

Router.get("/articles/:title/delete", (req, res) => {
  const { title } = req.params;
  DB_Article.deleteItemByTitle(title);
  const allArr = DB_Article.all();
  if (allArr.length > 0) {
    const articles = DB_Article.all();
    const artObj = { Articles: { articles } }
    res.render("indexDeleted", artObj);
  } else {
    const articles = DB_Article.all();
    const ifArticle = { Article: { articles } };
    res.render("indexDeleted", ifArticle);
  }
})

Router.get("/articles/:title/edit", (req, res) => {
  const { title } = req.params;
  const article = DB_Article.getItemByTitle(title);
  res.render("edit", { Articles: article });
})

Router.get("/articles/:title", (req, res) => {
  const { title } = req.params;
  let allArr = DB_Article.all();
  let filteredArr = allArr.filter(article => article.title === title);
  if (filteredArr.length > 0) {
    const article = DB_Article.getItemByTitle(title);
    res.render("article", article);
  } else {
    const articles = DB_Article.all();
    const artObj = { Articles: { articles } }
    if (articles.length > 0) {
      res.render("index-redirect", artObj);
    } else {
      const ifArticle = { Article: "Yes" };
      res.render("index-redirect", ifArticle);
    }
  }
})

Router.get("/articles", (req, res) => {
  const articles = DB_Article.all();
  const artObj = { Articles: { articles } }
  if (articles.length > 0) {
    res.render("index", artObj);
  } else {
    const ifArticle = { Article: "Yes" };
    res.render("index", ifArticle);
  }
})

Router.post("/articles", (req, res) => {
  if (isNaN(((req.body).title)) === true && isNaN(((req.body).body)) === true && isNaN(((req.body).author)) === true) {
    const submittedArticle = req.body;
    DB_Article.add(submittedArticle);
    res.redirect("/articles");
  } else {
    const ifArticle = { Article: "Yes" };
    res.render("new-redirect", ifArticle);
  }
})

Router.put("/articles/:title", (req, res) => {
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

Router.delete("/articles/:title", (req, res) => {
  const { title } = req.params;
  const allArr = DB_Article.all();
  const specific = DB_Article.getItemByTitle(title);
  let filteredArr = allArr.filter(article => article.title === title);
  if (filteredArr.length > 0) {
    if (allArr.length - 1 > 0) {
      DB_Article.deleteItemByTitle(title);
      const articles = DB_Article.all();
      const artObj = { Articles: { articles } };
      res.render("indexDeleted", artObj);
    } else {
      DB_Article.deleteItemByTitle(title);
      const articles = DB_Article.all();
      const ifArticle = { Article: { articles } };
      res.render("indexDeleted", ifArticle);
    }
  } else {
    const ifArticle = { Article: "Yes", Error: "Title", SpecificArticle: specific };
    res.render("delete-redirect", ifArticle);
  }
})

module.exports = Router;
