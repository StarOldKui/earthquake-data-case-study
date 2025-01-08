import request from "supertest";
import app from "../../src/app";
import { JwtUtil } from "../../src/utils/JwtUtil";

describe("EarthquakeDataController - listEarthquakes", () => {
  let validToken: string;

  beforeAll(() => {
    // Generate a valid JWT token for testing
    validToken = JwtUtil.generateToken({ username: "testUser" });

    console.log(`Running in ${process.env.NODE_ENV} mode`);
  });

  it("should return 200 and the list of earthquakes when query parameters are valid", async () => {
    const response = await request(app)
      .get("/earthquakes-data")
      .set("Authorization", `Bearer ${validToken}`) // Attach the token
      .query({
        pageSize: 10,
        sort: "occurrenceTimestamp",
        sortOrder: "desc",
        occurStartDate: "2025-01-01",
        occurEndDate: "2025-01-31",
      });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toHaveProperty("items");
  });

  it("should return 400 when required query parameters are missing", async () => {
    const response = await request(app)
      .get("/earthquakes-data")
      .set("Authorization", `Bearer ${validToken}`)
      .query({});

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toContain("Invalid query parameters");
  });

  it("should return 400 when invalid query parameters are provided", async () => {
    const response = await request(app)
      .get("/earthquakes-data")
      .set("Authorization", `Bearer ${validToken}`)
      .query({
        pageSize: -1, // Invalid value
        sort: "unknown", // Invalid value
        sortOrder: "desc",
      });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toContain("Invalid query parameters");
  });
});
