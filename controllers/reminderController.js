const supabase = require('../db/supabase');

// CREATE reminder
exports.createReminder = async (req, res) => {
    try {
        const { title, description, due_date, is_urgent } = req.body;
        const user_id = req.user.id;

        if (!title || !due_date) {
            return res.status(400).json({ error: 'title dan due_date wajib diisi' });
        }

        const reminderDate = new Date(due_date);
        reminderDate.setDate(reminderDate.getDate() - 1);

        const { data, error } = await supabase
            .from('reminders')
            .insert([{
                user_id,
                title,
                description: description || '',
                due_date,
                reminder_date: reminderDate.toISOString(),
                is_notified: false,
                is_urgent: is_urgent || false  // tambah field urgent
            }])
            .select();

        if (error) throw error;

        res.status(201).json({
            message: 'Reminder berhasil dibuat ✅',
            reminder: data[0],
        });
    } catch (err) {
        console.error('Error create reminder:', err);
        res.status(500).json({ error: err.message });
    }
};

// GET reminders dengan statistik
exports.getReminders = async (req, res) => {
    try {
        const user_id = req.user.id;

        const { data, error } = await supabase
            .from('reminders')
            .select('*')
            .eq('user_id', user_id)
            .order('due_date', { ascending: true });

        if (error) throw error;

        // Hitung statistik
        const now = new Date();
        const stats = {
            total: data.length,
            urgent: data.filter(r => r.is_urgent === true).length,
            notUrgent: data.filter(r => r.is_urgent === false).length,
            upcoming: data.filter(r => new Date(r.due_date) > now).length
        };

        res.json({
            success: true,
            stats,
            reminders: data,
        });
    } catch (err) {
        console.error('Error get reminders:', err);
        res.status(500).json({ error: err.message });
    }
};

// UPDATE reminder urgent status
exports.toggleUrgent = async (req, res) => {
    try {
        const { id } = req.params;
        const { is_urgent } = req.body;

        const { data, error } = await supabase
            .from('reminders')
            .update({ is_urgent })
            .eq('id', id)
            .select();

        if (error) throw error;

        res.json({ success: true, reminder: data[0] });
    } catch (err) {
        console.error('Error update reminder:', err);
        res.status(500).json({ error: err.message });
    }
};

// DELETE reminder
exports.deleteReminder = async (req, res) => {
    try {
        const { id } = req.params;

        const { error } = await supabase
            .from('reminders')
            .delete()
            .eq('id', id);

        if (error) throw error;

        res.json({ message: 'Reminder berhasil dihapus ✅' });
    } catch (err) {
        console.error('Error delete reminder:', err);
        res.status(500).json({ error: err.message });
    }
};

// MARK AS NOTIFIED
exports.markAsNotified = async (req, res) => {
    try {
        const { id } = req.params;

        const { data, error } = await supabase
            .from('reminders')
            .update({ is_notified: true })
            .eq('id', id)
            .select();

        if (error) throw error;

        res.json({ success: true, reminder: data[0] });
    } catch (err) {
        console.error('Error mark as notified:', err);
        res.status(500).json({ error: err.message });
    }
};