const cron = require('node-cron');
const supabase = require('../db/supabase');
const { sendNotification } = require('../services/notificationService');

async function checkAndSendReminders() {
    const now = new Date();
    const { data: reminders, error } = await supabase
        .from('reminders')
        .select('*')
        .lte('reminder_date', now.toISOString())
        .eq('is_notified', false);

    if (error) {
        console.error('Error fetching reminders:', error);
        return;
    }

    for (const reminder of reminders) {
        await sendNotification(reminder);
        await supabase
            .from('reminders')
            .update({ is_notified: true })
            .eq('id', reminder.id);
    }
}

cron.schedule('0 * * * *', () => {
    console.log('🕒 Running reminder scheduler...');
    checkAndSendReminders();
});

module.exports = { checkAndSendReminders };