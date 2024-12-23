"use strict";

const jsonschema = require("jsonschema");
const express = require("express");
const { BadRequestError } = require("../expressError");
const Item = require("../models/item");
const itemNewSchema = require("../schemas/newItem.json");
const itemUpdateSchema = require("../schemas/updateItem.json");

// Remove mergeParams option as it's not needed here
const router = express.Router();

router.post("/", async function (req, res, next) {
  console.log("POST /items hit with body:", req.body); // Add logging
  try {
    const validator = jsonschema.validate(req.body, itemNewSchema);
    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }

    const item = await Item.create(req.body);
    return res.status(201).json({ item });
  } catch (err) {
    console.error("POST /items error:", err); // Add error logging
    return next(err);
  }
});

router.get("/", async function (req, res, next) {
  console.log("GET /items hit with query:", req.query); // Add logging
  try {
    const items = await Item.findAll(req.query);
    return res.json({ items });
  } catch (err) {
    console.error("GET /items error:", err); // Add error logging
    return next(err);
  }
});

router.get("/:id", async function (req, res, next) {
  console.log("GET /items/:id hit with id:", req.params.id); // Add logging
  try {
    const item = await Item.get(req.params.id);
    return res.json({ item });
  } catch (err) {
    console.error("GET /items/:id error:", err); // Add error logging
    return next(err);
  }
});

router.patch("/:id", async function (req, res, next) {
  console.log("PATCH /items/:id hit with id:", req.params.id, "body:", req.body); // Add logging
  try {
    const validator = jsonschema.validate(req.body, itemUpdateSchema);
    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }

    const item = await Item.update(req.params.id, req.body);
    return res.json({ item });
  } catch (err) {
    console.error("PATCH /items/:id error:", err); // Add error logging
    return next(err);
  }
});

router.delete("/:id", async function (req, res, next) {
  console.log("DELETE /items/:id hit with id:", req.params.id); // Add logging
  try {
    await Item.remove(req.params.id);
    return res.json({ deleted: +req.params.id });
  } catch (err) {
    console.error("DELETE /items/:id error:", err); // Add error logging
    return next(err);
  }
});

module.exports = router;
