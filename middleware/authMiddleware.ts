import { Request, Response } from "express";
import jwt, { Secret, JwtPayload } from "jsonwebtoken";
import createError from "http-errors";

export type CustomRequest = Request & {
  email: string | JwtPayload;
};

export const SECRET_KEY: Secret = `${process.env.ACCESS_TOKEN_SECRET}`;

export const signAccessToken = (payload: any) => {
  return new Promise((resolve, reject) => {
    jwt.sign(
      payload.data,
      payload.tokenType,
      { expiresIn: payload.expiresIn },
      (err: any, token: any) => {
        if (err) {
          reject(createError.InternalServerError());
        }
        resolve(token);
      }
    );
  });
};

export const verifyToken = (req: Request, res: Response, next: Function) => {
  const authHeader = req.headers.authorization; //req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!authHeader) {
    return next(createError.Unauthorized("Access token is required"));
  }
  if (!token) return next(createError.Unauthorized()); //res.sendStatus(401);
  jwt.verify(token, SECRET_KEY, (err: any, decoded: any) => {
    if (err) return next(createError.Forbidden()); //res.sendStatus(403);
    (req as CustomRequest).email = decoded.email;
    next();
  });
};
