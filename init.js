const fs = require("fs");

const { init: initDatabase } = require("./db/initializer");

const initAppWithDefaults = () => {
  initDatabase();
};

module.exports = initAppWithDefaults;
