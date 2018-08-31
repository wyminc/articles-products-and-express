class Products {
  constructor() {
    this._storage = [];
  }

  all() {
    return [...this._storage];
  }

  getItemById(id) {
    return this._storage.filter((product) => id == product.id)[0];
  }

  add(product) {
    product.id = ((this._storage).length + 1);
    this._storage.push(product);
    return product.id;
  }

  updateItemById(id) {
    filteredArrIndex = this._storage.filter((product) => id == product.id)[0];

  }

  deleteItemById(id) { }
}


module.exports = Products;