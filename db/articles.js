class Articles {
  constructor() {
    this._storage = [];
  }

  all() {
    return [...this._storage];
  }

  getItemById(id) {
    return this._storage.filter((article) => id == article.id)[0];
  }

  add(article) {
    article.id = ((this._storage).length + 1);
    this._storage.push(article);
    return article.id;
  }

  updateItemById(id) { }

  deleteItemById(id) { }
}


module.exports = Articles;