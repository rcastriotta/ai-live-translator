const router = require("express").Router();
const {CaptionType} = require('revai-node-sdk')

router.get('/:jobId', async (req, res) => {
    try {
        const {jobId} = req.params
        let output = '';
        await req.asyncClient.getCaptions(jobId, CaptionType.VTT)
        .then(response => {
          const stream = response
          stream.on('data', chunk => {
            output += chunk
          })
    
          stream.on('end', () => {
            console.log(output);
            res.send(output)
          })
        })
      } catch(err) {
        console.error(err.message)
        res.sendStatus(500)
      }
})

module.exports = router;
  
