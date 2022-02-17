var express = require("express");
var router = express.Router();
var auth = require("../middlewares/auth");

var Snippets = require("../models/SnippetsV1");
var User = require("../models/UserV2");

router.get("/", async (req, res, next) => {
  var query = req.query.search ? req.query.search : null;
  var limit = req.query.limit ? req.query.limit : 10;
  var offset = req.query.offset ? req.query.offset : 0;
  try {
    if (query) {
      let snippets = await Snippets.find({
        $or: [{ title: { $regex: query } }, { tags: { $regex: query } }],
      })
        .limit(limit)
        .skip(offset);
      console.log(snippets);
      return res.json({ snippets, snippetsCount: snippets.length });
    } else {
      let snippets = await Snippets.find({}).limit(limit).skip(offset);
      console.log(snippets);
      return res.json({ snippets, snippetsCount: snippets.length });
    }
  } catch (error) {
    next(error);
  }
});

router.post("/:id/bookmark", auth.verifyToken, async (req, res, next) => {
  const snippetId = req.params.id;
  console.log(req.user, "user");
  const user = await User.findById(req.user.id);
  try {
    const snippet = await Snippets.findById(snippetId);
    console.log(snippet, "snippet info");

    let currentUser = await User.findByIdAndUpdate(
      req.user.id,
      { $addToSet: { bookmark: snippet.id } } ,
      { new: true }
    );
    res.json({ user: await user.userJSON(currentUser.token) });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
