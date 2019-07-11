const express = require('express')
const router = express.Router()
const commentController = require('../controllers/commentController');

router.post('/comments',authenticated,commentController.postComment)
router.delete('/comments/:id',authenticateAdmin,commentController.deleteComment)

module.exports = router.routes()