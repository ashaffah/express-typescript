import { Request, Response } from "express";
import prisma from "../config/prisma";

export const examplePost = async (req: Request, res: Response) => {
  try {
    const { content, authorEmail } = req.body;
    await prisma.post.create({
      data: {
        content,
        author: { connect: { email: authorEmail } },
      },
    });
    res.json({ message: "Data Created!" });
  } catch (error) {
    if (error instanceof Error) {
      res.json({ message: error.message });
    }
  }
};

export const exampleGetAll = async (req: Request, res: Response) => {
  try {
    const { _page, _limit, _sort, _order } = req.query;
    const limit = +(_limit ?? 20); // per_page
    const offset = (+(_page ?? 1) - 1) * limit; // offset
    const sort = (_sort ?? "id").toString(); // column
    const order = _order ?? "asc"; // asc atau desc

    const orderBy = { [sort]: order };
    const postCount = await prisma.post.count();
    const posts = await prisma.post.findMany({
      orderBy,
      skip: offset,
      take: limit,
      include: { author: true },
    });
    res.setHeader("Content-Type", "application/json");
    res.setHeader("x-total-count", postCount);
    res.json({
      data: posts,
      per_page: limit,
      page: +(_page ?? 1),
      total_data: postCount,
      message: "Success get all data!",
    });
  } catch (error) {
    if (error instanceof Error) {
      res.json({ message: error.message });
    }
  }
};

export const exampleGetById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const post = await prisma.post.findUnique({
      where: { id: Number(id) },
    });
    if (post === null) {
      res.json({
        data: post,
        message: "Cannot find data!",
      });
    } else {
      res.json({
        data: post,
        message: "Success get data!",
      });
    }
  } catch (error) {
    if (error instanceof Error) {
      res.json({ message: error.message });
    }
  }
};

export const exampleUpdate = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const post = await prisma.post.update({
      where: { id: Number(id) },
      data: {
        ...req.body,
      },
    });
    res.json({ data: post, message: "Data Updated!" });
  } catch (error) {
    if (error instanceof Error) {
      res.json({ message: error.message });
    }
  }
};

export const exampleDelete = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.post.delete({
      where: { id: Number(id) },
    });
    res.json({ message: "Success deleted data!" });
  } catch (error) {
    if (error instanceof Error) {
      res.json({ message: error.message });
    }
  }
};
