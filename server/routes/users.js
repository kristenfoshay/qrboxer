"use strict";
const jsonschema = require("jsonschema");
const express = require("express");
const { BadRequestError } = require("../expressError");
const User = require("../models/user");
const { createToken } = require("../helpers/tokens");
const userNewSchema = require("../schemas/userRegister.json");
const userUpdateSchema = require("../schemas/userUpdate.json");
const router = express.Router();

// Custom validation function for email
function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

router.post("/", async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, userNewSchema);
    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }
    const user = await User.register(req.body);
    const token = createToken(user);
    return res.status(201).json({ 
      user: {
        username: user.username,
        email: user.email
      }, 
      token 
    });
  } catch (err) {
    return next(err);
  }
});

router.get("/", async function (req, res, next) {
  try {
    const users = await User.findAll();
    return res.json({ users });
  } catch (err) {
    return next(err);
  }
});

router.get("/:username", async function (req, res, next) {
  try {
    const user = await User.get(req.params.username);
    return res.json({ user });
  } catch (err) {
    return res.status(404).json({ error: "User not found" });
  }
});

router.patch("/:username", async function (req, res, next) {
  try {
    // Check if request body is empty
    if (Object.keys(req.body).length === 0) {
      return res.status(400).json({ error: "No update data provided" });
    }

    // Validate email if present
    if (req.body.email && !validateEmail(req.body.email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    const validator = jsonschema.validate(req.body, userUpdateSchema);
    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }
    
    const user = await User.update(req.params.username, req.body);
    return res.json({ user });
  } catch (err) {
    // If User update fails (likely due to non-existent user)
    return res.status(404).json({ error: "User not found" });
  }
});

router.delete("/:username", async function (req, res, next) {
  try {
    await User.remove(req.params.username);
    return res.json({ deleted: req.params.username });
  } catch (err) {
    return res.status(404).json({ error: "User not found" });
  }
});

module.exports = router;
