"use strict";

/** Routes for companies. */

const jsonschema = require("jsonschema");
const express = require("express");

const { BadRequestError } = require("../expressError");
//const { ensureAdmin } = require("../middleware/auth");
const Move = require("../models/move");

const moveNewSchema = require("../schemas/newMove.json");
const moveUpdateSchema = require("../schemas/updateMove.json");
///const moveSearchSchema = require("../schemas/moveSearch.json");

const router = new express.Router();


router.post("/",  async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, moveNewSchema);
    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }

    const move = await Move.create(req.body);
    return res.status(201).json({ move });
  } catch (err) {
    return next(err);
  }
});

router.get("/", async function (req, res, next) {
    try {
  const q = req.query;
    const moves = await Move.findAll(q);
    return res.json({ moves });
  } catch (err) {
    return next(err);
  }
});
router.get("/:id", async function (req, res, next) {
  try {
    const move = await Move.get(req.params.id);
    return res.json({ move });
  } catch (err) {
    return next(err);
  }
});

router.patch("/:id",  async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, moveUpdateSchema);
    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }

    const move = await Move.update(req.params.id, req.body);
    return res.json({ move });
  } catch (err) {
    return next(err);
  }
});

router.delete("/:id",  async function (req, res, next) {
  try {
    await Move.remove(req.params.id);
    return res.json({ deleted: req.params.id });
  } catch (err) {
    return next(err);
  }
});


module.exports = router;