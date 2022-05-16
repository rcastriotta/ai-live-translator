const router = require("express").Router();
const db = require("../db");
const StreamingClient = require("../lib/StreamingClient");

const makeId = (length) => {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

router.post("/create", (req, res) => {
  const room = makeId(6);
  console.log(room);
  db.set(
    room,
    new StreamingClient(process.env.REVAI_ACCESS_TOKEN, req.io, room)
  );
  res.status(200).send(room);
});

module.exports = router;
