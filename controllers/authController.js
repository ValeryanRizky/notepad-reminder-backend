const supabase = require('../db/supabase');

// REGISTER
exports.register = async (req, res) => {
    try {
        const { email, password, username } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email dan password wajib diisi' });
        }

        const { data, error } = await supabase.auth.signUp({
            email: email,
            password: password,
            options: {
                data: { username: username || email.split('@')[0] }
            }
        });

        if (error) throw error;

        // Jika user langsung terverifikasi (confirm email dimatikan)
        if (data.user && data.session) {
            return res.status(201).json({
                success: true,
                message: 'Registrasi berhasil ✅',
                user: {
                    id: data.user.id,
                    email: data.user.email,
                    username: data.user.user_metadata?.username
                },
                token: data.session.access_token  // ← Token dari Supabase
            });
        }

        // Jika perlu verifikasi email
        res.status(201).json({
            success: true,
            message: 'Registrasi berhasil! Silahkan cek email untuk verifikasi.',
            needVerification: true
        });

    } catch (err) {
        console.error('Error register:', err);
        res.status(500).json({ error: err.message });
    }
};

// LOGIN
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const { data, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password
        });

        if (error) throw error;

        res.json({
            success: true,
            message: 'Login berhasil ✅',
            user: {
                id: data.user.id,
                email: data.user.email,
                username: data.user.user_metadata?.username
            },
            token: data.session.access_token  // ← Token dari Supabase
        });

    } catch (err) {
        console.error('Error login:', err);
        res.status(401).json({ error: 'Email atau password salah' });
    }
};

// GET CURRENT USER
exports.getCurrentUser = async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) {
            return res.status(401).json({ error: 'Token tidak ditemukan' });
        }

        // Verifikasi token dengan Supabase
        const { data, error } = await supabase.auth.getUser(token);

        if (error) {
            console.error('Token error:', error);
            return res.status(401).json({ error: 'Token tidak valid' });
        }

        res.json({
            success: true,
            user: {
                id: data.user.id,
                email: data.user.email,
                username: data.user.user_metadata?.username
            }
        });

    } catch (err) {
        console.error('Error get user:', err);
        res.status(401).json({ error: 'Token tidak valid' });
    }
};

// LOGOUT
exports.logout = async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];

        if (token) {
            await supabase.auth.signOut();
        }

        res.json({ success: true, message: 'Logout berhasil ✅' });
    } catch (err) {
        console.error('Error logout:', err);
        res.status(500).json({ error: err.message });
    }
};