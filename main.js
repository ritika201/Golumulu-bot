const fs = require("fs");
const login = require("fca-unofficial");
const config = require("./config.json");
const appstate = require(`./${config.APPSTATEPATH}`);

const PREFIX = config.PREFIX;
const BOTNAME = config.BOTNAME;
const ADMINBOT = config.ADMINBOT;

// 🔐 Facebook login using appstate.json
login({ appState: appstate }, (err, api) => {
  if (err) return console.error("🔴 Login Failed:", err);

  // ✅ Bot configuration
  api.setOptions({
    listenEvents: true,
    selfListen: false,
    logLevel: "silent",
    updatePresence: false
  });

  console.log(`✅ ${BOTNAME} is now active!`);

  // 📦 Load all commands from commands folder
  const commands = {};
  fs.readdirSync("./commands").forEach(file => {
    if (file.endsWith(".js")) {
      const cmd = require(`./commands/${file}`);
      commands[cmd.name] = cmd;
    }
  });

  // 🔁 Message listener
  api.listenMqtt((err, message) => {
    if (err || !message.body) return;

    const senderID = message.senderID;
    const body = message.body;

    if (!body.startsWith(PREFIX)) return;

    const args = body.slice(PREFIX.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    if (commands[commandName]) {
      try {
        commands[commandName].execute(api, message, args, senderID);
      } catch (err) {
        api.sendMessage("❌ Command error!", message.threadID);
        console.error(err);
      }
    }
  });
});