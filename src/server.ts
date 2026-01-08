import app from "./app.js"; // .js extension দিতে ভুলবেন না
import { prisma } from "./lib/prisma.js";
import { startCronJobs } from "./lib/cron.js";

const PORT = process.env.PORT || 5000;

async function main() {
    try {
        // ১. ডাটাবেস কানেক্ট করা
        await prisma.$connect();
        console.log(" Database connected successfully.");
        startCronJobs();
        console.log(" Auto-cleanup cron job is active.");
        app.listen(PORT, () => {
            console.log(` Server is running at http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error("❌ Failed to start server:", error);
        await prisma.$disconnect();
        process.exit(1);
    }
}

main();