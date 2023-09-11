import { Request, Response } from "express";
import prisma from "../config/prisma";

export const createUser = async (req: Request, res: Response) => {
  try {
    await prisma.user.create({
      data: { ...req.body },
    });
    res.json({ message: "User Created!" });
  } catch (error) {
    if (error instanceof Error) {
      res.json({ message: error.message });
    } else {
      res.status(500).json({ message: "Internal server error" });
    }
  }
};

export const getUserByUsername = async (req: Request, res: Response) => {
  try {
    const { username } = req.params;
    const user = await prisma.user.findUnique({
      where: { username: String(username) },
    });
    res.json({ data: user, message: `Success get ${username} data!` });
  } catch (error) {
    if (error instanceof Error) {
      res.json({ message: error.message });
    } else {
      res.status(500).json({ message: "Internal server error" });
    }
  }
};
