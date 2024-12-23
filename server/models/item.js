"use strict";

const db = require('../config/db');
const { NotFoundError } = require("../expressError");
const { sqlForPartialUpdate } = require("../helpers/sql");

class Item {

  static async create({ description, image, box }) {
    const result = await db.query(
      `INSERT INTO items (description,
                             image, box)
           VALUES ($1, $2, $3)
           RETURNING description, image, box`,
      [
        description,
        image,
        box
      ]);
    let item = result.rows[0];

    return item;
  }

  static async findAll() {
    const itemRes = await db.query(
      `SELECT id,
                  description,
                  image,
                  box
           FROM items`);

    return itemRes.rows;
  }

  static async get(id) {
    const itemRes = await db.query(
      `SELECT id,
                  description,
                  image,
                  box
           FROM items
           WHERE id = $1`, [id]);

    const item = itemRes.rows[0];

    if (!item) throw new NotFoundError(`No item: ${id}`);

    return item;
  }

  static async getitemsbyBox(box) {
    const itemRes = await db.query(
      `SELECT id,
                  description,
                  image,
                  box
           FROM items
           WHERE box = $1`, [box]);

    const items = itemRes.rows;

    if (!items) throw new NotFoundError(`No box: ${box}`);

    return items;
  }

  static async update(id, data) {
    const { setCols, values } = sqlForPartialUpdate(
      data,
      {});
    const idVarIdx = "$" + (values.length + 1);

    const querySql = `UPDATE items 
                      SET ${setCols} 
                      WHERE id = ${idVarIdx} 
                      RETURNING id, 
                      description,
                      image,
                      box`;
    const result = await db.query(querySql, [...values, id]);
    const item = result.rows[0];

    if (!item) throw new NotFoundError(`No item: ${id}`);

    return item;
  }

  static async remove(id) {
    const result = await db.query(
      `DELETE
           FROM items
           WHERE id = $1
           RETURNING id`, [id]);
    const item = result.rows[0];

    if (!item) throw new NotFoundError(`No item: ${id}`);
  }

  static async boxremoveitem(box) {
    const result = await db.query(
      `DELETE
           FROM items
           WHERE box = $1`, [box]);
    const res = result.rows;

    if (!box) throw new NotFoundError(`No Box: ${box}`);
  }
}


module.exports = Item;
