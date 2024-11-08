// tests/jest.setup.js 

// Sample schema for validation tests
const boxNewSchema = {
  type: "object",
  properties: {
    name: { type: "string" },
    description: { type: "string" },
    location: { type: "string" }
  },
  required: ["name", "location"],
  additionalProperties: false
};

const boxUpdateSchema = {
  type: "object",
  properties: {
    name: { type: "string" },
    description: { type: "string" },
    location: { type: "string" }
  },
  additionalProperties: false
};

// Export schemas if needed in tests
module.exports = {
  boxNewSchema,
  boxUpdateSchema
};
