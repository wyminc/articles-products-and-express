const express = require("express");
const methodOverride = require("method-override")
const app = express();
const bp = require("body-parser");
const exphbs = require("express-handlebars");

const productsRoutes = require('./routes/productsRoutes.js');
const articlesRoutes = require('./routes/articlesRoutes.js');

const PORT = process.env.PORT;

app.use(methodOverride("_method"))

app.use(express.static("public"));

app.use(bp.urlencoded({ extended: true }));
app.engine(".hbs", exphbs({ defaultLayout: "layout", extname: ".hbs" }));
app.set("view engine", ".hbs");

app.get("/", (req, res) => {
  res.render("home");
})

app.use('/', productsRoutes);
app.use('/', articlesRoutes);


app.listen(PORT, () => {
  console.log(`Started app on port: ${PORT}`);
});