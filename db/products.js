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
      return a.id - b.id;
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
    let returnArr = this._storage.filter((product) => parseInt(id) === parseInt(product.id));
    return returnArr.filter(product => product.delete !== true)[0];
  }

  getItemByName(name) {
    return this._storage.filter((product) => name === product.name)[0];
  }

  add(product) {
    product.id = ((this._storage).length + 1);
    product.version = 1;
    product.delete = false;
    this._storage.push(product);
    return product.id;
  }

  // updateItemByNameBlank(name, arr) {
  //   let returnArr = this._storage.filter((product) => name === product.name);
  //   let filteredArr = returnArr.filter(product => product.delete !== true)[0];
  //   let filteredArrIndex = this._storage.indexOf(filteredArr);
  //   this._oldStorage.push(this._storage[filteredArrIndex]);
  //   this._storage[filteredArrIndex].name = arr[1];
  //   this._storage[filteredArrIndex].price = arr[3];
  //   this._storage[filteredArrIndex].inventory = arr[5];

  //   let filteredOldArr = this._oldStorage.filter((product) => name === product.name);
  //   let fiteredOldReverseArr = (filteredOldArr.reverse())[0];
  //   let filteredOldArrIndex = this._storage.indexOf(fiteredOldReverseArr);

  //   (this._storage[filteredArrIndex]).version = (this._oldStorage[filteredOldArrIndex]).version + 1;
  // }

  updateItemById(id, info) {
    const filteredArr = this._storage.filter((product) => parseInt(id) === parseInt(product.id))[0];
    const filteredArrIndex = this._storage.indexOf(filteredArr);
    this._oldStorage.push(filteredArr);

    const filteredOldArr = this._oldStorage.filter((product) => parseInt(id) === parseInt(product.id));
    const filteredOldReverseArr = (filteredOldArr.reverse())[0];
    const filteredOldArrIndex = this._storage.indexOf(filteredOldReverseArr);

    let newInfo = info;

    newInfo.delete = false;
    newInfo.id = id
    newInfo.version = (this._oldStorage[filteredOldArrIndex]).version + 1;

    this._storage.splice(filteredArrIndex, 1, newInfo);
  }

  deleteItemById(id) {
    let filteredArr = this._storage.filter((product) => parseInt(id) === parseInt(product.id))[0];
    let filteredArrIndex = this._storage.indexOf(filteredArr);
    this._deletedStorage.push(this._storage[filteredArrIndex]);
    (this._storage[filteredArrIndex]).delete = true;
    return this._storage.filter(product => product.delete !== true);
  }

  deleteItemByName(name) {
    let returnArr = this._storage.filter((product) => name === product.name);
    let filteredArr = returnArr.filter(product => product.delete !== true)[0];
    let filteredArrIndex = this._storage.indexOf(filteredArr);
    this._deletedStorage.splice(filteredArrIndex, 1, this._storage[filteredArrIndex]);
    (this._storage[filteredArrIndex]).delete = true;
    return this._storage.filter(product => product.delete !== true);
  }

  getDeletedItemById(id) {
    return this._deletedStorage.filter((product) => parseInt(id) === parseInt(product.id))[0];
  }

  getPreviousItemById(id, version) {
    let returnArr = this._oldStorage.filter((product) => parseInt(id) === parseInt(product.id));
    return returnArr.filter(product => parseInt(version) === parseInt(product.version))[0];
  }

  restorePreviousItemVersion(id, info) {
    const returnArr = this._storage.filter((product) => parseInt(id) === parseInt(product.id));
    const filteredArr = returnArr.filter(product => product.delete !== true)[0];
    const filteredArrIndex = this._storage.indexOf(filteredArr);

    const filteredOldArr = this._oldStorage.filter((product) => parseInt(id) === parseInt(product.id));
    const filteredOldArrValue = filteredOldArr.filter(product => parseInt(product.version) === parseInt(info.version))[0]
    const filteredOldArrIndex = this._oldStorage.indexOf(filteredOldArrValue);

    let newInfo = info;

    this._oldStorage.push(filteredArr);
    this._oldStorage.splice(filteredOldArrIndex, 1);
    this._storage.splice(filteredArrIndex, 1, newInfo);
  }

  restoreDeletedItem(id) {
    let returnArr = this._storage.filter((product) => parseInt(id) === parseInt(product.id));
    let filteredArr = returnArr.filter(product => product.delete === true)[0];
    let filteredArrIndex = this._storage.indexOf(filteredArr);
    this._storage[filteredArrIndex].delete = false;

    const filteredDelArr = this._deletedStorage.filter((product) => parseInt(id) === parseInt(product.id))[0];
    const filteredDelArrIndex = this._deletedStorage.indexOf(filteredDelArr);

    this._deletedStorage.splice(filteredDelArrIndex, 1);
  }
}


module.exports = Products;