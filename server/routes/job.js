const router = require("express").Router();

router.get('/', (req, res) => {
    res.status(200).send('Get a job')
})

router.post('/', (req, res) => {
    console.log(`webhook received: ${JSON.stringify(req.body)}`)
    req.io.emit(`job`, req.body)
    res.sendStatus(200)
})

module.exports = router;
  
