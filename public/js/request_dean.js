const BASE_URL = 'http://localhost:3000';
const params = new URLSearchParams(window.location.search);
const searchKey = params.get('searchKey');
const userName = params.get('userName');
let userEmail;

// โหลดรายละเอียดคำร้องนักศึกษา
async function loadRequestDetails() {
    try {
        const response = await axios.get(`${BASE_URL}/forms/request/dean`);
        
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
            if (data.subject === 'ขอถอนวิชา/ถอนรายวิชา' || data.subject === 'ขอจดทะเบียนรายวิชาศึกษานอกหลักสูตร' || data.subject === 'จดทะเบียน/เพิ่มถอน') {
                document.getElementById('requestDetails').innerHTML = `
                <div class="detail">
                    <div class="request-item"><strong>เรื่อง:</strong> ${data.subject}</div>
                    <div class="request-item"><strong>ชื่อ:</strong> ${data.firstName}</div>
                    <div class="request-item"><strong>นามสกุล:</strong> ${data.lastName}</div>
                    <div class="request-item"><strong>รหัสนักศึกษา:</strong> ${data.studentID}</div>
                    <div class="request-item"><strong>ชั้นปี:</strong> ${data.year}</div>
                    <div class="request-item"><strong>อีเมล:</strong> ${data.email}</div>
                    <div class="request-item"><strong>อาจารย์ที่ปรึกษา:</strong> ${data.advisor}</div>
                    <div class="request-item"><strong>ภาคเรียนที่:</strong> ${data.semester}</div>
                    <div class="request-item"><strong>รหัสวิชา:</strong> ${data.courseCode}</div>
                    <div class="request-item"><strong>ชื่อวิชา:</strong> ${data.courseName}</div>
                    <div class="request-item"><strong>Section:</strong> ${data.section}</div>
                    <div class="request-item"><strong>สถานะ:</strong></div>
                    <div class="request-item"><strong>อาจารย์ที่ปรึกษา:</strong>${status}</div>
                    <div class="request-item"><strong>อาจารย์ผู้สอน:</strong>${status}</div>
                    <div class="request-item"><strong>คณบดี:</strong>${status}</div>
                    <div class="request-item"><strong>เหตุผล:</strong> ${data.purpose}</div>
                    <div class="request-item"><strong>ข้อเสนอแนะ:</strong> ${data.comments || '-'}</div>
                </div>
                `;
            } else {
                document.getElementById('requestDetails').innerHTML = `
                <div class="detail">
                    <div class="request-item"><strong>เรื่อง:</strong> ${data.subject}</div>
                    <div class="request-item"><strong>ชื่อ:</strong> ${data.firstName}</div>
                    <div class="request-item"><strong>นามสกุล:</strong> ${data.lastName}</div>
                    <div class="request-item"><strong>รหัสนักศึกษา:</strong> ${data.studentID}</div>
                    <div class="request-item"><strong>ชั้นปี:</strong> ${data.year}</div>
                    <div class="request-item"><strong>อีเมล:</strong> ${data.email}</div>
                    <div class="request-item"><strong>อาจารย์ที่ปรึกษา:</strong> ${data.advisor}</div>
                    <div class="request-item"><strong>สถานะ:</strong></div>
                    <div class="request-item"><strong>อาจารย์ที่ปรึกษา:</strong>${status}</div>
                    <div class="request-item"><strong>อาจารย์ผู้สอน:</strong>${status}</div>
                    <div class="request-item"><strong>คณบดี:</strong>${status}</div>
                    <div class="request-item"><strong>เหตุผล:</strong> ${data.purpose}</div>
                    <div class="request-item"><strong>ข้อเสนอแนะ:</strong> ${data.comments || '-'}</div>
                </div>
                `;
            }

            // ตรวจสอบสถานะคำร้องและซ่อนปุ่มหากคำร้องได้รับการอนุมัติหรือปฏิเสธแล้ว
            if (data.dean_approved !== null) {
                document.getElementById('commentSection').style.display = 'none';
                document.getElementById('buttonsContainer').style.display = 'none';
            } else {
                // แสดงส่วนความคิดเห็นและปุ่มหากยังไม่มีการอนุมัติหรือปฏิเสธ
                document.getElementById('commentSection').style.display = 'block';
                document.getElementById('buttonsContainer').style.display = 'flex';
            }

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

    // ตรวจสอบว่ามีการกรอกความคิดเห็นหรือไม่
    if (!comments.trim()) {
        alert('กรุณากรอกความคิดเห็นก่อนดำเนินการอนุมัติหรือปฏิเสธ');
        return;
    }

    try {
        const endpoint = `${BASE_URL}/forms/dean/update/${searchKey}/${action}`;
        const response = await axios.put(endpoint, { comments, email: userEmail });

        if (response.status === 200) {
            alert(`คำร้องถูก${action}สำเร็จ!`);

            // โหลดรายละเอียดคำร้องใหม่เพื่ออัปเดตสถานะ
            await loadRequestDetails();
            
            // เปลี่ยนเส้นทางไปยังหน้า forms.html หลังอัปเดตสถานะ
            window.location.href = `forms.html?searchKey=${userName}&type=dean`;
        } else {
            alert(`ไม่สามารถ${action}คำร้องได้`);
        }
    } catch (error) {
        console.log(error);
        alert(`เกิดข้อผิดพลาดในการ${action}คำร้อง`);
    }
}