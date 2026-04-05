// utils/validation.js
const Joi = require("joi");

// 🔐 Register validation
const registerSchema = Joi.object({
  name: Joi.string().min(3).max(30).required(),

  email: Joi.string()
    .email()
    .required(),

  password: Joi.string()
    .min(6)
    .required()
});

// 🔑 Login validation
const loginSchema = Joi.object({
  email: Joi.string()
    .email()
    .required(),

  password: Joi.string()
    .required()
});

module.exports = {
  registerSchema,
  loginSchema
};