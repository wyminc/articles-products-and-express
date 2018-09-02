class Products {
  constructor() {
    this._storage = [];
    this._oldStorage = [];
    this._deletedStorage = [];
  }

  all() {
    return this._storage.filter(product => product.delete !== true);
  }

  old() {
    let usedStorage = [...this._oldStorage];
    usedStorage.sort(function (a, b) {
      var nameA = a.name.toUpperCase();
      var nameB = b.name.toUpperCase();
      if (nameA < nameB) {
        return -1;
      } else if (nameA > nameB) {
        return 1;
      } else {
        return 0;
      }
    })
    usedStorage.sort(function (a, b) {
      return a.version - b.version;
    })
    return usedStorage;
  }

  deleted() {
    let usedStorage = [... this._deletedStorage];
    usedStorage.sort(function (a, b) {
      var nameA = a.name.toUpperCase();
      var nameB = b.name.toUpperCase();
      if (nameA < nameB) {
        return -1;
      } else if (nameA > nameB) {
        return 1;
      } else {
        return 0;
      }
    })
    usedStorage.sort(function (a, b) {
      return a.version - b.version;
    })
    return usedStorage;
  }

  getItemById(id) {
    return this._storage.filter((product) => id == product.id)[0];
  }

  add(product) {
    product.id = ((this._storage).length + 1);
    product.version = 1;
    product.delete = false;
    this._storage.push(product);
    return product.id;
  }

  updateItemById(id, info) {
    let filteredArr = this._storage.filter((product) => parseInt(id) === product.id)[0];
    let filteredArrIndex = this._storage.indexOf(filteredArr);
    this._oldStorage.push(this._storage[filteredArrIndex]);
    this._storage.splice(filteredArrIndex, 1, info);
    (this._storage[filteredArrIndex]).version += 1;
    return this._storage.filter((product) => id == product.id)[0];
  }

  deleteItemById(id) {
    let filteredArr = this._storage.filter((product) => parseInt(id) === product.id)[0];
    let filteredArrIndex = this._storage.indexOf(filteredArr);
    this._deletedStorage.push(this._storage[filteredArrIndex]);
    (this._storage[filteredArrIndex]).delete = true;
    return this._storage.filter(product => product.delete !== true);
  }
}


module.exports = Products;