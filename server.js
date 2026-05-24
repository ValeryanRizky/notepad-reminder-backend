require('dotenv').config();
const express = require('express');
const cors = require('cors');
const reminderRoutes = require('./routes/reminderRoutes');
const authRoutes = require('./routes/authRoutes'); // Tambah ini
require('./jobs/reminderScheduler');

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);        // Tambah route auth
app.use('/api/reminders', reminderRoutes);

app.get('/', (req, res) => {
    res.send('Notepad Reminder Backend Running ✅');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});