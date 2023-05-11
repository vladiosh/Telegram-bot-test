const TelegramApi = require("node-telegram-bot-api");
const { gameOptions, againOptions } = require("./options");

const token = "6233616927:AAF577tL2NE8Srz37DZdGtGUYiQSK2dO-oI";

const bot = new TelegramApi(token, { polling: true });

const chats = {};

bot.setMyCommands([
  {
    command: "/start",
    description: "Стартове привітання",
  },
  {
    command: "/info",
    description: "Інформація про користувача",
  },
  {
    command: "/game",
    description: "Вгадай число",
  },
]);

const startGame = async (chatId) => {
  await bot.sendMessage(chatId, `Вгадай від 0 до 9`);
  const randomNumber = Math.floor(Math.random() * 10);
  chats[chatId] = randomNumber;
  await bot.sendMessage(chatId, "Вгадай", gameOptions);
};

const start = () => {
  bot.on("message", async (msg) => {
    const text = msg.text;
    const chatId = msg.chat.id;

    if (text === "/start") {
      await bot.sendSticker(
        chatId,
        "https://tlgrm.eu/_/stickers/252/513/252513f1-3065-48aa-8480-6e7533469808/192/41.webp"
      );
      return bot.sendMessage(chatId, `Шалом`);
    }

    if (text === "/info") {
      return bot.sendMessage(chatId, `Тебе звуть ${msg.from.first_name}`);
    }

    if (text === "/game") {
      return startGame(chatId);
    }

    return bot.sendMessage(chatId, "ти хто?");
  });
};

bot.on("callback_query", async (msg) => {
  const data = msg.data;
  const chatId = msg.message.chat.id;

  if (data === "/again") {
    return startGame(chatId);
  }

  if (data === chats[chatId]) {
    await bot.sendMessage(
      chatId,
      `✔Ти вгадав цифру ${chats[chatId]}`,
      againOptions
    );
  } else {
    await bot.sendMessage(
      chatId,
      `❌Не вгадав, бот загадав цифру ${chats[chatId]}`,
      againOptions
    );
  }
});

start();
