let info = document.getElementById('user_info_container');
let login = document.getElementById('login');

login.addEventListener("click",function(){
    info.classList.toggle('active');
});



function submitLogin() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

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
    .then(response => response.json())
    .then(data => {
        if (data.status) {

            const welcomeMessage = `Success! Welcome ${data.displayname_th || data.displayname_en}`;
            document.getElementById('message').innerText = welcomeMessage;

            const userType = data.type === 'student' ? 'นักศึกษา' : 'เจ้าหน้าที่';
            let userInfo = `Type: ${userType}\n\nUsername: ${data.username}\n\nEmail: ${data.email}\n\nDepartment: ${data.department || data.organization}`;

            if (data.type === 'student') {
                userInfo += `\n\nStatus: ${data.tu_status}\n\nFaculty: ${data.faculty}`;
            } else if (data.type === 'employee') {
                userInfo += `\n\nStatus: ${data.StatusEmp}\n\nWork Status: ${data.StatusWork}`;
            }

            document.getElementById('modalMessage').innerText = userInfo;
            document.getElementById('myModal').style.display = 'block'; 
        } else {
            document.getElementById('message').innerText = data.message || 'การยืนยันไม่สำเร็จ กรุณาลองใหม่'; 
        }
    })
    .catch(error => {
        console.error('Error:', error);
        document.getElementById('message').innerText = 'เกิดข้อผิดพลาด กรุณาลองใหม่';
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
