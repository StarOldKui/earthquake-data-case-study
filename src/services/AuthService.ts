import { JwtUtil } from "../utils/JwtUtil";

export class AuthService {
  constructor() {
    // Any dependencies can be injected here if needed in the future
  }

  /**
   * Authenticates the user and generates Access and Refresh Tokens.
   *
   * @param username - The username of the user.
   * @param password - The password of the user.
   * @returns An object containing Access Token and Refresh Token.
   * @throws An error if authentication fails.
   */
  authenticateUser(
    username: string,
    password: string,
  ): { accessToken: string; refreshToken: string } {
    // Replace this with actual user authentication logic, e.g., querying a database
    if (username === "litecard_admin" && password === "password") {
      const payload = { username };

      // Generate Access and Refresh Tokens
      const accessToken = JwtUtil.generateToken(payload);
      const refreshToken = JwtUtil.generateRefreshToken(payload);

      return { accessToken, refreshToken };
    } else {
      throw new Error("Invalid username or password");
    }
  }

  /**
   * Refreshes the Access Token using a valid Refresh Token.
   *
   * @param refreshToken - The Refresh Token provided by the client.
   * @returns A new Access Token.
   * @throws An error if the Refresh Token is invalid or expired.
   */
  refreshAccessToken(refreshToken: string): string {
    try {
      // Verify the Refresh Token
      const payload = JwtUtil.verifyToken(refreshToken);

      // Generate a new Access Token
      return JwtUtil.generateToken({ username: payload.username });
    } catch (error) {
      throw new Error("Invalid or expired Refresh Token");
    }
  }
}
