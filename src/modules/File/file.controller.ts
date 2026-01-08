import { Request, Response } from "express";
import { prisma } from "../../lib/prisma.js";
import { customAlphabet } from "nanoid";

const generateCode = customAlphabet("0123456789", 6);
const MAX_STORAGE_BYTES = 20 * 1024 * 1024 * 1024; // ২০ জিবি (Bytes এ)

export const uploadContent = async (req: Request, res: Response) => {
  try {
    const { name, content, url, type, size, userId } = req.body;
    const fileSize = Number(size) || 0;

    // ১. স্টোরেজ চেক (যদি ইউজার লগইন করা থাকে)
    if (userId) {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { usedStorage: true }
      });

      if (user) {
        const currentUsed = Number(user.usedStorage);
        
        // ২০ জিবি ক্রস করেছে কি না চেক
        if (currentUsed + fileSize > MAX_STORAGE_BYTES) {
          return res.status(400).json({
            success: false,
            error: "Storage Full!",
            message: "আপনার ২০জিবি ফ্রি স্টোরেজ শেষ। ফাইলটি ২৪ ঘণ্টা পর মুছে যাবে।",
            warning: true
          });
        }

        // ইউজারের স্টোরেজ আপডেট করা
        await prisma.user.update({
          where: { id: userId },
          data: { usedStorage: currentUsed + fileSize }
        });
      }
    }

    // ২. ইউনিক ৬-ডিজিটের কোড জেনারেট করা
    let shareCode = generateCode();
    const existing = await prisma.file.findUnique({ where: { shareCode } });
    if (existing) shareCode = generateCode();

    // ৩. ডাটাবেসে ফাইল সেভ করা
    const newFile = await prisma.file.create({
      data: {
        name: name || "Untitled",
        content,
        url,
        type,
        size: fileSize,
        shareCode,
        userId: userId || null, // লগইন না থাকলে নাল (Guest)
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // ২৪ ঘণ্টা পর এক্সপায়ার
      },
    });

    res.status(201).json({
      success: true,
      message: "Shared successfully",
      shareCode: newFile.shareCode,
      saveOption: userId ? "Saved to account" : "Login to save permanently",
      data: newFile
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Something went wrong!" });
  }
};

// কোড দিয়ে ফাইল খুঁজে বের করা
export const getFileByCode = async (req: Request, res: Response) => {
  try {
    const { code } = req.params;
    if (!code) return res.status(400).json({ error: "কোড প্রয়োজন" });

    const file = await prisma.file.findUnique({
      where: { shareCode: code as string },
    });

    if (!file) {
      return res.status(404).json({ error: "ভুল কোড অথবা ফাইলটি মুছে ফেলা হয়েছে।" });
    }

    res.json({ success: true, data: file });
  } catch (error) {
    res.status(500).json({ error: "সার্ভার এরর।" });
  }
};