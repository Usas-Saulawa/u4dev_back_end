require('dotenv').config()
const multer = require('multer')
const { GridFsStorage } = require('multer-gridfs-storage')
const Grid = require('gridfs-stream')
const mongoose = require('mongoose')
const crypto = require('crypto')


let conn = mongoose.createConnection(process.env.MDB_URI);
let gfs
let gridFSBucket
conn.once('open', function () {
  gfs = Grid(conn, mongoose.mongo);
  gfs.collection('uploads')
  gridFSBucket = new mongoose.mongo.GridFSBucket(conn, { bucketName: 'uploads' })
})
const storage = new GridFsStorage({
  db: conn,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }
        const filename = file.originalname.split('.')[0];
        const fileInfo = {
          filename: filename,
          bucketName: 'uploads'
        };
        resolve(fileInfo);
      });
    });
  }
})

const upload = multer({ storage })

const loadChallenge = require('../controllers/resource/challenge')
const loadIssue = require('../controllers/resource/issue')
const loadVideo = require('../controllers/resource/video')
const uploadChallenge = require('../controllers/uploads/challengeUpload')
const uploadIssue = require('../controllers/uploads/issueUpload')
const authenticate = require('../middlewares/authenticate')
const authenticateVideoUpload = require('../middlewares/authenticateVideoUpload')
const uploadVideo = require('../controllers/uploads/videoUpload')
const issueFetch = require('../controllers/resource/issueFetch')
const loadNotifications = require('../controllers/resource/notifications')
const loadMessages = require('../controllers/resource/messages')
const videoFetch = require('../controllers/resource/videoFetch')
const loadPlaylist = require('../controllers/resource/playlist')
const loadProfile = require('../controllers/resource/profile')

const Video = require("../models/video")
const uploadCourse = require('../controllers/uploads/courseUpload')
const uploadRealm = require('../controllers/uploads/realmUpload')
const loadCourses = require('../controllers/resource/course')
const loadBreak = require('../controllers/resource/courseBreak')
const authIssueAttach = require('../middlewares/authIssueAttach')
const loadPublicMessages = require('../controllers/resource/groupMessage')
const loadReferrals = require('../controllers/resource/referrals')

const router = require('express').Router()

router.post('/courses', authenticate, loadCourses)
router.post('/courses/break', authenticate, loadBreak)
router.post('/issues', authenticate, loadIssue)
router.post('/issues/:issueID', authenticate, issueFetch)
router.post('/challenges', authenticate, loadChallenge)
router.post('/video', authenticate, loadVideo)
router.post('/video/page', authenticate, videoFetch)
router.post('/notifications', authenticate, loadNotifications)
router.post('/playlist', authenticate, loadPlaylist)
router.post('/referrals', authenticate, loadReferrals)
router.post('/messages', authenticate, loadMessages)
router.post('/messages/public', authenticate, loadPublicMessages)
router.post('/user/profile', authenticate, loadProfile)



router.post('/upload/realm', authenticate, uploadRealm)
router.post('/upload/course', authenticate, uploadCourse)
router.post('/upload/issue', authenticate, uploadIssue)
router.post('/upload/challenge', authenticate, uploadChallenge)
router.post('/upload/video_data', authenticate, uploadVideo)
router.post('/upload/video_file/:reqToken', authenticateVideoUpload, upload.single('video'), (req, res) => {
  res.json({
    status: "SUCCESS",
    file: req.file
  })
})
router.post('/upload/img_file/:reqToken', authenticateVideoUpload, upload.single('image'), (req, res) => {
  res.json({
    status: "SUCCESS",
    file: req.file
  })
})
router.post('/upload/issue/attachment/:reqToken', authIssueAttach, upload.single('image'), (req, res) => {
  res.sendStatus(201)
})
router.get('/image/:imageName', (req, res) => {
  const { imageName } = req.params
  gfs.files.findOne({ filename: imageName }, (err, file) => {
    if (!file) {
      res.json({
        status: "FAILED",
        message: "Something went wrong"
      })
      return
    }
    const readStream = gridFSBucket.openDownloadStream(file._id)
    readStream.pipe(res)
  })
})
router.get('/video/:videoName/:domain', async (req, res, next) => {
  const { videoName, domain } = req.params
  try {
    const result = await Video.find({ videoName, domain })
    if (result.length > 0) {
      const { videoName } = result[0]
      req.params.videoName = videoName
      next()
    } else {
      res.sendStatus(404)
    }

  } catch (error) {

  }
}, (req, res) => {
  const { videoName } = req.params
  gfs.files.findOne({ filename: videoName }, (err, file) => {
    if (!file) {
      res.json({
        status: "FAILED",
        message: "Something went wrong"
      })
      return
    }
    const readStream = gridFSBucket.openDownloadStream(file._id)
    readStream.pipe(res)
  })
})
router.get('/video/:videoName/:reqToken', authenticateVideoUpload, (req, res) => {
  const { videoName } = req.params
  gfs.files.findOne({ filename: videoName }, (err, file) => {
    if (!file) {
      res.json({
        status: "FAILED",
        message: "Something went wrong"
      })
      return
    }
    const readStream = gridFSBucket.openDownloadStream(file._id)
    readStream.pipe(res)
  })
})

module.exports = router