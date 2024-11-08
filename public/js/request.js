const BASE_URL = 'http://localhost:3000';

// Display data from database
async function loadRequestDetails(requestId) {
    try {
        const response = await axios.get(`${BASE_URL}/forms/${requestId}`);
        const data = response.data[0];

        if (response.status === 200) {
            document.getElementById('requestDetails').innerHTML = `
                <p><strong>ชื่อ:</strong> ${data.firstName}</p>
                <p><strong>นามสกุล:</strong> ${data.lastName}</p>
                <p><strong>รหัสนักศึกษา:</strong> ${data.studentID}</p>
                <p><strong>ปีการศึกษา:</strong> ${data.year}</p>
                <p><strong>เลขที่:</strong> ${data.addressNumber}</p>
                <p><strong>ตำบล:</strong> ${data.subdistrict}</p>
                <p><strong>อำเภอ:</strong> ${data.district}</p>
                <p><strong>จังหวัด:</strong> ${data.province}</p>
                <p><strong>เบอร์ติดต่อ:</strong> ${data.contactNumber}</p>
                <p><strong>เบอร์ผู้ปกครอง:</strong> ${data.parentContactNumber}</p>
                <p><strong>อาจารย์ที่ปรึกษา:</strong> ${data.advisor}</p>
                <p><strong>ภาคการศึกษา:</strong> ${data.semester}</p>
                <p><strong>รหัสวิชา:</strong> ${data.courseCode}</p>
                <p><strong>ชื่อวิชา:</strong> ${data.courseName}</p>
                <p><strong>หมู่เรียน:</strong> ${data.section}</p>
                <p><strong>เหตุผล:</strong> ${data.purpose}</p>
                <p><strong>สถานะ:</strong> ${data.status}</p>
            `;
        } else {
            document.getElementById('requestDetails').textContent = 'ไม่สามารถโหลดรายละเอียดคำร้องได้';
        }
    } catch (error) {
        document.getElementById('requestDetails').textContent = 'เกิดข้อผิดพลาดในการโหลดรายละเอียดคำร้อง';
        console.error(error);
    }
}

// โหลดรายละเอียดคำร้องเมื่อหน้าเว็บโหลดเสร็จ
document.addEventListener('DOMContentLoaded', () => {
    const requestId = 'studentID';
    loadRequestDetails(requestId);
});

// แสดงกล่องยืนยันการอนุมัติ
function confirmApprove(requestId) {
    document.getElementById('confirmationDialog').style.display = 'block';
    document.getElementById('actionType').textContent = 'approve';
    window.selectedRequestId = requestId;
    window.selectedAction = 'approve';
}

function confirmReject(requestId) {
    document.getElementById('confirmationDialog').style.display = 'block';
    document.getElementById('actionType').textContent = 'reject';
    window.selectedRequestId = requestId;
    window.selectedAction = 'reject';
}

// ดำเนินการอนุมัติหรือปฏิเสธหลังจากยืนยัน
async function finalizeApproval() {
    const comments = document.getElementById('comments').value;
    const requestId = window.selectedRequestId;
    const action = window.selectedAction;

    try {
        const endpoint = `/api/requests/${requestId}/${action}`;
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                comments,
                email: userEmail // ส่งอีเมลของผู้ใช้ไปด้วย
             })
        });

        if (response.status === 200) {
            document.getElementById('message').textContent = `คำร้องถูก${action}สำเร็จ!`;
            document.getElementById('message').style.color = 'green';
            loadRequestDetails(requestId); // รีเฟรชรายละเอียดคำร้อง
        } else {
            document.getElementById('message').textContent = `ไม่สามารถ${action}คำร้องได้`;
            document.getElementById('message').style.color = 'red';
        }
    } catch (error) {
        document.getElementById('message').textContent = `เกิดข้อผิดพลาดในการ${action}คำร้อง`;
        document.getElementById('message').style.color = 'red';
    }


    // Refresh the page after action is completed
    setTimeout(function() {
        location.reload();  // Refresh the page to update the request status
    }, 1000); // Add delay before page refresh

    // Hide confirmation dialog and enable buttons
    cancelConfirmation();
}

// ยกเลิกการยืนยันและปิดกล่อง
function cancelConfirmation() {
    document.getElementById('confirmationDialog').style.display = 'none';
    document.getElementById('approveButton').removeAttribute('disabled');
    document.getElementById('rejectButton').removeAttribute('disabled');
}
