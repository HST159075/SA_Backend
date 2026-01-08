import { Request, Response } from "express";
import { prisma } from "../../lib/prisma.js";

export const getSystemStats = async (req: Request, res: Response) => {
  try {
    // মোট ইউজার, মোট ফাইল এবং মোট কতটুকু স্টোরেজ ব্যবহৃত হয়েছে তার হিসাব
    const userCount = await prisma.user.count();
    const fileCount = await prisma.file.count();
    const totalSize = await prisma.file.aggregate({
      _sum: { size: true }
    });

    res.json({
      success: true,
      stats: {
        totalUsers: userCount,
        totalFiles: fileCount,
        totalStorageUsed: totalSize._sum.size || 0
      }
    });
  } catch (error) {
    res.status(500).json({ error: "সিস্টেম স্ট্যাটাস লোড করতে সমস্যা হয়েছে।" });
  }
};

export const getAllFiles = async (req: Request, res: Response) => {
  try {
    // সব ফাইল একসাথে দেখা (সর্বশেষ আপলোড আগে আসবে)
    const files = await prisma.file.findMany({
      orderBy: { createdAt: 'desc' },
      include: { user: { select: { name: true, email: true } } } // ইউজারের নামসহ দেখাবে
    });
    res.json({ success: true, files });
  } catch (error) {
    res.status(500).json({ error: "ফাইলগুলো পাওয়া যায়নি।" });
  }
};