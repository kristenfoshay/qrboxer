"use strict";

const jsonschema = require("jsonschema");

const express = require("express");
const { BadRequestError } = require("../expressError");
const { ensureAdmin } = require("../middleware/auth");
const Item = require("../models/item");
const itemNewSchema = require("../schemas/newItem.json");
const itemUpdateSchema = require("../schemas/updateItem.json");
//const jobSearchSchema = require("../schemas/jobSearch.json");

const router = express.Router({ mergeParams: true });


router.post("/",  async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, itemNewSchema);
    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }

    const item = await Item.create(req.body);
    return res.status(201).json({ item });
  } catch (err) {
    return next(err);
  }
});


router.get("/", async function (req, res, next) {
    try {
  const q = req.query;
  
    const items = await Item.findAll(q);
    return res.json({ items });
  } catch (err) {
    return next(err);
  }
});

router.get("/:id", async function (req, res, next) {
  try {
    const item = await Item.get(req.params.id);
    return res.json({ item });
  } catch (err) {
    return next(err);
  }
});


router.patch("/:id", async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, itemUpdateSchema);
    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }

    const item = await Item.update(req.params.id, req.body);
    return res.json({ item });
  } catch (err) {
    return next(err);
  }
});


router.delete("/:id", async function (req, res, next) {
  try {
    await Item.remove(req.params.id);
    return res.json({ deleted: +req.params.id });
  } catch (err) {
    return next(err);
  }
});


module.exports = router;