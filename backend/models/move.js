"use strict";

const db = require("../db");
const { BadRequestError, NotFoundError } = require("../expressError");
const { sqlForPartialUpdate } = require("../helpers/sql");


class Move {


  //ADD BACK Foreign Key but remove it from schema...

  static async create({ id, location, month, year, username}) {
    const duplicateCheck = await db.query(
          `SELECT id
           FROM moves
           WHERE id = $1`,
        [id]);

    if (duplicateCheck.rows[0])
      throw new BadRequestError(`Duplicate move: ${id}`);

    const result = await db.query(
          `INSERT INTO moves
           (location, month, year, username)
           VALUES ($1, $2, $3, $4)
           RETURNING location, month, year, username`,
        [
          location,
          month,
          year,
          username
        ],
    );
    const move = result.rows[0];

    return move;
  }

  static async get(id) {
    const moveRes = await db.query(
          `SELECT id,
                  location,
                  month,
                  year,
                  username
           FROM moves
           WHERE id = $1`,
        [id]);

    const move = moveRes.rows[0];

    if (!move) throw new NotFoundError(`No company: ${id}`);

    const boxesRes = await db.query(
          `SELECT id, room, description, move
           FROM boxes
           WHERE move = $1
           ORDER BY id`,
        [id],
    );

    move.boxes = boxesRes.rows;

    return move;
  }

  static async update(id, data) {
    const { setCols, values } = sqlForPartialUpdate(
        data,
        {});
    const idVarIdx = "$" + (values.length + 1);

    const querySql = `UPDATE moves 
                      SET ${setCols} 
                      WHERE id = ${idVarIdx} 
                      RETURNING id, 
                      location,
                      month,
                      year,
                      username`;
    const result = await db.query(querySql, [...values, id]);
    const move = result.rows[0];

    if (!move) throw new NotFoundError(`No move: ${id}`);

    return move;
  }

  static async findAll() {
    const moveRes = await db.query(
          `SELECT id,
                  location,
                  month,
                  year,
                  username
           FROM moves`);

    return moveRes.rows;
  }

  static async remove(id) {
    const result = await db.query(
          `DELETE
           FROM moves
           WHERE id = $1
           RETURNING id`,
        [id]);
    const move = result.rows[0];

    if (!move) throw new NotFoundError(`No move: ${id}`);
  }
}


module.exports = Move;