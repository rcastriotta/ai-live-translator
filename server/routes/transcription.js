const router = require("express").Router();

router.get('/:jobId/:format', async (req, res) => {
    try {
        const {jobId, format} = req.params
    
        if(format.toLowerCase() === 'json') {
          const transcript = await req.asyncClient.getTranscriptObject(jobId)
          res.json(transcript)
          return
        }
    
        if(format.toLowerCase() === 'text') {
          const transcript = await req.asyncClient.getTranscriptText(jobId)
          res.send(transcript)
          return
        }
        res.statusCode(500).send(`Invalid format ${format}`)
      } catch(err) {
        console.err(err.message)
        res.sendStatus(500)
      }
})

router.post('/', (req, res) => {
    req.io.emit(`transcript`, req.body)
    res.sendStatus(200)
})

module.exports = router;