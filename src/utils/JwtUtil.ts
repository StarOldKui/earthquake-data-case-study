import jwt from "jsonwebtoken";
import { AppConfig } from "../config/appConfig";

export class JwtUtil {
  /**
   * Generates a JWT token for the given payload.
   *
   * @param payload - The payload to encode into the token.
   * @returns The generated JWT token.
   */
  static generateToken(payload: Record<string, any>): string {
    return jwt.sign(payload, AppConfig.JWT.Secret, {
      expiresIn: AppConfig.JWT.ExpiresIn, // Access Token expiration time
    });
  }

  /**
   * Generates a Refresh Token for the given payload.
   *
   * @param payload - The payload to encode into the refresh token.
   * @returns The generated Refresh Token.
   */
  static generateRefreshToken(payload: Record<string, any>): string {
    return jwt.sign(payload, AppConfig.JWT.Secret, {
      expiresIn: AppConfig.JWT.RefreshTokenExpiresIn, // Refresh Token expiration time
    });
  }

  /**
   * Verifies a JWT token and returns the decoded payload.
   *
   * @param token - The token to verify.
   * @returns The decoded payload.
   * @throws An error if the token is invalid or expired.
   */
  static verifyToken(token: string): Record<string, any> {
    return jwt.verify(token, AppConfig.JWT.Secret) as Record<string, any>;
  }
}
