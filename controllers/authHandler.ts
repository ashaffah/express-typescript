import prisma from "../config/prisma";
import { Request, Response } from "express";
import createError from "http-errors";
import { signAccessToken } from "../middleware/authMiddleware";
import { encryptPassword, isPasswordMatch } from "../utils/encryption";

export const register = async (req: Request, res: Response, next: Function) => {
  try {
    const { email, username, password } = req.body;
    await prisma.user.create({
      data: {
        username: username,
        email: email,
        password: await encryptPassword(password),
      },
    });
    res.json({ msg: "Register Berhasil" });
  } catch (error) {
    if (error instanceof Error) {
      next(createError.InternalServerError());
    }
  }
};

export const login = async (req: Request, res: Response, next: Function) => {
  try {
    const { email, username, password } = req.body;

    let user;
    if (email) {
      user = await prisma.user.findFirst({
        where: {
          email: email,
        },
      });
    } else if (username) {
      user = await prisma.user.findFirst({
        where: {
          username: username,
        },
      });
    }
    if (user) {
      const match = await isPasswordMatch(password, user.password);
      if (!match) {
        res.json(createError.Unauthorized("Wrong Password"));
      }
      const userId = user.id;
      const username = user.username;
      const userEmail = user.email;
      const payloadAccess = {
        data: { userId, username, userEmail },
        tokenType: `${process.env.ACCESS_TOKEN_SECRET}`,
        expiresIn: "1d",
      };

      const accessToken = await signAccessToken(payloadAccess);

      const payloadRefresh = {
        data: { userId, username, userEmail },
        tokenType: `${process.env.REFRESH_TOKEN_SECRET}`,
        expiresIn: "1d",
      };

      const refreshToken = await signAccessToken(payloadRefresh);

      if (accessToken && refreshToken) {
        await prisma.user.update({
          where: { id: userId },
          data: {
            accessToken: accessToken,
            refreshToken: refreshToken,
          },
        });
        res.cookie("refreshToken", refreshToken, {
          httpOnly: true,
          maxAge: 24 * 60 * 60 * 1000, // umur token 24jam
          // secure: true,
        });
        res.json({ email: user.email });
      }
    }
  } catch (error) {
    if (error instanceof Error) {
      next(createError.InternalServerError());
    }
  }
};

export const logout = async (req: Request, res: Response, next: Function) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (refreshToken) {
      const user = await prisma.user.findMany({
        where: {
          refreshToken: refreshToken,
        },
      });
      if (!user) return res.sendStatus(204);
      const userId = user[0].id;
      await prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          refreshToken: null,
        },
      });
      res.clearCookie("refreshToken");
      return res.sendStatus(200);
    } else return res.sendStatus(204);
  } catch (error) {
    if (error instanceof Error) {
      next(createError.InternalServerError());
    }
  }
};
