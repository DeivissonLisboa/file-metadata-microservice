var express = require("express")
var cors = require("cors")
require("dotenv").config()
const multer = require("multer")
const maxFileSize = 10 * 10 ** 6 // 10 MB
const upload = multer({ dest: "uploads/", limits: { fileSize: maxFileSize } })
const fs = require("fs")
const { promisify } = require("util")
const unlinkAsync = promisify(fs.unlink)

const fileSizeLimitHandler = (err, req, res, next) => {
  if (err) {
    res.sendStatus(413)
  } else {
    next()
  }
}

var app = express()

app.use(cors())
app.use("/public", express.static(process.cwd() + "/public"))

app.get("/", function (req, res) {
  res.sendFile(process.cwd() + "/views/index.html")
})

app.post(
  "/api/fileanalyse",
  upload.single("upfile"),
  fileSizeLimitHandler,
  async (req, res) => {
    const { originalname, mimetype, size, path } = req.file

    await unlinkAsync(path)

    res.json({
      name: originalname,
      type: mimetype,
      size,
    })
  }
)

const port = process.env.PORT || 3000
app.listen(port, function () {
  console.log("Your app is listening on port " + port)
})
