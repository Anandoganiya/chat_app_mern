import jwt from "jsonwebtoken";

class JwtGenerator {
  async createJwt(id: string) {
    const token = jwt.sign(id, String(process.env.SECRET_TOKEN));
    return token;
  }

  async verifyToken(token: string) {
    const id = jwt.verify(token, String(process.env.SECRET_TOKEN));
    return id;
  }
}

export const jwtGenerator = new JwtGenerator();
