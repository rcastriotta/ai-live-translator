const router = require("express").Router();
const multer = require('multer')

// setup multer to get file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, req.mediaPath)
    },
  
    // for this example we just want to use the same filename as before
    filename: (req, file, cb) => {
      cb(null, file.originalname)
    }
  })
const upload = multer({storage})


router.post('/', upload.single('mediaFile'), async (req, res, next) => {  
  try {
    const media_url = `${req.webhookBaseUrl}/media/${req.file.filename}`
    const webhook_url = `${req.webhookBaseUrl}/api/job`;
    console.log(`submit job: ${JSON.stringify({media_url, webhook_url})}`)
    
      const job = await req.asyncClient.submitJobUrl(media_url, {
        callback_url: webhook_url,
      })
      res.json(job);
  } catch(error) {
    console.dir(`Error: ${error}`)
    res.status(500).json({error})
  }
})

module.exports = router;