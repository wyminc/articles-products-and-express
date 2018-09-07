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
    let returnArr = this._storage.filter((article) => title == article.title);
    return returnArr.filter(article => article.delete !== true)[0];
  }

  getItemById(id) {
    let returnArr = this._storage.filter((article) => parseInt(id) === parseInt(article.id));
    return returnArr.filter(article => article.delete !== true)[0];
  }

  add(article) {
    article.id = ((this._storage).length + 1);
    article.version = 1;
    article.delete = false;
    this._storage.push(article);
    return article.title;
  }

  // updateItemByTitleBlank(title, arr) {
  //   let returnArr = this._storage.filter((article) => title === article.title);
  //   let filteredArr = returnArr.filter(article => article.delete !== true)[0];
  //   let filteredArrIndex = this._storage.indexOf(filteredArr);
  //   this._oldStorage.push(this._storage[filteredArrIndex]);
  //   this._storage[filteredArrIndex].title = arr[1];
  //   this._storage[filteredArrIndex].body = arr[3];
  //   this._storage[filteredArrIndex].author = arr[5];

  //   let filteredOldArr = this._oldStorage.filter((article) => title === article.title);
  //   let fiteredOldReverseArr = (filteredOldArr.reverse())[0];
  //   let filteredOldArrIndex = this._storage.indexOf(fiteredOldReverseArr);

  //   (this._storage[filteredArrIndex]).version = (this._oldStorage[filteredOldArrIndex]).version + 1;
  // }

  // updateItemByTitle(title, id, info) {
  //   let filteredArr = this._storage.filter((article) => filterTitle === article.title)[0];
  //   let filteredArrIndex = this._storage.indexOf(filteredArr);
  //   this._oldStorage.push(filteredArr);


  //   let filteredOldArr = this._oldStorage.filter((oldArticle) => filterTitle === oldArticle.title);
  //   let fiteredOldReverseArr = (filteredOldArr.reverse())[0];
  //   let filteredOldArrIndex = this._storage.indexOf(fiteredOldReverseArr);

  //   let newInfo = info;

  //   newInfo.delete = false;
  //   newInfo.id = id;
  //   newInfo.version = (this._oldStorage[filteredOldArrIndex]).version + 1;

  //   this._storage.splice(filteredArrIndex, 1, newInfo);
  // }

  updateItemById(id, info) {
    const filteredArr = this._storage.filter((article) => parseInt(id) === parseInt(article.id))[0];
    const filteredArrIndex = this._storage.indexOf(filteredArr);
    this._oldStorage.push(filteredArr);

    const filteredOldArr = this._oldStorage.filter((article) => parseInt(id) === parseInt(article.id));
    const filteredOldReverseArr = (filteredOldArr.reverse())[0];
    const filteredOldArrIndex = this._storage.indexOf(filteredOldReverseArr);

    let newInfo = info;

    newInfo.delete = false;
    newInfo.id = id
    newInfo.version = (this._oldStorage[filteredOldArrIndex]).version + 1;

    this._storage.splice(filteredArrIndex, 1, newInfo);
  }

  deleteItemByTitle(title) {
    let returnArr = this._storage.filter((article) => title === article.title);
    let filteredArr = returnArr.filter(article => article.delete !== true)[0];
    let filteredArrIndex = this._storage.indexOf(filteredArr);
    this._deletedStorage.splice(filteredArrIndex, 1, this._storage[filteredArrIndex]);
    (this._storage[filteredArrIndex]).delete = true;
    return this._storage.filter(article => article.delete !== true);
  }

  // getDeletedItemByTitle(title) {
  //   return this._deletedStorage.filter((article) => title === article.title)[0];
  // }

  // getPreviousItemByTitle(title, version) {
  //   let returnArr = this._oldStorage.filter((article) => title === article.title);
  //   return returnArr.filter(article => parseInt(version) === parseInt(article.version))[0];
  // }

  getDeletedItemById(id) {
    return this._deletedStorage.filter((article) => parseInt(id) === parseInt(article.id))[0];
  }

  getPreviousItemById(id, version) {
    let returnArr = this._oldStorage.filter((article) => parseInt(id) === parseInt(article.id));
    return returnArr.filter(article => parseInt(version) === parseInt(article.version))[0];
  }

  restorePreviousItemVersion(id, info) {
    const returnArr = this._storage.filter((article) => parseInt(id) === parseInt(article.id));
    const filteredArr = returnArr.filter(article => article.delete !== true)[0];
    const filteredArrIndex = this._storage.indexOf(filteredArr);

    const filteredOldArr = this._oldStorage.filter((article) => parseInt(id) === parseInt(article.id));
    const filteredOldArrValue = filteredOldArr.filter(article => parseInt(article.version) === parseInt(info.version))[0]
    const filteredOldArrIndex = this._oldStorage.indexOf(filteredOldArrValue);

    let newInfo = info;

    this._oldStorage.push(filteredArr);
    this._oldStorage.splice(filteredOldArrIndex, 1);
    this._storage.splice(filteredArrIndex, 1, newInfo);
  }

  restoreDeletedItem(id) {
    let returnArr = this._storage.filter((article) => parseInt(id) === parseInt(article.id));
    let filteredArr = returnArr.filter(article => article.delete === true)[0];
    let filteredArrIndex = this._storage.indexOf(filteredArr);
    this._storage[filteredArrIndex].delete = false;

    const filteredDelArr = this._deletedStorage.filter((article) => parseInt(id) === parseInt(article.id))[0];
    const filteredDelArrIndex = this._deletedStorage.indexOf(filteredDelArr);

    this._deletedStorage.splice(filteredDelArrIndex, 1);
  }
}


module.exports = Articles;