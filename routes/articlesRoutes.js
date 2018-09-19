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

Router.get("/articles/deleted", (req, res) => {
  DB_Article.deleted()
    .then(results => {
      const articles = results.rows;
      if (articles.length > 0) {
        const artObj = { Articles: { articles } }
        res.render("deleted-items", artObj);
      } else {
        const ifArticle = { Article: "Yes" };
        res.render("deleted-items", ifArticle);
      }
    })
    .catch(err => {
      console.log('error', err)
    })
})

Router.get("/articles/old", (req, res) => {
  DB_Article.old()
    .then(results => {
      const articles = results.rows;
      const artObj = { Articles: { articles } };
      if (articles.length > 0) {
        res.render("previous-items", artObj);
      } else {
        const ifArticle = { Article: "Yes" };
        res.render("previous-items", ifArticle);
      }
    })
    .catch(err => {
      console.log('error', err)
    })
})

Router.get("/articles/:title/delete", (req, res) => {
  const { title } = req.params;
  DB_Article.getItemByTitle(title)
    .then(results => {
      info = results.rows[0];
      DB_Article.insertDeletedItem(info)
        .then(results => {
          DB_Article.deleteItemByTitle(title)
            .then(results => {
              DB_Article.all()
                .then(results => {
                  const allArr = results.rows;
                  if (allArr.length > 0) {
                    DB_Article.all()
                      .then(results => {
                        const articles = results.rows;
                        const artObj = { Articles: { articles } }
                        res.render("indexDeleted", artObj);
                      })
                      .catch(err => {
                        console.log('error', err)
                      })
                  } else {
                    DB_Article.all()
                      .then(results => {
                        const articles = results.rows;
                        const ifArticle = { Article: { articles } };
                        res.render("indexDeleted", ifArticle);
                      })
                      .catch(err => {
                        console.log('error', err)
                      })
                  }
                })
                .catch(err => {
                  console.log('error', err)
                })
            })
            .catch(err => {
              console.log('error', err)
            })
        })
        .catch(err => {
          console.log('error', err)
        })
    })
    .catch(err => {
      console.log('error', err)
    })
})

Router.get("/articles/:title/edit", (req, res) => {
  const { title } = req.params;
  DB_Article.getItemByTitle(title)
    .then(results => {
      const article = results.rows[0];
      res.render("edit", { Articles: article });
    })
    .catch(err => {
      console.log('error', err)
    })
})

Router.get("/articles/:title", (req, res) => {
  const { title } = req.params;
  DB_Article.filter(title)
    .then(results => {
      let filteredArr = results.rows;
      if (filteredArr.length > 0) {
        DB_Article.getItemByTitle(title)
          .then(results => {
            const article = results.rows[0];
            res.render("article", article);
          })
          .catch(err => {
            console.log('error', err)
          })
      } else {
        DB_Article.all()
          .then(results => {
            const articles = results.rows;
            const artObj = { Articles: { articles } };
            if (articles.length > 0) {
              res.render("index-redirect", artObj);
            } else {
              const ifArticle = { Article: "Yes" };
              res.render("index-redirect", ifArticle);
            }
          })
          .catch(err => {
            console.log('error', err)
          })
      }
    })
    .catch(err => {
      console.log('error', err)
    })
})

Router.get("/articles/deleted/:id/restore", (req, res) => {
  const { id } = req.params;
  DB_Article.getDeletedItemById(id)
    .then(results => {
      const reference_id = (results.rows[0]).reference_id;
      DB_Article.restoreDeletedItem(reference_id)
        .then(results => {
          DB_Article.deleteFromDeleted(id)
            .then(results => {
              DB_Article.all()
                .then(results => {
                  const articles = results.rows;
                  const artObj = { Articles: { articles } }
                  if (articles.length > 0) {
                    res.render("index", artObj);
                  } else {
                    const ifArticle = { Article: "Yes" };
                    res.render("index", ifArticle);
                  }
                })
                .catch(err => {
                  console.log('error', err)
                })
            })
            .catch(err => {
              console.log('error', err)
            })
        })
        .catch(err => {
          console.log('error', err)
        })
    })
    .catch(err => {
      console.log('error', err)
    })
})

Router.get("/articles/deleted/:id", (req, res) => {
  const { id } = req.params;
  DB_Article.getDeletedItemById(id)
    .then(results => {
      const article = results.rows[0];
      res.render("deletedArticle", article);
    })
    .catch(err => {
      console.log('error', err)
    })
})

Router.get("/articles/old/:id/:version/restore", (req, res) => {
  const id = (req.params).id;
  const version = (req.params).version;
  DB_Article.getItemById(id)
    .then(results => {
      const info = results.rows[0];
      DB_Article.insertOldItem(info)
        .then(results => {
          DB_Article.getPreviousItemById(id, version)
            .then(results => {
              const article = results.rows[0];
              DB_Article.restorePreviousItem(id, article)
                .then(results => {
                  DB_Article.all()
                    .then(results => {
                      const articles = results.rows;
                      const artObj = { Articles: { articles } }
                      if (articles.length > 0) {
                        res.render("index", artObj);
                      } else {
                        const ifArticle = { Article: "Yes" };
                        res.render("index", ifArticle);
                      }
                    })
                    .catch(err => {
                      console.log('error', err)
                    })
                })
                .catch(err => {
                  console.log('error', err)
                })
            })
            .catch(err => {
              console.log('error', err)
            })
        })
        .catch(err => {
          console.log('error', err)
        })
    })
    .catch(err => {
      console.log('error', err)
    })
})

Router.get("/articles/old/:id/:version", (req, res) => {
  const id = (req.params).id;
  const version = (req.params).version;
  DB_Article.getPreviousItemById(id, version)
    .then(results => {
      const article = results.rows[0];
      res.render("previousArticle", article);
    })
    .catch(err => {
      console.log('error', err)
    })
})

Router.get("/articles", (req, res) => {
  DB_Article.all()
    .then(results => {
      const articles = results.rows;
      const artObj = { Articles: { articles } }
      if (articles.length > 0) {
        res.render("index", artObj);
      } else {
        const ifArticle = { Article: "Yes" };
        res.render("index", ifArticle);
      }
    })
    .catch(err => {
      console.log('error', err)
    })
})

Router.post("/articles", (req, res) => {
  if (DB_Article.ifChecker(req.body) === true) {
    const submittedArticle = req.body;
    DB_Article.add(submittedArticle)
      .then(results => {
        res.redirect("/articles");
      })
      .catch(err => {
        console.log('error', err)
      })
  } else {
    const ifArticle = { Article: "Yes" };
    res.render("new-redirect", ifArticle);
  }
})

Router.put("/articles/:id", (req, res) => {
  if (DB_Article.ifChecker(req.body) === true) {
    const { id } = req.params;
    const submittedArticle = req.body;
    DB_Article.getItemById(id)
      .then(results => {
        info = results.rows[0];
        DB_Article.insertOldItem(info)
          .then(results => {
            DB_Article.updateItemById(id, submittedArticle)
              .then(results => {
                const newTitle = submittedArticle.title;
                res.redirect(`/articles/${newTitle}`);
              })
              .catch(err => {
                console.log('error', err)
              })
          })
          .catch(err => {
            console.log('error', err)
          })
      })
      .catch(err => {
        console.log('error', err)
      })
  } else {
    const { id } = req.params;
    DB_Article.getItemById(id)
      .then(results => {
        article = results.rows[0];
        const ifArticle = { Article: "Yes", Error: "Input", article };
        res.render("edit-redirect-one", ifArticle);
      })
      .catch(err => {
        console.log('error', err)
      })
  }
})

Router.delete("/articles/:title", (req, res) => {
  const { title } = req.params;
  DB_Article.all()
    .then(results => {
      allArr = results.rows;
      DB_Article.filter(title)
        .then(results => {
          let filteredArr = results.rows;
          if (filteredArr.length > 0) {
            if (allArr.length - 1 > 0) {
              DB_Article.getItemByTitle(title)
                .then(results => {
                  info = results.rows[0];
                  DB_Article.insertDeletedItem(info)
                    .then(results => {
                      DB_Article.deleteItemByTitle(title)
                        .then(results => {
                          DB_Article.all()
                            .then(results => {
                              articles = results.rows;
                              const artObj = { Articles: { articles } };
                              res.render("indexDeleted", artObj);
                            })
                            .catch(err => {
                              console.log('error', err)
                            })
                        })
                        .catch(err => {
                          console.log('error', err)
                        })
                    })
                    .catch(err => {
                      console.log('error', err)
                    })
                })
                .catch(err => {
                  console.log('error', err)
                })
            } else {
              DB_Article.getItemByTitle(title)
                .then(results => {
                  let info = results.rows[0];
                  DB_Article.insertDeletedItem(info)
                    .then(results => {
                      DB_Article.deleteItemByTitle(title)
                        .then(results => {
                          DB_Article.all()
                            .then(results => {
                              const articles = results.rows;
                              const ifArticle = { Article: { articles } };
                              res.render("indexDeleted", ifArticle);
                            })
                            .catch(err => {
                              console.log('error', err)
                            })
                        })
                        .catch(err => {
                          console.log('error', err)
                        })
                    })
                    .catch(err => {
                      console.log('error', err)
                    })
                })
                .catch(err => {
                  console.log('error', err)
                })
            }
          } else {
            const ifArticle = { Article: "Yes", Error: "Title" };
            res.render("delete-redirect", ifArticle);
          }
        })
        .catch(err => {
          console.log('error', err)
        })
    })
    .catch(err => {
      console.log('error', err)
    })
})

module.exports = Router;
