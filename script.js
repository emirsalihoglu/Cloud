// API URL'si
const API_URL = "http://localhost:3000";

// Sayfa yüklendiğinde tüm verileri getir
window.onload = () => {
    fetchUsers();
    fetchTasks();
    fetchFiles();
    fetchMessages();
};

// 1. Kullanıcıları Getir ve Göster
function fetchUsers() {
    fetch(`${API_URL}/users`)
        .then(response => response.json())
        .then(data => {
            const userTable = document.querySelector("#users table");
            const tableBody = userTable.querySelector('tbody') || document.createElement('tbody');
            tableBody.innerHTML = ""; // Mevcut içeriği temizle

            data.forEach(user => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${user.id}</td>
                    <td>${user.name}</td>
                    <td>${user.email}</td>
                `;
                tableBody.appendChild(row);
            });

            if (!userTable.querySelector('tbody')) userTable.appendChild(tableBody);
        })
        .catch(err => console.error("Error fetching users:", err));
}

// 2. To-Do List Görevlerini Getir ve Göster
function fetchTasks() {
    fetch(`${API_URL}/tasks`)
        .then(response => response.json())
        .then(data => {
            const taskList = document.getElementById('taskList');
            taskList.innerHTML = ""; // Mevcut içeriği temizle

            data.forEach(task => {
                const li = document.createElement('li');
                li.textContent = `${task.task} (Assigned to: ${task.user_name})`;
                taskList.appendChild(li);
            });
        })
        .catch(err => console.error("Error fetching tasks:", err));
}

// 3. Dosya Paylaşımlarını Getir ve Göster
document.getElementById('fileInput').addEventListener('change', function () {
    const file = this.files[0];
    if (file) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('user_id', 1); // Örnek kullanıcı ID'si

        fetch(`${API_URL}/upload`, {
            method: 'POST',
            body: formData
        })
            .then(response => response.json())
            .then(data => {
                console.log(data.message);
                fetchFiles(); // fetchFiles çağrısı burada
            })
            .catch(err => console.error("Error uploading file:", err));
    }
});

// fetchFiles fonksiyonunu dışarı taşı
function fetchFiles() {
    fetch(`${API_URL}/files`)
        .then(response => response.json())
        .then(data => {
            const fileList = document.getElementById('fileList');
            fileList.innerHTML = ""; // Mevcut içeriği temizle

            data.forEach(file => {
                const li = document.createElement('li');
                li.innerHTML = `
                    ${file.file_name}
                    <a href="${API_URL}/uploads/${file.file_name}" download>Download</a>
                `;
                fileList.appendChild(li);
            });
        })
        .catch(err => console.error("Error fetching files:", err));
}

// 4. Chat Mesajlarını Getir ve Göster
function fetchMessages() {
    fetch(`${API_URL}/messages`)
        .then(response => response.json())
        .then(data => {
            const chatBox = document.getElementById('chatBox');
            chatBox.innerHTML = ""; // Mevcut içeriği temizle

            data.forEach(message => {
                const p = document.createElement('p');
                p.textContent = `${message.user_name}: ${message.message}`;
                chatBox.appendChild(p);
            });
            chatBox.scrollTop = chatBox.scrollHeight; // En alta kaydır
        })
        .catch(err => console.error("Error fetching messages:", err));
}

// Yeni Görev Ekle
function addTask() {
    const taskInput = document.getElementById('taskInput');
    const task = taskInput.value.trim();

    if (task) {
        const user_id = 1; // Sabit bir kullanıcı ID (örnek için)
        fetch(`${API_URL}/tasks`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user_id, task })
        })
            .then(response => response.json())
            .then(data => {
                console.log(data.message);
                taskInput.value = '';
                fetchTasks(); // Görev listesini yenile
            })
            .catch(err => console.error("Error adding task:", err));
    }
}

// Yeni Mesaj Gönder
function sendMessage() {
    const messageInput = document.getElementById('messageInput');
    const message = messageInput.value.trim();

    if (message) {
        const user_id = 1; // Sabit bir kullanıcı ID (örnek için)
        fetch(`${API_URL}/messages`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user_id, message })
        })
            .then(response => response.json())
            .then(data => {
                console.log(data.message);
                messageInput.value = '';
                fetchMessages(); // Mesaj listesini yenile
            })
            .catch(err => console.error("Error sending message:", err));
    }
}

// Dosya Yükleme
document.getElementById('fileInput').addEventListener('change', function () {
    const file = this.files[0];
    if (file) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('user_id', 1); // Örnek kullanıcı ID'si

        fetch(`${API_URL}/upload`, {
            method: 'POST',
            body: formData
        })
            .then(response => response.json())
            .then(data => {
                console.log(data.message);
                fetchFiles(); // Dosya listesini yenile
            })
            .catch(err => console.error("Error uploading file:", err));
    }
});


let currentUser = null;

// Kullanıcı Girişi Fonksiyonu
function handleLogin() {
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value.trim();
    const loginError = document.getElementById('loginError');

    fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                currentUser = { id: data.user_id, name: data.name };
                loginError.style.display = 'none';
                document.getElementById('loginSection').style.display = 'none';
                document.getElementById('appContent').style.display = 'block';
                addActiveUser(currentUser.name);
            } else {
                loginError.style.display = 'block';
            }
        })
        .catch(err => console.error("Error logging in:", err));
}

// Aktif Kullanıcıyı Göster
function addActiveUser(name) {
    const activeUserList = document.getElementById('activeUserList');
    const li = document.createElement('li');
    li.textContent = name;
    activeUserList.appendChild(li);
}

// Kullanıcı Girişi Fonksiyonu
function handleLogin() {
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value.trim();
    const loginError = document.getElementById('loginError');

    fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Giriş başarılı
                currentUser = { id: data.user_id, name: data.name };
                loginError.style.display = 'none';
                document.getElementById('loginSection').style.display = 'none';
                document.getElementById('appContent').style.display = 'block';
                addActiveUser(currentUser.name);
            } else {
                // Hata mesajını göster
                loginError.style.display = 'block';
                loginError.textContent = data.message;
            }
        })
        .catch(err => console.error("Error logging in:", err));
}

// Çıkış Yap Fonksiyonu
function logout() {
    // localStorage'daki token ve kullanıcı bilgilerini temizle
    localStorage.removeItem('token');
    currentUser = null;

    // Aktif kullanıcı listesini temizle
    document.getElementById('activeUserList').innerHTML = "";

    // Giriş ekranını göster, ana içeriği gizle
    document.getElementById('loginSection').style.display = 'block';
    document.getElementById('appContent').style.display = 'none';

    console.log("User logged out successfully.");
}

