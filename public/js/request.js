const BASE_URL = 'http://localhost:3000';
const params = new URLSearchParams(window.location.search);
const searchKey = params.get('searchKey');
const userName = params.get('userName');
let userEmail;

// โหลดรายละเอียดคำร้องนักศึกษา
async function loadRequestDetails() {
    try {
        const response = await axios.get(`${BASE_URL}/forms/edit/${searchKey}`);
        const data = response.data[0];
        userEmail = data.email;

        let status = data.approved === '1' ? 'อนุมัติ' : (data.approved === '0' ? 'ไม่อนุมัติ' : 'รอการอนุมัติ');

        if (response.status === 200) {
            document.getElementById('requestDetails').innerHTML = `<div>
                <p><strong>เรื่อง:</strong> ${data.subject}</p>
                <p><strong>ชื่อ:</strong> ${data.firstName}</p>
                <p><strong>นามสกุล:</strong> ${data.lastName}</p>
                <p><strong>รหัสนักศึกษา:</strong> ${data.studentID}</p>
                <p><strong>ปีการศึกษา:</strong> ${data.year}</p>
                <p><strong>อีเมล:</strong> ${data.email}</p>
                <p><strong>เหตุผล:</strong> ${data.purpose}</p>
                <p><strong>สถานะ:</strong> ${status}</p>
                <div>
            `;
        } else {
            document.getElementById('requestDetails').textContent = 'ไม่สามารถโหลดรายละเอียดคำร้องได้';
        }
    } catch (error) {
        document.getElementById('requestDetails').textContent = 'เกิดข้อผิดพลาดในการโหลดรายละเอียดคำร้อง';
        console.error(error);
    }
}

// เรียกเมื่อโหลดหน้าเว็บเสร็จ
document.addEventListener('DOMContentLoaded', loadRequestDetails);

// ฟังก์ชันสำหรับอนุมัติหรือปฏิเสธคำร้องทันที
async function handleRequest(action) {
    const comments = document.getElementById('comments').value;

    try {
        const endpoint = `${BASE_URL}/api/requests/${searchKey}/${action}`;
        const response = await axios.put(endpoint, { comments, email: userEmail });

        if (response.status === 200) {
            document.getElementById('message').textContent = `คำร้องถูก${action}สำเร็จ!`;
            document.getElementById('message').style.color = 'green';
            loadRequestDetails(); // รีเฟรชรายละเอียดคำร้อง
            window.location.href = `forms.html?searchKey=${userName}&type=employee`;
        } else {
            document.getElementById('message').textContent = `ไม่สามารถ${action}คำร้องได้`;
            document.getElementById('message').style.color = 'red';
        }
    } catch (error) {
        console.log(error);
        document.getElementById('message').textContent = `เกิดข้อผิดพลาดในการ${action}คำร้อง`;
        document.getElementById('message').style.color = 'red';
    }
}
