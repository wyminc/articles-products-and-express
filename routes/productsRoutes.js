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

Router.get("/products/deleted", (req, res) => {
  DB_Product.deleted()
    .then(results => {
      const products = results.rows;
      if (products.length > 0) {
        const prodObj = { Products: { products } }
        res.render("deleted-items", prodObj);
      } else {
        const ifProduct = { Product: "Yes" };
        res.render("deleted-items", ifProduct);
      }
    })
    .catch(err => {
      console.log('error', err)
    })
})

Router.get("/products/old", (req, res) => {
  DB_Product.old()
    .then(results => {
      const products = results.rows;
      const prodObj = { Products: { products } }
      if (products.length > 0) {
        res.render("previous-items", prodObj);
      } else {
        const ifProduct = { Product: "Yes" };
        res.render("previous-items", ifProduct);
      }
    })
    .catch(err => {
      console.log('error', err)
    })
})

Router.get("/products/:id/delete", (req, res) => {
  const { id } = req.params;
  DB_Product.getItemById(id)
    .then(results => {
      info = results.rows[0];
      DB_Product.insertDeletedItem(info)
        .then(results => {
          DB_Product.deleteItemById(id)
            .then(results => {
              DB_Product.all()
                .then(results => {
                  const allArr = results.rows;
                  if (allArr.length > 0) {
                    DB_Product.all()
                      .then(results => {
                        const products = results.rows;
                        const prodObj = { Products: { products } }
                        res.render("indexDeleted", prodObj);
                      })
                      .catch(err => {
                        console.log('error', err)
                      })
                  } else {
                    DB_Product.all()
                      .then(results => {
                        const products = results.rows;
                        const ifProduct = { Product: { products } };
                        res.render("indexDeleted", ifProduct);
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

Router.get("/products/:id/edit", (req, res) => {
  const { id } = req.params;
  DB_Product.getItemById(id)
    .then(results => {
      const product = results.rows[0];
      res.render("edit", { Products: product });
    })
    .catch(err => {
      console.log('error', err)
    })
})

Router.get("/products/:id", (req, res) => {
  const { id } = req.params;
  DB_Product.filterById(id)
    .then(results => {
      let filteredArr = results.rows;
      if (filteredArr.length > 0) {
        DB_Product.getItemById(id)
          .then(results => {
            const product = results.rows[0];
            res.render("product", product);
          })
          .catch(err => {
            console.log('error', err)
          })
      } else {
        DB_Product.all()
          .then(results => {
            const products = results.rows;
            const prodObj = { Products: { products } };
            if (products.length > 0) {
              res.render("index-redirect", prodObj);
            } else {
              const ifProduct = { Product: "Yes" };
              res.render("index-redirect", ifProduct);
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

Router.get("/products/deleted/:id/restore", (req, res) => {
  const { id } = req.params;
  DB_Product.getDeletedItemById(id)
    .then(results => {
      const reference_id = (results.rows[0]).reference_id;
      DB_Product.restoreDeletedItem(reference_id)
        .then(results => {
          DB_Product.deleteFromDeleted(id)
            .then(results => {
              DB_Product.all()
                .then(results => {
                  const products = results.rows;
                  const prodObj = { Products: { products } }
                  if (products.length > 0) {
                    res.render("index", prodObj);
                  } else {
                    const ifProduct = { Product: "Yes" };
                    res.render("index", ifProduct);
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

Router.get("/products/deleted/:id", (req, res) => {
  const { id } = req.params;
  DB_Product.getDeletedItemById(id)
    .then(results => {
      const product = results.rows[0];
      res.render("deletedProduct", product);
    })
    .catch(err => {
      console.log('error', err)
    })
})

Router.get("/products/old/:id/:version/restore", (req, res) => {
  const id = (req.params).id;
  const version = (req.params).version;
  DB_Product.getItemById(id)
    .then(results => {
      const info = results.rows[0];
      DB_Product.insertOldItem(info)
        .then(results => {
          DB_Product.getPreviousItemById(id, version)
            .then(results => {
              const product = results.rows[0];
              DB_Product.restorePreviousItem(id, product)
                .then(results => {
                  DB_Product.all()
                    .then(results => {
                      const products = results.rows;
                      const prodObj = { Products: { products } }
                      if (products.length > 0) {
                        res.render("index", prodObj);
                      } else {
                        const ifProduct = { Product: "Yes" };
                        res.render("index", ifProduct);
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

Router.get("/products/old/:id/:version", (req, res) => {
  const id = (req.params).id;
  const version = (req.params).version;
  DB_Product.getPreviousItemById(id, version)
    .then(results => {
      const product = results.rows[0];
      res.render("previousProduct", product);
    })
    .catch(err => {
      console.log('error', err)
    })
})

Router.get("/products/search/:name", (req, res) => {
  const { name } = req.params;
  DB_Product.filterByName(name)
    .then(results => {
      let filteredArr = results.rows;
      if (filteredArr.length > 0) {
        DB_Product.getItemByName(name)
          .then(results => {
            const product = results.rows[0];
            res.render("product", product);
          })
          .catch(err => {
            console.log('error', err)
          })
      } else {
        DB_Product.all()
          .then(results => {
            products = results.rows
            if (products.length > 0) {
              const prodObj = { Products: { products } }
              res.render("index-redirect", prodObj);
            } else {
              const ifProduct = { Product: "Yes" };
              res.render("index-redirect", ifProduct);
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

Router.get("/products", (req, res) => {
  DB_Product.all()
    .then(results => {
      const products = results.rows;
      const prodObj = { Products: { products } }
      if (products.length > 0) {
        res.render("index", prodObj);
      } else {
        const ifProduct = { Product: "Yes" };
        res.render("index", ifProduct);
      }
    })
    .catch(err => {
      console.log('error', err)
    })
})

Router.post("/products", (req, res) => {
  if (DB_Product.ifChecker(req.body) === true) {
    const submittedProduct = req.body;
    DB_Product.add(submittedProduct)
      .then(results => {
        res.redirect("/products");
      })
      .catch(err => {
        console.log('error', err)
      })
  } else {
    const ifProduct = { Product: "Yes" };
    res.render("new-redirect", ifProduct);
  }
})

Router.put("/products/:id", (req, res) => {
  if (DB_Product.ifChecker(req.body) === true) {
    const { id } = req.params;
    const submittedProduct = req.body;
    DB_Product.getItemById(id)
      .then(results => {
        info = results.rows[0];
        DB_Product.insertOldItem(info)
          .then(results => {
            DB_Product.updateItemById(id, submittedProduct)
              .then(results => {
                res.redirect(`/products/${id}`);
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
    DB_Product.getItemById(id)
      .then(results => {
        product = results.rows[0];
        const ifProduct = { Product: "Yes", Error: "Input", product };
        res.render("edit-redirect-one", ifProduct);
      })
      .catch(err => {
        console.log('error', err)
      })
  }
})

Router.delete("/products/:name", (req, res) => {
  const { name } = req.params;
  DB_Product.all()
    .then(results => {
      allArr = results.rows;
      DB_Product.filterByName(name)
        .then(results => {
          let filteredArr = results.rows;
          if (filteredArr.length > 0) {
            if (allArr.length - 1 > 0) {
              DB_Product.getItemByName(name)
                .then(results => {
                  info = results.rows[0];
                  DB_Product.insertDeletedItem(info)
                    .then(results => {
                      DB_Product.deleteItemByName(name)
                        .then(results => {
                          DB_Product.all()
                            .then(results => {
                              products = results.rows;
                              const prodObj = { Products: { products } };
                              res.render("indexDeleted", prodObj);
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
              DB_Product.getItemByName(name)
                .then(results => {
                  let info = results.rows[0];
                  DB_Product.insertDeletedItem(info)
                    .then(results => {
                      info = results.rows[0];
                      DB_Product.deleteItemByName(name)
                        .then(results => {
                          DB_Product.all()
                            .then(results => {
                              const products = results.rows;
                              const ifProduct = { Product: { products } };
                              res.render("indexDeleted", ifProduct);
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
            const ifProduct = { Product: "Yes", Error: "Name" };
            res.render("delete-redirect", ifProduct);
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