import { Request, Response } from "express";
import { prisma } from "../../lib/prisma.js";

// ১. নতুন ইউজার রেজিস্ট্রেশন
export const registerUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;
    
    const user = await prisma.user.create({
      data: { name, email, password }
    });
    
    res.status(201).json({ success: true, user });
  } catch (error) {
    // ইমেইল ইউনিক না হলে বা অন্য কোনো সমস্যা হলে
    res.status(400).json({ error: "ইমেইলটি অলরেডি ব্যবহার করা হয়েছে।" });
  }
};

// ২. লগইন করা ইউজার তার সব শেয়ার করা ফাইলের লিস্ট দেখতে পারবে
export const getMyUploads = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    // টাইপস্ক্রিপ্ট এরর এড়াতে চেক করে নিচ্ছি userId আছে কি না
    if (!userId) {
      return res.status(400).json({ success: false, error: "ইউজার আইডি প্রয়োজন।" });
    }

    const uploads = await prisma.file.findMany({
      where: {
        userId: userId as string // টাইপ কাস্টিং করে টাইপস্ক্রিপ্টকে নিশ্চিত করা হলো
      },
      orderBy: { 
        createdAt: 'desc' 
      }
    });

    res.json({ success: true, uploads });
  } catch (error) {
    res.status(500).json({ success: false, error: "ডাটা পাওয়া যায়নি।" });
  }
};