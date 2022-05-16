const router = require("express").Router();
const db = require("../db");
router.post("/start", (req, res) => {
  try {
    console.log("Opening the Stream");
    const { room } = req.body;
    const streamingClient = db.get(room);
    streamingClient.start();
    res.status(200).send("Stream Started");
  } catch (err) {
    res.status(500).end();
  }
});

router.post("/stop", (req, res) => {
  try {
    console.log("Closing the Stream");
    const { room } = req.body;
    const streamingClient = db.get(room);
    streamingClient.end();
    res.status(200).send("Stream Stopped");
  } catch (err) {
    res.status(500).end();
  }
});

module.exports = router;
