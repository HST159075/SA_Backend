import cron from "node-cron";
import { prisma } from "./prisma.js";

// প্রতি ১ ঘণ্টা পর পর এই ফাংশনটি চলবে
export const startCronJobs = () => {
  cron.schedule("0 * * * *", async () => {
    console.log("🧹 Checking for expired files...");
    
    try {
      const now = new Date();
      
      // যে ফাইলগুলোর expiresAt সময় পার হয়ে গেছে সেগুলো ডিলিট হবে
      const deleted = await prisma.file.deleteMany({
        where: {
          expiresAt: {
            lt: now, // lt মানে Less Than (বর্তমান সময়ের চেয়ে কম)
          },
        },
      });

      if (deleted.count > 0) {
        console.log(`✅ Deleted ${deleted.count} expired files.`);
      } else {
        console.log("📁 No expired files found.");
      }
    } catch (error) {
      console.error("❌ Error deleting expired files:", error);
    }
  });
};