"use strict";

const { db } = require('../config/db');
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
       RETURNING id, location, date, username`,
      [location, date, username],
    );
    const move = result.rows[0];
    move.boxes = [];

    return move;
  }

  static async get(id) {
    const moveRes = await db.query(
      `SELECT m.id,
              m.location,
              m.date,
              m.username,
              COALESCE(
                json_agg(
                  json_build_object(
                    'id', b.id,
                    'name', b.name,
                    'room', b.room,
                    'move', b.move
                  )
                ) FILTER (WHERE b.id IS NOT NULL),
                '[]'
              ) as boxes
       FROM moves m
       LEFT JOIN boxes b ON m.id = b.move
       WHERE m.id = $1
       GROUP BY m.id, m.location, m.date, m.username`,
      [id]);

    const move = moveRes.rows[0];

    if (!move) throw new NotFoundError(`No Move: ${id}`);

    return move;
  }

  static async update(id, data) {
    const { setCols, values } = sqlForPartialUpdate(
      data,
      {});
    const idVarIdx = "$" + (values.length + 1);

    const querySql = `
      WITH updated_move AS (
        UPDATE moves 
        SET ${setCols} 
        WHERE id = ${idVarIdx} 
        RETURNING id, location, date, username
      )
      SELECT m.*,
             COALESCE(
               json_agg(
                 json_build_object(
                   'id', b.id,
                   'name', b.name,
                   'room', b.room,
                   'move', b.move
                 )
               ) FILTER (WHERE b.id IS NOT NULL),
               '[]'
             ) as boxes
      FROM updated_move m
      LEFT JOIN boxes b ON m.id = b.move
      GROUP BY m.id, m.location, m.date, m.username`;

    const result = await db.query(querySql, [...values, id]);
    const move = result.rows[0];

    if (!move) throw new NotFoundError(`No move: ${id}`);

    return move;
  }

  static async findAll(username) {
    const moveRes = await db.query(
      `SELECT m.id,
              m.location,
              m.date,
              m.username,
              COALESCE(
                json_agg(
                  json_build_object(
                    'id', b.id,
                    'name', b.name,
                    'room', b.room,
                    'move', b.move
                  )
                ) FILTER (WHERE b.id IS NOT NULL),
                '[]'
              ) as boxes
       FROM moves m
       LEFT JOIN boxes b ON m.id = b.move
       WHERE m.username = $1
       GROUP BY m.id, m.location, m.date, m.username
       ORDER BY m.date`,
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
