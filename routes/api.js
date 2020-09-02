const express = require("express");
const router = express.Router();

const bookmarksController = require("../controllers/bookmarks");
const {
  getBookmarks,
  createBookmark,
  deleteBookmark,
  getBookmarkById,
  updateBookmark,
} = bookmarksController;

router.get("/bookmarks", getBookmarks);

router.get("/bookmark/:id", getBookmarkById);

router.post("/bookmarks", createBookmark);

router.put("/bookmarks", updateBookmark);

router.delete("/bookmarks", deleteBookmark);

module.exports = router;
