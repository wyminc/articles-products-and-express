class Articles {
  constructor() {
    this.knex = require('../knex/knex.js');
  }

  ifChecker(requestBody) {
    if (isNaN(((requestBody).title)) === true) {
      if (isNaN(((requestBody).body)) === true) {
        if (isNaN(((requestBody).author)) === true) {
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

  filter(title) {
    return this.knex.raw(`SELECT * FROM articles WHERE title = '${title}'`);
  }

  all() {
    return this.knex.raw('SELECT * FROM articles WHERE is_deleted = false ORDER BY id');
  }

  old() {
    return this.knex.raw('SELECT * FROM old_articles ORDER BY reference_id, title, version')
  }

  deleted() {
    return this.knex.raw('SELECT * FROM deleted_articles ORDER BY reference_id, title, version')
  }

  getItemByTitle(title) {
    return this.knex.raw(`SELECT id, title, body, author, version, is_deleted, TO_CHAR(created_at, 'YYYY-MM-DD HH24:MI:SS') AS created_at, TO_CHAR(updated_at,'YYYY-MM-DD HH24:MI:SS') AS updated_at  FROM articles WHERE title = '${title}' and is_deleted = false`);
  }

  getItemById(id) {
    return this.knex.raw(`SELECT id, title, body, author, version, is_deleted, TO_CHAR(created_at, 'YYYY-MM-DD HH24:MI:SS') AS created_at, TO_CHAR(updated_at,'YYYY-MM-DD HH24:MI:SS') AS updated_at  FROM articles WHERE id = '${id}' and is_deleted = false`);
  }

  add(article) {
    return this.knex.raw(`INSERT INTO articles (title, body, author) VALUES ('${article.title}','${article.body}', '${article.author}')`)
  }

  updateItemById(id, info) {
    return this.knex.raw(`UPDATE articles SET title = '${info.title}', body = '${info.body}', author = '${info.author}', version = version + 1, updated_at = now() WHERE id = '${id}'`);
  }

  insertOldItem(info) {
    return this.knex.raw(`INSERT INTO old_articles (reference_id, title, body, author, version, is_deleted, reference_created_at, reference_updated_at) VALUES ('${info.id}', '${info.title}', '${info.body}', '${info.author}', '${info.version}', '${info.is_deleted}', TO_TIMESTAMP('${info.created_at}', 'YYYY-MM-DD HH24:MI:SS'), TO_TIMESTAMP('${info.updated_at}', 'YYYY-MM-DD HH24:MI:SS'))`);
  }

  deleteItemByTitle(title) {
    return this.knex.raw(`UPDATE articles SET is_deleted = true WHERE title = '${title}'`);
  }

  insertDeletedItem(info) {
    return this.knex.raw(`INSERT INTO deleted_articles (reference_id, title, body, author, version, reference_created_at, reference_updated_at) VALUES ('${info.id}', '${info.title}', '${info.body}', '${info.author}', '${info.version}', TO_TIMESTAMP('${info.created_at}', 'YYYY-MM-DD HH24:MI:SS'), TO_TIMESTAMP('${info.updated_at}', 'YYYY-MM-DD HH24:MI:SS'))`);
  }

  getDeletedItemById(id) {
    return this.knex.raw(`SELECT id, reference_id, title, body, author, version, TO_CHAR(reference_created_at, 'YYYY-MM-DD HH24:MI:SS') AS reference_created_at, TO_CHAR(reference_updated_at,'YYYY-MM-DD HH24:MI:SS') AS reference_updated_at, created_at, updated_at  FROM deleted_articles WHERE id = '${id}'`)
  }

  getPreviousItemById(id, version) {
    return this.knex.raw(`SELECT id, reference_id, title, body, author, version, is_deleted, TO_CHAR(reference_created_at, 'YYYY-MM-DD HH24:MI:SS') AS reference_created_at, TO_CHAR(reference_updated_at,'YYYY-MM-DD HH24:MI:SS') AS reference_updated_at, created_at, updated_at  FROM old_articles WHERE id = '${id}' and version = '${version}'`)
  }

  restorePreviousItem(id, info) {
    return this.knex.raw(`UPDATE articles SET id = '${info.reference_id}', title = '${info.title}', body = '${info.body}', author = '${info.author}', version = '${info.version}', is_deleted = ${info.is_deleted}, created_at = TO_TIMESTAMP('${info.reference_created_at}', 'YYYY-MM-DD HH24:MI:SS'), updated_at = TO_TIMESTAMP('${info.reference_updated_at}', 'YYYY-MM-DD HH24:MI:SS') WHERE id = '${info.reference_id}'`);
  }

  restoreDeletedItem(id) {
    return this.knex.raw(`UPDATE articles SET is_deleted = false WHERE id = '${id}'`);
  }

  deleteFromOld(id) {
    return this.knex.raw(`DELETE FROM old_articles where id = '${id}'`)
  }

  deleteFromDeleted(id) {
    return this.knex.raw(`DELETE FROM deleted_articles where id = '${id}'`)
  }
}


module.exports = Articles;