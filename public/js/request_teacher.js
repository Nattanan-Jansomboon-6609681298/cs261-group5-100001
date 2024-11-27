const BASE_URL = 'http://localhost:3000';
const params = new URLSearchParams(window.location.search);
const searchKey = params.get('searchKey');
const userName = params.get('userName');
let userEmail;

async function loadRequestDetails() {
    try {
        const response = await axios.get(`${BASE_URL}/forms/edit/${searchKey}`);

        if (response.data && response.data.length > 0) {
            const data = response.data[0];
            userEmail = data.email;

            let status;
            if (data.teacher_approved == 1) {
                status = 'อนุมัติ';
            } else if (data.teacher_approved == 0) {
                status = 'ไม่อนุมัติ';
            } else {
                status = 'รอการอนุมัติ';
            }

            //แสดงรายละเอียดคำร้อง
            document.getElementById('requestDetails').innerHTML = `
            <div class="detail">
                <div class="request-item"><strong>เรื่อง:</strong> ${data.subject}</div>
                <div class="request-item"><strong>ชื่อ:</strong> ${data.firstName}</div>
                <div class="request-item"><strong>นามสกุล:</strong> ${data.lastName}</div>
                <div class="request-item"><strong>รหัสนักศึกษา:</strong> ${data.studentID}</div>
                <div class="request-item"><strong>ชั้นปี:</strong> ${data.year}</div>
                <div class="request-item"><strong>ภาคเรียนที่:</strong> ${data.semester}</div>
                <div class="request-item"><strong>สถานะ:</strong> ${status}</div>
                <div class="request-item"><strong>เหตุผล:</strong> ${data.purpose}</div>
            </div>`;

            // ตรวจสอบสถานะคำร้องและซ่อนปุ่มหากคำร้องได้รับการอนุมัติหรือปฏิเสธแล้ว
            if (data.teacher_approved !== null) {
                document.getElementById('commentSection').style.display = 'none';
                document.getElementById('buttonsContainer').style.display = 'none';
            } else {
            // แสดงส่วนความคิดเห็นและปุ่มหากยังไม่มีการอนุมัติหรือปฏิเสธ
                document.getElementById('commentSection').style.display = 'block';
                document.getElementById('buttonsContainer').style.display = 'flex';
            }
            
            document.getElementById('noRequestsMessage').style.display = 'none';
            
        } else {
            document.getElementById('requestDetails').textContent = '';
            document.getElementById('noRequestsMessage').style.display = 'block';
        }
    } catch (error) {
        console.error(error);
    }
}

// เรียกเมื่อโหลดหน้าเว็บเสร็จ
document.addEventListener('DOMContentLoaded', loadRequestDetails);

// ฟังก์ชันสำหรับอนุมัติหรือปฏิเสธคำร้องทันที
async function handleRequest(action) {
    const comments = document.getElementById('comments').value;

    if (!comments.trim()) {
        alert('กรุณากรอกความคิดเห็นก่อนดำเนินการ');
        return;
    }

    try {
        const endpoint = `${BASE_URL}/forms/teacher/update/${searchKey}/${action}`;
        const response = await axios.put(endpoint, { comments, email: userEmail });

        if (response.status === 200) {
            alert(`คำร้องถูก${action}สำเร็จ!`);

            // โหลดรายละเอียดคำร้องใหม่เพื่ออัปเดตสถานะ
            await loadRequestDetails();

            // เปลี่ยนเส้นทางไปยังหน้า forms.html หลังอัปเดตสถานะ
            window.location.href = `forms.html?searchKey=${userName}&type=teacher`;
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

document.addEventListener('DOMContentLoaded', loadRequestDetails);
