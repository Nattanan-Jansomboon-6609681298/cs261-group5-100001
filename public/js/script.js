let info = document.getElementById('user_info_container');
let login = document.getElementById('login');

login.addEventListener("click", function () {
    info.classList.toggle('active');
});

function submitLogin() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if(username === "test" && password === "test") {
        window.location.href = 'employee.html'; 
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
                            errorMessage = 'ถูกห้าม: token ไม่ถูกต้อง กรุณาตรวจสอบว่า token ของคุณถูกต้อง';
                        } else {
                            errorMessage = 'ถูกห้าม: คุณไม่ได้รับอนุญาตให้เข้าถึงทรัพยากรนี้';
                        }
                        break;
                    case 404:
                        errorMessage = 'ไม่พบ: ทรัพยากรที่ขอไม่พบ';
                        break;
                    default:
                        errorMessage = 'เกิดข้อผิดพลาดที่ไม่คาดคิด กรุณาลองใหม่ในภายหลัง';
                }
                throw new Error(errorMessage);
            });
        }
    })
    .then(data => {
        if (data.status) {

            // const welcomeMessage = `สำเร็จ! ยินดีต้อนรับ ${data.displayname_th || data.displayname_en}`;
            // document.getElementById('message').innerText = welcomeMessage;

            // const userType = data.type === 'student' ? 'นักศึกษา' : 'เจ้าหน้าที่';
            // let userInfo = `ประเภท: ${userType}\n\nชื่อผู้ใช้: ${data.username}\n\nอีเมล: ${data.email}\n\nแผนก: ${data.department || data.organization}`;

            // if (data.type === 'student') {
            //     userInfo += `\n\nสถานะ: ${data.tu_status}\n\nคณะ: ${data.faculty}`;
            // } else if (data.type === 'employee') {
            //     userInfo += `\n\nสถานะ: ${data.StatusEmp}\n\nสถานะการทำงาน: ${data.StatusWork}`;
            // }

            // document.getElementById('modalMessage').innerText = userInfo;
            // document.getElementById('myModal').style.display = 'block'; 

            if (data.type === 'student') {
                window.location.href = 'student.html';
            }
        } else {
            document.getElementById('message').innerText = data.message || 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง';
            document.getElementById('message').style.display = 'block'; // แสดงข้อความผิดพลาด
        }
        // document.getElementById('message').innerText = 'เข้าสู่ระบบสำเร็จ';
        // document.getElementById('message').style.display = 'block';
    })
    .catch(error => {
        console.error('Error:', error);
        document.getElementById('message').innerText = error.message;
        document.getElementById('message').style.display = 'block';
    });
}




/*function call_REST_API_Hello() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const url = (
        'http://localhost:8081/services/hello?' +
        new URLSearchParams({ myName: username, lastName: password}).toString()
      );
    
    fetch(url)
    .then(response => response.text())
    .then(text => {
        console.log("Text return from rest API: "+text);
        document.getElementById('message').innerText = text;
    })
    .catch(error => console.error('Error:', error));
}*/
