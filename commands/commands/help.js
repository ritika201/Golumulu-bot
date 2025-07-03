module.exports = {
  name: "help",
  execute(api, message, args) {
    api.sendMessage(
      `🧠 ${args[0] || "Golumulu BOT"} Commands:\n\n/pakhi - Moyna test\n/help - Show this list\n/ai <question> - Ask AI`,
      message.threadID
    );
  }
};
