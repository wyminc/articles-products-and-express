class Products {
  constructor() {
    this.knex = require('../knex/knex.js');
    this._storage = [];
    this._oldStorage = [];
    this._deletedStorage = [];
  }

  ifChecker(requestBody) {
    if (isNaN(((requestBody).name)) === true) {
      if (isNaN(((requestBody).price)) === false) {
        if (isNaN(((requestBody).inventory)) === false) {
          return true;
        } else {
          return false
        }
      } else {
        return false
      }
    } else {
      return false
    }
  }

  filterById(id) {
    return this.knex.raw(`SELECT * FROM products WHERE id = '${id}'`);
  }

  filterByName(name) {
    return this.knex.raw(`SELECT * FROM products WHERE name = '${name}'`);
  }

  all() {
    return this.knex.raw('SELECT * FROM products WHERE is_deleted = false ORDER BY id');
  }

  old() {
    return this.knex.raw('SELECT * FROM old_products ORDER BY reference_id, name, version')
  }


  deleted() {
    return this.knex.raw('SELECT * FROM deleted_products ORDER BY reference_id, name, version')
  }

  getItemByName(name) {
    return this.knex.raw(`SELECT id, name, price, inventory, version, is_deleted, TO_CHAR(created_at, 'YYYY-MM-DD HH24:MI:SS') AS created_at, TO_CHAR(updated_at,'YYYY-MM-DD HH24:MI:SS') AS updated_at  FROM products WHERE name = '${name}' and is_deleted = false`);
  }

  getItemById(id) {
    return this.knex.raw(`SELECT id, name, price, inventory, version, is_deleted, TO_CHAR(created_at, 'YYYY-MM-DD HH24:MI:SS') AS created_at, TO_CHAR(updated_at,'YYYY-MM-DD HH24:MI:SS') AS updated_at  FROM products WHERE id = '${id}' and is_deleted = false`);
  }

  add(product) {
    return this.knex.raw(`INSERT INTO products (name, price, inventory) VALUES ('${product.name}','${product.price}', '${product.inventory}')`)
  }

  updateItemById(id, info) {
    return this.knex.raw(`UPDATE products SET name = '${info.name}', price = '${info.price}', inventory = '${info.inventory}', version = version + 1, updated_at = now() WHERE id = '${id}'`);
  }

  insertOldItem(info) {
    return this.knex.raw(`INSERT INTO old_products (reference_id, name, price, inventory, version, is_deleted, reference_created_at, reference_updated_at) VALUES ('${info.id}', '${info.name}', '${info.price}', '${info.inventory}', '${info.version}', '${info.is_deleted}', TO_TIMESTAMP('${info.created_at}', 'YYYY-MM-DD HH24:MI:SS'), TO_TIMESTAMP('${info.updated_at}', 'YYYY-MM-DD HH24:MI:SS'))`);
  }

  deleteItemById(id) {
    return this.knex.raw(`UPDATE products SET is_deleted = true WHERE id = '${id}'`);
  }

  insertDeletedItem(info) {
    return this.knex.raw(`INSERT INTO deleted_products (reference_id, name, price, inventory, version, reference_created_at, reference_updated_at) VALUES ('${info.id}', '${info.name}', '${info.price}', '${info.inventory}', '${info.version}', TO_TIMESTAMP('${info.created_at}', 'YYYY-MM-DD HH24:MI:SS'), TO_TIMESTAMP('${info.updated_at}', 'YYYY-MM-DD HH24:MI:SS'))`);
  }

  deleteItemByName(name) {
    return this.knex.raw(`UPDATE products SET is_deleted = true WHERE name = '${name}'`);
  }

  getDeletedItemById(id) {
    return this.knex.raw(`SELECT id, reference_id, name, price, inventory, version, TO_CHAR(reference_created_at, 'YYYY-MM-DD HH24:MI:SS') AS reference_created_at, TO_CHAR(reference_updated_at,'YYYY-MM-DD HH24:MI:SS') AS reference_updated_at, created_at, updated_at  FROM deleted_products WHERE id = '${id}'`)
  }

  getPreviousItemById(id, version) {
    return this.knex.raw(`SELECT id, reference_id, name, price, inventory, version, is_deleted, TO_CHAR(reference_created_at, 'YYYY-MM-DD HH24:MI:SS') AS reference_created_at, TO_CHAR(reference_updated_at,'YYYY-MM-DD HH24:MI:SS') AS reference_updated_at, created_at, updated_at  FROM old_products WHERE id = '${id}' and version = '${version}'`)
  }

  restorePreviousItem(id, info) {
    return this.knex.raw(`UPDATE products SET id = '${info.reference_id}', name = '${info.name}', price = '${info.price}', inventory = '${info.inventory}', version = '${info.version}', is_deleted = ${info.is_deleted}, created_at = TO_TIMESTAMP('${info.reference_created_at}', 'YYYY-MM-DD HH24:MI:SS'), updated_at = TO_TIMESTAMP('${info.reference_updated_at}', 'YYYY-MM-DD HH24:MI:SS') WHERE id = '${info.reference_id}'`);
  }

  restoreDeletedItem(id) {
    return this.knex.raw(`UPDATE products SET is_deleted = false WHERE id = '${id}'`);
  }

  deleteFromOld(id) {
    return this.knex.raw(`DELETE FROM old_products where id = '${id}'`)
  }

  deleteFromDeleted(id) {
    return this.knex.raw(`DELETE FROM deleted_products where id = '${id}'`)
  }
}


module.exports = Products;