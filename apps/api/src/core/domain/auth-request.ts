import { Request } from 'express';

interface UserPayload {
  userId: string;
  sub: string;
  iat: number;
  exp: number;
}

export interface AuthRequest extends Request {
  user?: UserPayload;
}
