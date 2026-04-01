const corn = require("node-cron");
const stdAchievement = require("../models/studentAchievement.model");

const startCornJobs = () => {
  console.log("⏰ Cron Jobs initialized...");

  corn.schedule(
    "0 0 1 * *",
    async () => {
      try {
        console.log("⏳ [CRON JOB] Monthly Badge Reset started...");

        await stdAchievement.deleteMany({ title: { $ne: "First Step 🌟" } });
        console.log("✅ [CRON JOB] Monthly reset successful!");
      } catch (error) {
        console.error("❌ [CRON JOB] Error:", error);
      }
    },
    {
      scheduled: true,
      timezone: "Asia/Kolkata",
    },
  );
};

module.exports = startCornJobs;
