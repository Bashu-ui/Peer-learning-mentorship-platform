const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const cors = require('cors')
const helmet = require('helmet')
const rateLimit = require('express-rate-limit')
const compression = require('compression')
const morgan = require('morgan')
const path = require('path')
const fileUpload = require('express-fileupload')

// Routes
const addAssignmentRouter = require('./routes/Teacher/assignment')
const peerActivityRouter = require('./routes/Teacher/peerActivity')
const peerAssignmentRouter = require('./routes/Teacher/peerAssignment')
const getAssignmentRouter = require('./routes/Student/getAssignment')
const assignReviewersRouter = require('./routes/Teacher/assignReviewers')
const reviewerAssignmentsRouter = require('./routes/Student/reviewerAssignments')
const reviewAssignmentRouter = require('./routes/Student/reviewAssignment')
const activitiesRouter = require('./routes/Teacher/activities')
const getIssuesRouter = require('./routes/Teacher/getIssues')
const addIssueRouter = require('./routes/Student/addIssue')
const closeAssignmentRouter = require('./routes/Teacher/closeAssignment')
const downloadRouter = require('./routes/Teacher/download')
const getLogsRouter = require('./routes/Teacher/getlogs')
const getReviewsRouter = require('./routes/Student/getReviews')
const deleteAssignmentRouter = require('./routes/Teacher/deleteAssignment')
const addAssignmentScoreRouter = require('./routes/Teacher/add_assignment_score')
const getAssignmentScoreRouter = require('./routes/Teacher/getAssignmentScore')
const plotRouter = require('./routes/Analytics/Routes')
const config = require('./config')

require('dotenv').config()

// Database connection with improved error handling
mongoose.connect(config.db.DB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB Atlas!'))
.catch((err) => console.error('MongoDB connection error:', err));

const app = express()

// Security middleware
app.use(helmet())
app.use(compression())

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
})
app.use(limiter)

// Logging
if (config.app.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}

// Body parsing
app.use(bodyParser.json({ limit: config.limits.maxRequestSize }))
app.use(bodyParser.urlencoded({ extended: true, limit: config.limits.maxRequestSize }))

// File upload
app.use(fileUpload({
  limits: { fileSize: config.limits.maxFileSize },
  useTempFiles: true,
  tempFileDir: path.join(__dirname, 'temp'),
  createParentPath: true
}))

// CORS
app.use(cors())

// Routes
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Peer Learning API',
    status: 'healthy',
    timestamp: new Date().toISOString()
  })
})

// API Routes
app.use('/api/assignment', getAssignmentRouter) //get all peer assignments on given course_id
app.use('/api/assignment', addAssignmentRouter) //add peer learning on an assignment
app.use('/api/peeractivity', peerActivityRouter) //(OPTIONAL route) get list of all assigned assignments(activities) on given peer_assignment_id
app.use('/api/peer', peerAssignmentRouter) //get detailed information on that peer assignment
app.use('/api/assignreviewers', assignReviewersRouter) // start peer learning on an assignment
app.use('/api/reviewerassignments', reviewerAssignmentsRouter) // get all peer activities assigned to a reviewer for given course_work_id
app.use('/api/reviewassignment', reviewAssignmentRouter) // add review of the reviewer on the given peer_activity_id
app.use('/api/activities', activitiesRouter) // get list of all assigned assignments(activities) on given course_work_id
app.use('/api/issues', getIssuesRouter) // get all issues on given peer_assignment_id
app.use('/api/issue', addIssueRouter) // add new issue to the respective peer_activity_id
app.use('/api/closeassignment', closeAssignmentRouter) // change status of the peer assignment to 'Grading'
app.use('/api/download', downloadRouter) // download score sheet (for Teachers)
app.use('/api/logs', getLogsRouter) // download logs
app.use('/api/reviews', getReviewsRouter) // get all reviews on the student dashboard
app.use('/api/deleteassignment', deleteAssignmentRouter) // delete given peer_assignment_id
app.use('/api/addassignmentscore', addAssignmentScoreRouter) // add assignment score for giver user_id
app.use('/api/assignmentscore', getAssignmentScoreRouter) // get assignment score for given assignment_id
app.use('/api/', plotRouter) // get all plot from plot1 to plot10

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(err.status || 500)
  res.json({
    success: false,
    error: {
      message: err.message || 'Internal Server Error',
      code: err.code || 'INTERNAL_ERROR',
      details: config.app.NODE_ENV === 'development' ? err : undefined
    }
  })
})

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: {
      message: 'Not Found',
      code: 'NOT_FOUND'
    }
  })
})

const PORT = config.app.PORT

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
  console.log(`Environment: ${config.app.NODE_ENV}`)
})
