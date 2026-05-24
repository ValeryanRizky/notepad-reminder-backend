const supabase = require('../db/supabase');

// Middleware untuk verifikasi token dari Supabase
const authMiddleware = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) {
            return res.status(401).json({
                error: 'Akses ditolak. Token tidak ditemukan.'
            });
        }

        // Verifikasi token dengan Supabase
        const { data, error } = await supabase.auth.getUser(token);

        if (error || !data.user) {
            console.error('Auth error:', error);
            return res.status(401).json({
                error: 'Token tidak valid atau sudah kadaluarsa'
            });
        }

        // Simpan user info ke request
        req.user = {
            id: data.user.id,
            email: data.user.email
        };

        next();

    } catch (err) {
        console.error('Auth error:', err);
        return res.status(401).json({
            error: 'Token tidak valid atau sudah kadaluarsa'
        });
    }
};

module.exports = authMiddleware;