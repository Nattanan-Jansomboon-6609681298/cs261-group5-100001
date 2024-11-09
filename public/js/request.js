const BASE_URL = 'http://localhost:3000';
const params = new URLSearchParams(window.location.search);
const searchKey = params.get('searchKey'); 
const type = params.get('type');
let userEmail;

async function loadRequestDetails() {
    try {
        const response = await axios.get(`${BASE_URL}/forms/edit/${searchKey}`);
        const data = response.data[0];
        userEmail = data.email;
        console.log(userEmail)
        let status = data.approved;
        if(status) {
            if(status === '0' ) {
                status = 'ไม่อนุมัติ';
            }
            else {
                status = 'อนุมัติ';
            }

        }else {
            status = 'รอการอนุมัติ';
        }

        if (response.status === 200) {
            document.getElementById('requestDetails').innerHTML = `
                <p><strong>เรื่อง:</strong> ${data.subject}</p>
                <p><strong>ชื่อ:</strong> ${data.firstName}</p>
                <p><strong>นามสกุล:</strong> ${data.lastName}</p>
                <p><strong>รหัสนักศึกษา:</strong> ${data.studentID}</p>
                <p><strong>ปีการศึกษา:</strong> ${data.year}</p>
                <p><strong>อีเมล:</strong> ${data.email}</p>
                <p><strong>เลขที่:</strong> ${data.addressNumber}</p>
                <p><strong>ตำบล:</strong> ${data.subdistrict}</p>
                <p><strong>อำเภอ:</strong> ${data.district}</p>
                <p><strong>จังหวัด:</strong> ${data.province}</p>
                <p><strong>เบอร์ติดต่อ:</strong> ${data.contactNumber}</p>
                <p><strong>เบอร์ผู้ปกครอง:</strong> ${data.parentContactNumber}</p>
                <p><strong>อาจารย์ที่ปรึกษา:</strong> ${data.advisor}</p>
                <p><strong>ภาคการศึกษา:</strong> ${data.semester}</p>
                <p><strong>รหัสวิชา:</strong> ${data.courseCode  || '-'}</p>
                <p><strong>ชื่อวิชา:</strong> ${data.courseName  || '-'}</p>
                <p><strong>หมู่เรียน:</strong> ${data.section  || '-'}</p>
                <p><strong>เหตุผล:</strong> ${data.purpose}</p>
                <p><strong>สถานะ:</strong> ${status}</p>
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
    const requestId = searchKey;
    loadRequestDetails(requestId);
});

// แสดงกล่องยืนยันการอนุมัติ
function confirmApprove() {
    document.getElementById('confirmationDialog').style.display = 'block';
    document.getElementById('actionType').textContent = 'approve';
    window.selectedRequestId = searchKey;
    window.selectedAction = 'approve';
}

function confirmReject() {
    document.getElementById('confirmationDialog').style.display = 'block';
    document.getElementById('actionType').textContent = 'reject';
    window.selectedRequestId = searchKey;
    window.selectedAction = 'reject';
}

// ดำเนินการอนุมัติหรือปฏิเสธหลังจากยืนยัน
async function finalizeApproval() {
    const comments = document.getElementById('comments').value;
    const requestId = window.selectedRequestId;
    const action = window.selectedAction;

    try {
        const endpoint = `http://localhost:3000/api/requests/${requestId}/${action}`;
        const response = await axios.put(`${endpoint}`, {
            comments : comments,
            email : userEmail
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
    // setTimeout(function() {
    //     location.reload();  // Refresh the page to update the request status
    // }, 1000); // Add delay before page refresh

    // Hide confirmation dialog and enable buttons
    cancelConfirmation();
}

// ยกเลิกการยืนยันและปิดกล่อง
function cancelConfirmation() {
    document.getElementById('confirmationDialog').style.display = 'none';
    document.getElementById('approveButton').removeAttribute('disabled');
    document.getElementById('rejectButton').removeAttribute('disabled');
}

//use for testing can improve and edit or use it to implement with the using one
// Simulated data from database
//อันนี้ผมใช้ทดสอบว่าตอนคลิกเลือกเพื่อยืนยันสามารถทำได้ไหม เอาขึ้นมาให้ก่อนเผื่อมีอะไรครับ
/*
const requests = [
    {
        id: 1,
        studentName: "นายตัวอย่าง นามสกุล",
        studentId: "6009610426",
        faculty: "วิทยาศาสตร์และเทคโนโลยี",
        major: "วิทยาการคอมพิวเตอร์",
        year: "3",
        requestType: "คำร้องทั่วไป",
        details: "ขอเพิ่มรายวิชา CS240"
    },
    {
        id: 2,
        studentName: "นางสาวทดสอบ ระบบ",
        studentId: "6009610427",
        faculty: "วิทยาศาสตร์และเทคโนโลยี",
        major: "วิทยาการคอมพิวเตอร์",
        year: "2",
        requestType: "คำร้องลาพักการศึกษา",
        details: "ขอลาพักการศึกษา 1 ภาคการศึกษา เนื่องจากปัญหาสุขภาพ"
    }
];

function createRequestElement(request) {
    const previewDiv = document.createElement('div');
    previewDiv.className = 'request-preview';
    previewDiv.innerHTML = `
        <div>
            <strong>${request.studentName}</strong> - ${request.requestType}
        </div>
    `;

const detailsDiv = document.createElement('div');
detailsDiv.className = 'request-details';
detailsDiv.innerHTML = `
    <div class="form-group">
        <label>ชื่อ-นามสกุล</label>
        <input type="text" class="form-control" value="${request.studentName}" readonly>
    </div>
    <div class="form-group">
        <label>รหัสนักศึกษา</label>
        <input type="text" class="form-control" value="${request.studentId}" readonly>
    </div>
    <div class="form-group">
        <label>คณะ</label>
        <input type="text" class="form-control" value="${request.faculty}" readonly>
    </div>
    <div class="form-group">
        <label>สาขา</label>
        <input type="text" class="form-control" value="${request.major}" readonly>
    </div>
    <div class="form-group">
        <label>ชั้นปี</label>
        <input type="text" class="form-control" value="${request.year}" readonly>
    </div>
    <div class="form-group">
        <label>ประเภทคำร้อง</label>
        <input type="text" class="form-control" value="${request.requestType}" readonly>
    </div>
    <div class="form-group">
        <label>รายละเอียด</label>
        <textarea class="form-control" readonly>${request.details}</textarea>
    </div>
    `;

    previewDiv.addEventListener('click', () => {
        const wasActive = previewDiv.classList.contains('active');
                
                // Reset all previews
                document.querySelectorAll('.request-preview').forEach(preview => {
                    preview.classList.remove('active');
                    preview.nextElementSibling.style.display = 'none';
                });

                if (!wasActive) {
                    previewDiv.classList.add('active');
                    detailsDiv.style.display = 'block';
                }
            });

            const wrapper = document.createElement('div');
            wrapper.appendChild(previewDiv);
            wrapper.appendChild(detailsDiv);
            return wrapper;
        }

        function populateRequests() {
            const requestsList = document.getElementById('requestsList');
            requests.forEach(request => {
                requestsList.appendChild(createRequestElement(request));
            });
        }

        function handleApproval(action) {
            const activeRequest = document.querySelector('.request-preview.active');
            if (!activeRequest) {
                alert('กรุณาเลือกคำร้องที่ต้องการ ' + (action === 'approve' ? 'อนุมัติ' : 'ปฏิเสธ'));
                return;
            }

            const comments = document.getElementById('comments').value;
            if (action === 'reject' && !comments.trim()) {
                alert('กรุณากรอกความคิดเห็นสำหรับการปฏิเสธคำร้อง');
                return;
            }

            // Here you would typically send this data to your server
            console.log('Action:', action);
            console.log('Comments:', comments);
            
            // Simulating server response
            setTimeout(() => {
                alert(`${action === 'approve' ? 'อนุมัติ' : 'ปฏิเสธ'}คำร้องเรียบร้อยแล้ว`);
                // Reset the form
                activeRequest.classList.remove('active');
                activeRequest.nextElementSibling.style.display = 'none';
                document.getElementById('comments').value = '';
            }, 1000);
        }

        // Initialize the page
        window.onload = populateRequests;
        */