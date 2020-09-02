// Set some defaults (required if your JSON file is empty)
const fs = require("fs");
const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");
const adapter = new FileSync("./db/db.json");
const db = low(adapter);

const init = () => {
  if (!fs.existsSync("./db/db.json") || !db.get("bookmarks").value()) {
    console.log("📟 Initializing database...");

    db.defaults({
      bookmarks: [
        {
          id: "123abcd",
          type: "image",
          informations: {
            url: "https://flic.kr/p/2jAzJP2",
            title: "No title",
            author: "Moataz Al-Sharif",
            dateAdded: "1598541413",
            height: 2048,
            width: 1567,
          },
        },
      ],
    }).write();
    console.log("✅ Database initialized.");
  } else {
    console.log("✨ db already exists. Skipping initialization :)");
  }

  return db;
};

module.exports = {
  init,
};
