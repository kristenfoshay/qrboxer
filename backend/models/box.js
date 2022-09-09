"use strict";

const db = require("../db");
const { NotFoundError} = require("../expressError");
const { sqlForPartialUpdate } = require("../helpers/sql");


class Box {

  static async create({ room, description, move }) {
    const result = await db.query(
          `INSERT INTO boxes (room,
                             description,
                             move)
           VALUES ($1, $2, $3)
           RETURNING room, description, move`,
        [
          room,
          description,
          move
        ]);
    let box = result.rows[0];

    return box;
  }

  static async findAll() {
    const boxRes = await db.query(
          `SELECT id,
                  room,
                  description,
                  move
           FROM boxes`);

    return boxRes.rows;
  }


  static async get(id) {
    const boxRes = await db.query(
          `SELECT id,
                  room,
                  description,
                  move
           FROM boxes
           WHERE id = $1`, [id]);

    const box = boxRes.rows[0];

    if (!box) throw new NotFoundError(`No box: ${id}`);

    return box;
  }

  static async update(id, data) {
    const { setCols, values } = sqlForPartialUpdate(
        data,
        {});
    const idVarIdx = "$" + (values.length + 1);

    const querySql = `UPDATE boxes 
                      SET ${setCols} 
                      WHERE id = ${idVarIdx} 
                      RETURNING id, 
                      room,
                      description,
                      move`;
    const result = await db.query(querySql, [...values, id]);
    const box = result.rows[0];

    if (!box) throw new NotFoundError(`No box: ${id}`);

    return box;
  }

  static async remove(id) {
    const result = await db.query(
          `DELETE
           FROM boxes
           WHERE id = $1
           RETURNING id`, [id]);
    const box = result.rows[0];

    if (!box) throw new NotFoundError(`No box: ${id}`);
  }
}

module.exports = Box;