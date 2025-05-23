const aws = require('aws-sdk')

const router = require('express').Router()
const multer = require('multer')
const multerS3 = require('multer-s3')
require('dotenv').config('')

aws.config.update({
  secretAccessKey: 'S/NDFbpsTJJ3WasWYN01Xt1AYKZgKmrAWQsRzQ5A',
  accessKeyId: 'AKIA3NG4YPZ5DCQDXZ5U',
  region: 'us-east-1'
})

s3 = new aws.S3()

var upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: 'jefferys-s3',
    acl: 'public-read',
    ContentType: function (req, file, cb) {
      cb(null, file.mimetype)
    },
    key: function (req, file, cb) {
      const randomNumber = Math.floor(Math.random() * 1000000) // Generate a random number between 0 and 999999
      const extension = file.originalname.split('.').pop() // Get the file extension
      const fileName = `JC${randomNumber}.${extension}`
      cb(null, fileName) //use Date.now() for unique file keys
    }
  }),
  fileFilter: function (req, file, cb) {
    if (
      file.mimetype.startsWith('image/') ||
      file.mimetype === 'application/pdf' ||
      file.mimetype.startsWith('video/')
    ) {
      cb(null, true)
    } else {
      cb(
        new Error(
          'Invalid file type. Only image, PDF, and video files are allowed.'
        )
      )
    }
  }
})

module.exports = { upload, s3 }
