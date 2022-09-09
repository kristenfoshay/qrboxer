const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../config");

/** return signed JWT from user data. */

function createToken(user) {
  console.assert(user.admin !== undefined,
      "createToken passed user without admin property");

  let payload = {
    username: user.username,
    admin: user.admin || false,
  };

  return jwt.sign(payload, SECRET_KEY);
}

module.exports = { createToken };