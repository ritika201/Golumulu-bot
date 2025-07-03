// 👉 এই ফাইলটা Golumulu BOT এর ai.js

const axios = require("axios");

module.exports = {
  name: "ai",
  async execute(api, message, args) {
    const input = args.join(" ");
    if (!input) return api.sendMessage("❓ বল তুই কী জানতে চাস?", message.threadID);

    try {
      const res = await axios.post(
        // 👉 Google Gemini API endpoint
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=AIzaSyBCYpo4bnZg0MLmDf1EULAa05xzqcGBc8k",
        {
          contents: [{ parts: [{ text: input }] }]
        },
        {
          headers: { "Content-Type": "application/json" }
        }
      );

      // ✅ রিপ্লাই আসলে ইউজারকে পাঠিয়ে দাও
      const reply = res.data.candidates?.[0]?.content?.parts?.[0]?.text || "🤖 কোনো উত্তর পাই নাই!";
      api.sendMessage(`🧠 ${reply}`, message.threadID);
    } catch (err) {
      console.error("❌ Gemini Error:", err.response?.data || err.message);
      api.sendMessage("❌ AI কিছু বলতে পারতেসে না ভাই!", message.threadID);
    }
  }
};
