import { query } from "express-validator";

export class EarthquakeDataStatisticsValidation {
  /**
   * Validation rules for querying API request statistics by day
   */
  static validateGetApiRequestStatsByDayInput() {
    return [
      query("reqDate")
        .exists()
        .withMessage("reqDate is required.")
        .bail()
        .matches(/^\d{4}-\d{2}-\d{2}$/)
        .withMessage("reqDate must be in 'YYYY-MM-DD' format.")
        .bail()
        .custom((value) => {
          const reqDate = new Date(value);
          if (isNaN(reqDate.getTime())) {
            throw new Error("reqDate must be a valid date.");
          }
          return true;
        }),
    ];
  }
}
