const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const fileUpload = require('express-fileupload'); // Dosya yükleme modülü
const path = require('path');

const app = express();
const PORT = 3000;



// Middleware
app.use(express.json());
app.use(cors());
app.use(fileUpload()); // Dosya yükleme için middleware
app.use('/uploads', express.static('uploads')); // Upload klasörünü statik olarak sun
app.use(express.static('.')); // '.' mevcut klasörü temsil eder

const db = mysql.createConnection({
    host: "172.17.0.2",
    user: 'root',
    password: '1234',
    database: 'taishare_db',
    port: 3306 // Konteyner içindeki MySQL portu
});

// Veritabanı Bağlantısı Kontrolü
db.connect((err) => {
    if (err) throw err;
    console.log('MySQL Connected...');
});

// Statik dosyaları mevcut dizinden servis et

// Ana sayfada index.html gönder
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// API: Kullanıcıları Getir
app.get('/users', (req, res) => {
    db.query('SELECT * FROM users', (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

// API: To-Do List Görevlerini Getir
app.get('/tasks', (req, res) => {
    db.query('SELECT tasks.id, tasks.task, users.name AS user_name FROM tasks JOIN users ON tasks.user_id = users.id', (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

// API: Dosya Yükleme
app.post('/upload', (req, res) => {
    if (!req.files || !req.files.file) {
        return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    const file = req.files.file;
    const uploadPath = path.join(__dirname, 'uploads', file.name);

    // Dosyayı uploads klasörüne kaydet
    file.mv(uploadPath, (err) => {
        if (err) return res.status(500).json({ success: false, message: 'File upload failed' });

        // Veritabanına dosya adını kaydet
        const { user_id } = req.body;
        const sql = 'INSERT INTO files (user_id, file_name) VALUES (?, ?)';
        db.query(sql, [user_id, file.name], (err, result) => {
            if (err) throw err;
            res.json({ success: true, message: 'File uploaded successfully!', file: file.name });
        });
    });
});
// API: Dosya Paylaşımlarını Getir
app.get('/files', (req, res) => {
    db.query('SELECT files.id, files.file_name, users.name AS user_name FROM files JOIN users ON files.user_id = users.id', (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

// API: Chat Mesajlarını Getir
app.get('/messages', (req, res) => {
    db.query('SELECT messages.message, users.name AS user_name FROM messages JOIN users ON messages.user_id = users.id', (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

// API: Dosya Yükleme
app.post('/upload', (req, res) => {
    if (!req.files || !req.files.file) {
        return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    const file = req.files.file;
    const uploadPath = path.join(__dirname, 'uploads', file.name);

    // Dosyayı uploads klasörüne kaydet
    file.mv(uploadPath, (err) => {
        if (err) return res.status(500).json({ success: false, message: 'File upload failed' });

        // Veritabanına dosya adını kaydet
        const { user_id } = req.body;
        const sql = 'INSERT INTO files (user_id, file_name) VALUES (?, ?)';
        db.query(sql, [user_id, file.name], (err, result) => {
            if (err) throw err;
            res.json({ success: true, message: 'File uploaded successfully!', file: file.name });
        });
    });
});

// API: Tüm Dosyaları Getir
app.get('/files', (req, res) => {
    db.query('SELECT * FROM files', (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

// API: Yeni Görev Ekle
app.post('/tasks', (req, res) => {
    const { user_id, task } = req.body;
    const sql = 'INSERT INTO tasks (user_id, task) VALUES (?, ?)';
    db.query(sql, [user_id, task], (err, result) => {
        if (err) throw err;
        res.json({ success: true, message: 'Task added successfully!' });
    });
});

// API: Yeni Chat Mesajı Ekle
app.post('/messages', (req, res) => {
    const { user_id, message } = req.body;
    const sql = 'INSERT INTO messages (user_id, message) VALUES (?, ?)';
    db.query(sql, [user_id, message], (err, result) => {
        if (err) throw err;
        res.json({ success: true, message: 'Message sent successfully!' });
    });
});

// API: Yeni Dosya Ekle
app.post('/files', (req, res) => {
    const { user_id, file_name } = req.body;
    const sql = 'INSERT INTO files (user_id, file_name) VALUES (?, ?)';
    db.query(sql, [user_id, file_name], (err, result) => {
        if (err) throw err;
        res.json({ success: true, message: 'File uploaded successfully!' });
    });
});

// API: Kullanıcı Girişi
app.post('/login', (req, res) => {
    const { email, password } = req.body;
    const sql = 'SELECT * FROM users WHERE email = ? AND password = ?';
    db.query(sql, [email, password], (err, results) => {
        if (err) throw err;

        if (results.length > 0) {
            const user = results[0];
            res.json({ success: true, user_id: user.id, name: user.name });
        } else {
            res.json({ success: false, message: 'Invalid email or password' });
        }
    });
});

// Sunucuyu Başlat
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
