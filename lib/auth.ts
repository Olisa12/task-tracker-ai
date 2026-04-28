import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'demo-secret-key';

export function verifyToken(token: string): { userId: string } | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    return decoded;
  } catch {
    return null;
  }
}