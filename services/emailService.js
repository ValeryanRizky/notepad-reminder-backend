const axios = require('axios');

async function sendConfirmationEmail(userEmail, reminderTitle, dueDate) {
    try {
        const reminderDateFormatted = new Date(dueDate).toLocaleDateString('id-ID', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        const response = await axios.post('https://api.brevo.com/v3/smtp/email', {
            sender: { email: process.env.EMAIL_USER, name: 'Notepad Reminder' },
            to: [{ email: userEmail }],
            subject: `✅ Reminder Created: ${reminderTitle}`,
            htmlContent: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 16px;">
                    <div style="text-align: center; margin-bottom: 20px;">
                        <div style="font-size: 48px;">📝</div>
                        <h1 style="color: #3b82f6; margin: 0;">Notepad Reminder</h1>
                        <p style="color: #6b7280;">Reminder berhasil dibuat!</p>
                    </div>
                    <div style="background-color: #f3f4f6; padding: 16px; border-radius: 12px; margin-bottom: 20px;">
                        <h2 style="margin: 0 0 8px 0; color: #1f2937;">${reminderTitle}</h2>
                        <p style="margin: 0; color: #6b7280;">📅 Tenggat: ${reminderDateFormatted}</p>
                        <p style="margin: 8px 0 0 0; color: #6b7280;">⏰ Kamu akan mendapatkan pengingat H-1 sebelum tenggat.</p>
                    </div>
                    <div style="text-align: center; margin-top: 20px;">
                        <a href="${process.env.FRONTEND_URL}/dashboard" 
                           style="background-color: #3b82f6; color: white; padding: 10px 20px; text-decoration: none; border-radius: 8px;">
                            Lihat di Dashboard
                        </a>
                    </div>
                    <hr style="margin: 20px 0; border-color: #e5e7eb;">
                    <p style="color: #9ca3af; font-size: 12px; text-align: center;">
                        Ini adalah pesan otomatis dari Notepad Reminder.
                    </p>
                </div>
            `
        }, {
            headers: {
                'api-key': process.env.BREVO_API_KEY,
                'Content-Type': 'application/json'
            }
        });

        console.log(`✅ Email terkirim ke ${userEmail}`);
        return { success: true };

    } catch (error) {
        console.error('❌ Gagal kirim email:', error.response?.data || error.message);
        return { success: false, error: error.message };
    }
}

async function sendReminderEmail(userEmail, reminderTitle, dueDate) {
    try {
        const dueDateFormatted = new Date(dueDate).toLocaleDateString('id-ID', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        const response = await axios.post('https://api.brevo.com/v3/smtp/email', {
            sender: { email: process.env.EMAIL_USER, name: 'Notepad Reminder' },
            to: [{ email: userEmail }],
            subject: `🔔 Reminder: ${reminderTitle} akan segera jatuh tempo!`,
            htmlContent: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #f97316; border-radius: 16px;">
                    <div style="text-align: center; margin-bottom: 20px;">
                        <div style="font-size: 48px;">🔔</div>
                        <h1 style="color: #f97316; margin: 0;">Pengingat!</h1>
                        <p style="color: #6b7280;">Tenggat sudah mendekat!</p>
                    </div>
                    <div style="background-color: #fff7ed; padding: 16px; border-radius: 12px; margin-bottom: 20px; border-left: 4px solid #f97316;">
                        <h2 style="margin: 0 0 8px 0; color: #1f2937;">${reminderTitle}</h2>
                        <p style="margin: 0; color: #6b7280;">📅 Tenggat: ${dueDateFormatted}</p>
                        <p style="margin: 8px 0 0 0; color: #f97316; font-weight: bold;">⚠️ Jangan lupa selesaikan tepat waktu!</p>
                    </div>
                    <div style="text-align: center; margin-top: 20px;">
                        <a href="${process.env.FRONTEND_URL}/dashboard" 
                           style="background-color: #f97316; color: white; padding: 10px 20px; text-decoration: none; border-radius: 8px;">
                            Lihat di Dashboard
                        </a>
                    </div>
                    <hr style="margin: 20px 0; border-color: #e5e7eb;">
                    <p style="color: #9ca3af; font-size: 12px; text-align: center;">
                        Ini adalah pesan otomatis dari Notepad Reminder.
                    </p>
                </div>
            `
        }, {
            headers: {
                'api-key': process.env.BREVO_API_KEY,
                'Content-Type': 'application/json'
            }
        });

        console.log(`✅ Email pengingat terkirim ke ${userEmail}`);
        return { success: true };

    } catch (error) {
        console.error('❌ Gagal kirim email pengingat:', error.response?.data || error.message);
        return { success: false, error: error.message };
    }
}

module.exports = { sendConfirmationEmail, sendReminderEmail };