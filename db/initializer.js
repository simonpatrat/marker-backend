// Set some defaults (required if your JSON file is empty)
const fs = require("fs");
const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");
const adapter = new FileSync("./db/db.json");
const db = low(adapter);
const defaultBookmarks = require("./defaultBookmarks");

const init = () => {
  if (!fs.existsSync("./db/db.json") || !db.get("bookmarks").value()) {
    console.log("📟 Initializing database...");

    db.defaults({ bookmarks: defaultBookmarks }).write();
    console.log("✅ Database initialized.");
  } else {
    console.log("✨ db already exists. Skipping initialization :)");
  }

  return db;
};

module.exports = {
  init,
};
