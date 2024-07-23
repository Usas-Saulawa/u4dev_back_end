const mongoose = require("mongoose")


const userSchema = new mongoose.Schema({
  fullName: String,
  email: String,
  password: String,
  language: String,
  realm: String,
  roomID: {
    type: String,
    required: true
  },
  tokens: {
    type: Number,
    default: 30,
  },
  verified: {
    type: Boolean,
    default: false
  },
  paidMember: {
    type: Boolean,
    default: false
  },
  marks: {
    type: Number,
    default: 0
  },
  notifications: {
    type: Array,
    default: []
  },
  playlist: {
    type: Array,
    default: []
  },
  createdAt: {
    type: Date,
    default: Date.now()
  },
  experience: String,
  attemptedChallenges: {
    type: Array,
    default: []
  },
  postedIssues: {
    type: Array,
    default: []
  },
  watched: {
    type: Array,
    default: []
  },
  starredIssues: {
    type: Array,
    default: []
  },
  issuesCommented: {
    type: Array,
    default: []
  },
  likedVideos: {
    type: Array,
    default: []
  },
  commentedVideos: {
    type: Array,
    default: []
  },
  goals: {
    type: Array,
    default: []
  },
  coursesBought: {
    type: Array,
    default: []
  },
  completedCourses: {
    type: Array,
    default: []
  },
  typesAccessed: {
    type: Array,
    default: []
  },
  activitySummary: {
    type: Array,
    default: []
  },
  viewedIssues: {
    type: Number,
    default: 0
  },
  referrals: {
    type: Array,
    default: []
  },
  referrer: {
    type: String,
    default: ''
  }
})

module.exports = mongoose.model('u4users', userSchema)