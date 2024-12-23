"use strict";

const jsonschema = require("jsonschema");
const express = require("express");
const { BadRequestError, NotFoundError } = require("../expressError");
//const { ensureAdmin } = require("../middleware/auth");
const Box = require("../models/box");
const boxNewSchema = require("../schemas/newBox.json");
const boxUpdateSchema = require("../schemas/updateBox.json");
const Item = require("../models/item");
const router = express.Router({ mergeParams: true });

router.post("/", async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, boxNewSchema);
    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }

    const box = await Box.create(req.body);
    return res.status(201).json({ box });
  } catch (err) {
    return next(err);
  }
});

router.get("/", async function (req, res, next) {
  try {
    const q = req.query;
    const boxes = await Box.findAll(q);
    return res.json({ boxes });
  } catch (err) {
    return next(err);
  }
});

router.get("/:id", async function (req, res, next) {
  try {
    const box = await Box.get(req.params.id);
    if (!box) throw new NotFoundError(`No box: ${req.params.id}`);
    return res.json({ box });
  } catch (err) {
    return next(err);
  }
});

router.get("/:id/items", async function (req, res, next) {
  try {
    const box = await Box.get(req.params.id);
    if (!box) throw new NotFoundError(`No box: ${req.params.id}`);
    const items = await Item.getitemsbyBox(req.params.id);
    return res.json({ items });
  } catch (err) {
    return next(err);
  }
});

router.patch("/:id", async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, boxUpdateSchema);
    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }

    const existingBox = await Box.get(req.params.id);
    if (!existingBox) throw new NotFoundError(`No box: ${req.params.id}`);

    const box = await Box.update(req.params.id, req.body);
    return res.json({ box });
  } catch (err) {
    return next(err);
  }
});

router.delete("/:id", async function (req, res, next) {
  try {
    const existingBox = await Box.get(req.params.id);
    if (!existingBox) throw new NotFoundError(`No box: ${req.params.id}`);
    
    await Box.remove(req.params.id);
    await Item.boxremoveitem(req.params.id);
    return res.json({ deleted: +req.params.id });
  } catch (err) {
    return next(err);
  }
});  

module.exports = router;
