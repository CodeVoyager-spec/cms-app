const { ZodError } = require("zod");

/**
 * Zod validation middleware
 * Validates body, params, and query using a Zod schema
 */
const validate = (schema) => (req, res, next) => {
  try {
    // Validate the request
    schema.parse({
      body: req.body,
      params: req.params,
      query: req.query,
    });

    // Validation passed → continue
    next();
  } catch (err) {
    if (err instanceof ZodError) {
      // Map Zod issues to field + message
      const errors = err.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      }));

      // Send response directly
      return res.status(400).json({
        status: "fail",
        message: "Validation failed",
        errors,
      });
    }

    // If some other error, pass to next
    next(err);
  }
};

module.exports = validate;
