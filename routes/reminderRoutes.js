const express = require('express');
const router = express.Router();
const reminderController = require('../controllers/reminderController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.post('/', reminderController.createReminder);
router.get('/', reminderController.getReminders);
router.patch('/:id/toggle-urgent', reminderController.toggleUrgent);
router.delete('/:id', reminderController.deleteReminder);
router.patch('/:id/notified', reminderController.markAsNotified);

module.exports = router;