const axios = require('axios');

async function sendNotification(reminder) {
    try {
        const webhookUrl = process.env.WEBHOOK_URL || 'http://localhost:5173/api/notify';

        await axios.post(webhookUrl, {
            user_id: reminder.user_id,
            title: reminder.title,
            message: `Reminder: ${reminder.title} akan jatuh tempo besok!`,
            due_date: reminder.due_date,
        });

        console.log(`✅ Notifikasi terkirim untuk reminder ${reminder.id}`);
    } catch (error) {
        console.error(`❌ Gagal kirim notifikasi: ${error.message}`);
    }
}

module.exports = { sendNotification };