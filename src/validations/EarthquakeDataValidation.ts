import { query } from "express-validator";

export class EarthquakeDataValidation {
  /**
   * Validates query parameters for listing earthquakes.
   */
  static validatelistEarthquakesInput() {
    return [
      query("pageSize")
        .isInt({ min: 1, max: 100 })
        .withMessage(
          "pageSize must be a positive integer and no more than 100.",
        ),
      query("sort")
        .isString()
        .isIn(["occurrenceTimestamp", "magnitude"])
        .withMessage(
          "sort must be either 'occurrenceTimestamp' or 'magnitude'.",
        ),
      query("sortOrder")
        .isString()
        .isIn(["asc", "desc"])
        .withMessage("sortOrder must be either 'asc' or 'desc'."),
      query("occurStartDate")
        .optional()
        .matches(/^\d{4}-\d{2}-\d{2}$/)
        .withMessage(
          "occurStartDate must be in the format 'YYYY-MM-DD' (e.g., 2025-01-01).",
        )
        .bail() // Stop further validations if format is incorrect
        .custom((value, { req }) => {
          if (!req.query) {
            throw new Error("Query parameters are missing.");
          }
          const startDate = new Date(value);
          if (isNaN(startDate.getTime())) {
            throw new Error("occurStartDate must be a valid date.");
          }
          if (req.query.occurEndDate) {
            const endDate = new Date(req.query.occurEndDate);
            if (!isNaN(endDate.getTime()) && startDate > endDate) {
              throw new Error(
                "occurStartDate must not be later than occurEndDate.",
              );
            }
          }
          return true;
        }),
      query("occurEndDate")
        .optional()
        .matches(/^\d{4}-\d{2}-\d{2}$/)
        .withMessage(
          "occurEndDate must be in the format 'YYYY-MM-DD' (e.g., 2025-01-31).",
        )
        .bail()
        .custom((value, { req }) => {
          if (!req.query) {
            throw new Error("Query parameters are missing.");
          }
          const endDate = new Date(value);
          if (isNaN(endDate.getTime())) {
            throw new Error("occurEndDate must be a valid date.");
          }
          if (req.query.occurStartDate) {
            const startDate = new Date(req.query.occurStartDate);
            if (!isNaN(startDate.getTime()) && endDate < startDate) {
              throw new Error(
                "occurEndDate must not be earlier than occurStartDate.",
              );
            }
          }
          return true;
        }),
      query("location")
        .optional()
        .isString()
        .withMessage("location must be a string."),
      query("minMagnitude")
        .optional()
        .isFloat({ min: 0 })
        .withMessage("minMagnitude must be a non-negative number."),
      query("maxMagnitude")
        .optional()
        .isFloat({ min: 0 })
        .withMessage("maxMagnitude must be a non-negative number.")
        .bail()
        .custom((value, { req }) => {
          if (!req.query) {
            throw new Error("Query parameters are missing.");
          }
          if (
            req.query.minMagnitude &&
            parseFloat(value) < parseFloat(req.query.minMagnitude)
          ) {
            throw new Error("maxMagnitude must not be less than minMagnitude.");
          }
          return true;
        }),
    ];
  }
}
