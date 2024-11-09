const BASE_URL = 'http://localhost:3000';
const params = new URLSearchParams(window.location.search);
const searchKey = params.get('searchKey');
const userName = params.get('userName');
let userEmail;

// โหลดรายละเอียดคำร้องนักศึกษา
async function loadRequestDetails() {
    try {
        const response = await axios.get(`${BASE_URL}/forms/edit/${searchKey}`);
        
        // ตรวจสอบว่ามีข้อมูลหรือไม่
        if (response.data && response.data.length > 0) {
            const data = response.data[0];
            userEmail = data.email;

            // แปลงสถานะให้ตรงกับที่ควรแสดง
            let status;
            if (data.approved == 1) {
                status = 'อนุมัติ';
            } else if (data.approved == 0) {
                status = 'ไม่อนุมัติ';
            } else {
                status = 'รอการอนุมัติ';
            }

            // แสดงรายละเอียดคำร้อง
            document.getElementById('requestDetails').innerHTML = `
                <div class="detail">
                    <div class="request-item" style="font-size: 20px;"><strong>เรื่อง:</strong> ${data.subject}</div>
                    <div></div>
                    <div class="request-item"><strong>ชื่อ:</strong> ${data.firstName}</div>
                    <div class="request-item"><strong>นามสกุล:</strong> ${data.lastName}</div>
                    <div class="request-item"><strong>รหัสนักศึกษา:</strong> ${data.studentID}</div>
                    <div class="request-item"><strong>ปีการศึกษา:</strong> ${data.year}</div>
                    <div class="request-item"><strong>อีเมล:</strong> ${data.email}</div>
                    <div class="request-item"><strong>สถานะ:</strong> ${status}</div>
                    <div class="request-item"><strong>เหตุผล:</strong> ${data.purpose}</div>
                </div>
            `;

            // แสดงส่วนความคิดเห็นและปุ่ม
            document.getElementById('commentSection').style.display = 'block';
            document.getElementById('buttonsContainer').style.display = 'flex';
            document.getElementById('noRequestsMessage').style.display = 'none';

        } else {
            // ไม่พบคำร้อง
            document.getElementById('requestDetails').textContent = '';
            document.getElementById('noRequestsMessage').style.display = 'block';
            document.getElementById('commentSection').style.display = 'none';
            document.getElementById('buttonsContainer').style.display = 'none';
        }

    } catch (error) {
        // เกิดข้อผิดพลาดในการโหลดรายละเอียดคำร้อง
        document.getElementById('requestDetails').textContent = 'เกิดข้อผิดพลาดในการโหลดรายละเอียดคำร้อง';
        document.getElementById('noRequestsMessage').style.display = 'none';
        document.getElementById('commentSection').style.display = 'none';
        document.getElementById('buttonsContainer').style.display = 'none';
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
            
            // โหลดรายละเอียดคำร้องใหม่เพื่ออัปเดตสถานะ
            await loadRequestDetails();
            
            // เปลี่ยนเส้นทางไปยังหน้า forms.html หลังอัปเดตสถานะ
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
