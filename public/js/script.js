let info = document.getElementById('user_info_container');
let login = document.getElementById('login');
let userEmail;

login.addEventListener("click", function () {
    info.classList.toggle('active');
});

function submitLogin() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const messageElement = document.getElementById('message');

    // ตรวจสอบการกรอกข้อมูล
    if (!username || !password) {
        messageElement.innerText = 'กรุณากรอกชื่อผู้ใช้และรหัสผ่าน';
        messageElement.style.display = 'block'; // แสดงข้อความผิดพลาด
        return;
    } else {
        messageElement.style.display = 'none'; // ซ่อนข้อความผิดพลาด
    }

    // แสดงข้อความกำลังโหลด
    messageElement.innerText = 'กำลังตรวจสอบข้อมูล...';
    messageElement.style.display = 'block';

    fetch('https://restapi.tu.ac.th/api/v1/auth/Ad/verify', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Application-Key': 'TU7e27d46270c4c7547f66c0c5f5d8a9a6ceb3d7b94d39a6dd4b718941b4b49f89d8257c4b88885a3ed4b3abf902ddb7a0'
        },
        body: JSON.stringify({
            "UserName": username,
            "PassWord": password
        })
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(data => {
                // แสดงข้อความผิดพลาดที่ถูกต้อง
                let errorMessage = 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง';
                if (data.message === 'User or Password Invalid!') {
                    errorMessage = 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง กรุณาลองใหม่';
                } else if (data.message === 'Could not read the request body!') {
                    errorMessage = 'เกิดปัญหาในการอ่านข้อมูลที่ส่ง กรุณาตรวจสอบข้อมูลของคุณ';
                } else if (data.message.includes('UserName or PassWord Invalid!')) {
                    errorMessage = 'กรุณากรอกทั้งชื่อผู้ใช้และรหัสผ่าน';
                }
                throw new Error(errorMessage); // ขว้างข้อผิดพลาดที่แก้ไขแล้ว
            });
        }
        return response.json();
    })
    .then(data => {
        if (data.status) {
            userEmail = data.email; // เก็บอีเมลของ user
            if (data.type === 'student') {
                window.location.href = `student.html?studentID=${data.username}&type=student&email=${userEmail}`;
            } else if (data.type === 'employee') {
                window.location.href = `forms.html?searchKey=${data.username}&type=employee`;
            }
        } else {
            throw new Error(data.message || 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        messageElement.innerText = error.message;
        messageElement.style.display = 'block'; // แสดงข้อความผิดพลาด
    });
}





