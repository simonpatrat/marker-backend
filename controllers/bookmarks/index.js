const low = require("lowdb");
const FileAsync = require("lowdb/adapters/FileAsync");
const adapter = new FileAsync("./db/db.json");

const { v4: uuidv4 } = require("uuid");

let numberOfElementsPerPage = 5;
let selectedPage = 1;

async function queryBookmarksFormDb(req, res, next) {
  const { perPage = numberOfElementsPerPage, page = selectedPage } = req.query;

  const db = await low(adapter);
  let bookmarksPages = await db
    .get("bookmarks")
    .orderBy("dateBookmarked", "desc")
    .chunk(parseInt(perPage, 10))
    .value();

  const numberOfPages = bookmarksPages.length;

  if (numberOfPages === 0) {
    return {
      error: true,
      message: "There is no bookmark recorded for the moment",
      requestedPage: parseInt(page, 10),
    };
  }
  if (page > numberOfPages) {
    return {
      error: true,
      message: "The requested page does not exist",
      requestedPage: parseInt(page, 10),
    };
  }
  const chunkIndex = parseInt(page, 10) - 1;

  return {
    error: false,
    bookmarks: bookmarksPages[chunkIndex],
    pagination: {
      pages: numberOfPages,
      currentPage: parseInt(page, 10),
      perPage: parseInt(perPage, 10),
    },
  };
}

exports.getBookmarks = async function (req, res, next) {
  const response = await queryBookmarksFormDb(req, res, next);
  res.json(response);
};

exports.getBookmarkById = async function (req, res, next) {
  const db = await low(adapter);
  const { params } = req;
  const { id } = params;

  const bookmark = await db.get("bookmarks").find({ id }).value();
  res.json({ error: false, bookmark });
};

exports.createBookmark = async function (req, res, next) {
  const { body: requestBookmark } = req;
  const db = await low(adapter);

  const alreadyExists = await db
    .get("bookmarks")
    .value()
    .some((bookmark) => {
      return bookmark.informations.url === requestBookmark.informations.url;
    });

  if (alreadyExists) {
    res.json({
      error: true,
      message:
        "Bookmark already exist with this url : " +
        requestBookmark.informations.url,
    });
  } else {
    const newBookmark = {
      id: uuidv4(),
      ...requestBookmark,
    };

    await db.get("bookmarks").push(newBookmark).write();
    const updatedBookmarks = await queryBookmarksFormDb(req, res, next);
    res.json({
      error: false,
      updatedBookmark: newBookmark,
      ...updatedBookmarks,
    });
  }
};

exports.updateBookmark = async function (req, res, next) {
  const { body: bookmark } = req;
  console.log("id ====> ", bookmark.id);
  const db = await low(adapter);
  try {
    db.get("bookmarks")
      .find({ id: bookmark.id })
      .assign({
        keywords: bookmark.keywords,
        dateBookmarked: bookmark.dateBookmarked,
      })
      .write();
    const updatedBookmarks = await queryBookmarksFormDb(req, res, next);
    res.json({
      error: false,
      ...updatedBookmarks,
    });
  } catch (error) {
    res.json({
      error: true,
      message: `Error Updating bookmark : ${error}`,
    });
  }
};

exports.deleteBookmark = async function (req, res, next) {
  const { body } = req;
  const { id } = body;
  const db = await low(adapter);
  await db.get("bookmarks").remove({ id }).write();

  const updatedBookmarks = await queryBookmarksFormDb(req, res, next);

  res.json({
    error: false,
    ...updatedBookmarks,
  });
};
