import { Request, Response } from "express";
import prisma from "../config/prisma";

// Create Data
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
    } else {
      res.status(500).json({ message: "Internal server error" });
    }
  }
};

// Get All Data
export const exampleGetAll = async (req: Request, res: Response) => {
  try {
    const { _page, _limit, _sort, _order } = req.query;
    const limit = +(_limit ?? 20); // per_page
    const offset = (+(_page ?? 1) - 1) * limit; // offset
    const sort = (_sort ?? "id").toString(); // column
    const order = _order ?? "asc"; // asc atau desc

    const orderBy = { [sort]: order };
    const postCount = await prisma.post.count({
      where: { deletedAt: null },
    });
    const posts = await prisma.post.findMany({
      where: { deletedAt: null },
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
    } else {
      res.status(500).json({ message: "Internal server error" });
    }
  }
};

// Get Data By Id
export const exampleGetById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const post = await prisma.post.findUnique({
      where: { id: Number(id), deletedAt: null },
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
    } else {
      res.status(500).json({ message: "Internal server error" });
    }
  }
};

// Update Data By Id
export const exampleUpdate = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const post = await prisma.post.update({
      where: { id: Number(id), deletedAt: null },
      data: {
        ...req.body,
      },
    });
    res.json({ data: post, message: "Data Updated!" });
  } catch (error) {
    if (error instanceof Error) {
      res.status(404).json({ message: "Id tidak ditemukan!" });
    } else {
      res.status(500).json({ message: "Internal server error" });
    }
  }
};

// Hard Delete Data
export const exampleDelete = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.post.delete({
      where: { id: Number(id) },
    });
    res.json({ message: "Success deleted data!" });
  } catch (error) {
    if (error instanceof Error) {
      res.status(404).json({ message: "Id tidak ditemukan!" });
    } else {
      res.status(500).json({ message: "Internal server error" });
    }
  }
};

// Soft Delete Data
export const exampleSoftDelete = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const now = new Date();

    await prisma.post.update({
      where: { id: Number(id), deletedAt: null },
      data: { deletedAt: now },
    });

    res.json({ message: "Success soft deleted data!" });
  } catch (error) {
    if (error instanceof Error) {
      res.status(404).json({ message: "Id tidak ditemukan!" });
    } else {
      res.status(500).json({ message: "Internal server error" });
    }
  }
};

// Restore All Data
export const exampleRestoreAllSoftDelete = async (
  req: Request,
  res: Response
) => {
  try {
    await prisma.post.updateMany({
      where: { deletedAt: { not: null } }, // this is for multiple condition
      data: { deletedAt: null },
    });
    res.json({ message: "All Data Restored!" });
  } catch (error) {
    if (error instanceof Error) {
      res.status(404).json({ message: "Tidak Ada data!" });
    } else {
      res.status(500).json({ message: "Internal server error" });
    }
  }
};

// Restore Data By Id
export const exampleRestoreSoftDelete = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.post.update({
      // where: { id: Number(id), deletedAt: { not: null } }, // You can use this also!
      where: { id: Number(id), NOT: [{ deletedAt: null }] }, // this is for multiple condition
      data: { deletedAt: null },
    });
    res.json({ message: "Data Restored!" });
  } catch (error) {
    if (error instanceof Error) {
      res.status(404).json({ message: "Id tidak ditemukan!" });
    } else {
      res.status(500).json({ message: "Internal server error" });
    }
  }
};

// Get All Soft Deleted
export const exampleGetAllSoftDelete = async (req: Request, res: Response) => {
  try {
    const { _page, _limit, _sort, _order } = req.query;
    const limit = +(_limit ?? 20); // per_page
    const offset = (+(_page ?? 1) - 1) * limit; // offset
    const sort = (_sort ?? "id").toString(); // column
    const order = _order ?? "asc"; // asc atau desc

    const orderBy = { [sort]: order };
    const postCount = await prisma.post.count({
      where: { deletedAt: { not: null } },
    });
    const posts = await prisma.post.findMany({
      // where: { deletedAt: { not: null } }, // You can use this also!
      where: { NOT: [{ deletedAt: null }] },
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
    } else {
      res.status(500).json({ message: "Internal server error" });
    }
  }
};

// Get Soft Deleted By Id
export const exampleGetDeletedById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const post = await prisma.post.findUnique({
      where: { id: Number(id), deletedAt: { not: null } },
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
    } else {
      res.status(500).json({ message: "Internal server error" });
    }
  }
};
