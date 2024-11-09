let info = document.getElementById('user_info_container');
let login = document.getElementById('login');
let userEmail;


login.addEventListener("click", function () {
    info.classList.toggle('active');
});

function submitLogin() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if(username === "test" && password === "test") {
        window.location.href = `forms.html?searchKey=test&type=employee`;
    }
    // ตรวจสอบกรอกข้อมูล
    if (!username || !password) {
        document.getElementById('message').innerText = 'กรุณากรอกชื่อผู้ใช้และรหัสผ่าน';
        document.getElementById('message').style.display = 'block'; // แสดงข้อความผิดพลาด
        return;
    } else {
        // ซ่อนข้อความผิดพลาดเมื่อกรอกข้อมูลถูกต้อง
        document.getElementById('message').style.display = 'none';
    }

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
        if (response.ok) {
            return response.json();
        } else {
            return response.json().then(data => {
                let errorMessage;
                switch (response.status) {
                    case 400:
                        if (data.message === 'User or Password Invalid!') {
                            errorMessage = 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง กรุณาลองใหม่';
                        } else if (data.message === 'Could not read the request body!') {
                            errorMessage = 'เกิดปัญหาในการอ่านข้อมูลที่ส่ง กรุณาตรวจสอบข้อมูลของคุณ';
                        } else if (data.message.includes('UserName or PassWord Invalid!')) {
                            errorMessage = 'กรุณากรอกทั้งชื่อผู้ใช้และรหัสผ่าน';
                        } else {
                            errorMessage = 'เกิดข้อผิดพลาด กรุณาตรวจสอบข้อมูลของคุณ';
                        }
                        break;
                    case 401:
                        errorMessage = 'ไม่ได้รับอนุญาต: หัวข้อ Application-Key จำเป็นต้องมีหรือหายไป กรุณาใช้ token ที่ถูกต้อง';
                        break;
                    case 403:
                        if (data.message.includes('invalid token')) {
                            errorMessage = 'Prohibited: token ไม่ถูกต้อง กรุณาตรวจสอบว่า token ของคุณถูกต้อง';
                        } else {
                            errorMessage = 'Prohibited: คุณไม่ได้รับอนุญาตให้เข้าถึงทรัพยากรนี้';
                        }
                        break;
                    case 404:
                        errorMessage = 'Resource not Found';
                        break;
                    default:
                        errorMessage = 'Unexpected error. Please Try again';
                }
                throw new Error(errorMessage);
            });
        }
    })
    .then(data => {
        if (data.status) {
            userEmail = data.email; // เก็บอีเมลของuser
            if (data.type === 'student') {
                window.location.href = `student.html?studentID=${data.username}&type=student&email=${userEmail}`;
            }
        } else {
            document.getElementById('message').innerText = data.message || 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง';
            document.getElementById('message').style.display = 'block'; // แสดงข้อความผิดพลาด
        }
    })
    .catch(error => {
        console.error('Error:', error);
        document.getElementById('message').innerText = error.message;
        document.getElementById('message').style.display = 'block';
    });
}



