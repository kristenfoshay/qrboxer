"use strict";

const db = require("../db");
const { NotFoundError } = require("../expressError");
const { sqlForPartialUpdate } = require("../helpers/sql");

class Box {

  static async create({ room, move }) {
    const result = await db.query(
      `INSERT INTO boxes (room,
                             move)
           VALUES ($1, $2 )
           RETURNING room, move`,
      [
        room,
        move
      ]);
    let box = result.rows[0];

    return box;
  }

  static async findAll() {
    const boxRes = await db.query(
      `SELECT id,
                  room,
                  move
           FROM boxes`);

    return boxRes.rows;
  }

  static async findAllbyUser({ move }) {
    const boxRes = await db.query(
      `SELECT id,
                  room,
                  move
           FROM boxes
           WHERE move = $1`, [move]);

    return boxRes.rows;
  }


  static async get(id) {
    const boxRes = await db.query(
      `SELECT id,
                  room,
                  move
           FROM boxes
           WHERE id = $1`, [id]);

    const box = boxRes.rows[0];

    if (!box) throw new NotFoundError(`No box: ${id}`);

    //     const itemsRes = await db.query(
    //       `SELECT id, image, description, box
    //        FROM items
    //        WHERE box = $1`,
    //     [box],
    // );

    // box.items = itemsRes.rows;

    return box;
  }

  static async getMoveBoxes(move) {
    const boxesRes = await db.query(
      `SELECT id,
                  room,
                  move
           FROM boxes
           WHERE move = $1`, [move]);

    const boxes = boxesRes.rows;

    if (!boxes) throw new NotFoundError(`No box: ${id}`);

    return boxes;
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