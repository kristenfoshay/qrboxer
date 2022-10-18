"use strict";

const db = require("../db");
const { BadRequestError, NotFoundError } = require("../expressError");
const { sqlForPartialUpdate } = require("../helpers/sql");


class Move {

  static async create({ location, date, username }) {
    const duplicateCheck = await db.query(
      `SELECT date
           FROM moves
           WHERE date = $1`,
      [date]);

    if (duplicateCheck.rows[0])
      throw new BadRequestError(`Duplicate move: ${date}`);

    const result = await db.query(
      `INSERT INTO moves
           (location, date, username)
           VALUES ($1, $2, $3)
           RETURNING location, date, username`,
      [
        location,
        date,
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
                  date,
                  username
           FROM moves
           WHERE id = $1`,
      [id]);

    const move = moveRes.rows[0];

    if (!move) throw new NotFoundError(`No Move: ${id}`);

    // const boxesRes = await db.query(
    //       `SELECT id, room, move
    //        FROM boxes
    //        WHERE move = $1`,
    //     [move],
    // );

    // move.boxes = boxesRes.rows;

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
                      date,
                      username`;
    const result = await db.query(querySql, [...values, id]);
    const move = result.rows[0];

    if (!move) throw new NotFoundError(`No move: ${id}`);

    return move;
  }

  static async findAll(username) {
    const moveRes = await db.query(
      `SELECT id,
                  location,
                  date,
                  username
           FROM moves
           WHERE username = $1`,
      [username]);

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