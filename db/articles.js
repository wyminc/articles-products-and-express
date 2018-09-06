class Articles {
  constructor() {
    this._storage = [];
    this._oldStorage = [];
    this._deletedStorage = [];
  }

  all() {
    return this._storage.filter(article => article.delete !== true);
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

  getItemByTitle(title) {
    return this._storage.filter((article) => title == article.title)[0];
  }

  add(article) {
    article.version = 1;
    article.delete = false;
    this._storage.push(article);
    return article.title;
  }

  updateItemByTitleBlank(title, arr) {
    let filteredArr = this._storage.filter((article) => title === article.title)[0];
    let filteredArrIndex = this._storage.indexOf(filteredArr);
    this._oldStorage.push(this._storage[filteredArrIndex]);
    this._storage[filteredArrIndex].title = arr[1];
    this._storage[filteredArrIndex].body = arr[3];
    this._storage[filteredArrIndex].author = arr[5];
    (this._storage[filteredArrIndex]).version += 1;
    return this._storage.filter((article) => title == article.title)[0];
  }

  updateItemByTitle(title, info) {
    let filteredArr = this._storage.filter((article) => title === article.title)[0];
    let filteredArrIndex = this._storage.indexOf(filteredArr);
    this._oldStorage.push(this._storage[filteredArrIndex]);
    this._storage[filteredArrIndex].title = info.title;
    this._storage[filteredArrIndex].body = info.body;
    this._storage[filteredArrIndex].author = info.author;
    (this._storage[filteredArrIndex]).version += 1;
    return this._storage.filter((article) => title == article.title)[0];
  }

  deleteItemByTitle(title) {
    let filteredArr = this._storage.filter((article) => title === article.title)[0];
    let filteredArrIndex = this._storage.indexOf(filteredArr);
    this._deletedStorage.push(this._storage[filteredArrIndex]);
    (this._storage[filteredArrIndex]).delete = true;
    return this._storage.filter(article => article.delete !== true);
  }
}


module.exports = Articles;