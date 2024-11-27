const BASE_URL = 'http://localhost:3000';
const params = new URLSearchParams(window.location.search);
const searchKey = params.get('searchKey');
const type = params.get('type');
let mode = (type === "student") ? "WATCH" : 
           (type === "employee") ? "EDIT" : 
           (type === "dean" || type === "teacher") ? "VERIFY" : "DEFAULT";

window.onload = async () => {
    if (mode === "WATCH") {
        console.log(mode);
        try {
            const response = await axios.get(`${BASE_URL}/forms/${searchKey}`);
            console.log(response.data);
            const formDOM = document.getElementById('forms-container');

            //ตรวจสอบสถานะ
            const getStatus = (approvalValue) => {
                if (approvalValue == 1) return 'อนุมัติ';
                if (approvalValue == 0) return 'ไม่อนุมัติ';
                return 'รอการอนุมัติ';
            };

            let htmlData = '';
            for (let i = 0; i < response.data.length; i++) {
                let form = response.data[i];
                if(form.comments) {
                    htmlData += `<div class="form">
                    <p><strong>เรื่อง:</strong> ${form.subject}</p>
                    <p><strong>รหัสนักศีกษา:</strong> ${form.studentID}</p>
                    <p><strong>ชื่อ-นามสุกล:</strong> ${form.firstName + ' ' + form.lastName}</p>
                    <p><strong>เหตุผลที่ยื่นคําร้อง:</strong> ${form.purpose}</p>
                    <p><strong>อาจารย์ที่ปรึกษา:</strong> ${form.advisor}</p>
                    <p><strong>สถานะ:</strong></p>
                    <p><strong>อาจารย์ที่ปรึกษา:</strong> <span class="status">${getStatus(form.advisor_approved)}</span></p>
                    <p><strong>อาจารย์ผู้สอน:</strong> <span class="status">${getStatus(form.teacher_approved)}</span></p>
                    <p><strong>คณบดี:</strong> <span class="status">${getStatus(form.dean_approved)}</span></p>
                    <p><strong>ข้อเสนอแนะ:</strong>${form.comments}</p>
                    <button class="cancel-button" data-id="${form.id}">ยกเลิกคำร้อง</button>
                </div>`;
                }else {
                    htmlData += `<div class="form edit" data-id='${form.id}'>
                    <p><strong>เรื่อง:</strong> ${form.subject}</p>
                    <p><strong>รหัสนักศีกษา:</strong> ${form.studentID}</p>
                    <p><strong>ชื่อ-นามสุกล:</strong> ${form.firstName + ' ' + form.lastName}</p>
                    <p><strong>เหตุผลที่ยื่นคําร้อง:</strong> ${form.purpose}</p>
                    <p><strong>อาจารย์ที่ปรึกษา:</strong> ${form.advisor}</p>
                    <p><strong>สถานะ:</strong></p>
                    <p><strong>อาจารย์ที่ปรึกษา:</strong> <span class="status">${getStatus(form.advisor_approved)}</span></p>
                    <p><strong>อาจารย์ผู้สอน:</strong> <span class="status">${getStatus(form.teacher_approved)}</span></p>
                    <p><strong>คณบดี:</strong> <span class="status">${getStatus(form.dean_approved)}</span></p>
                    <button class="cancel-button" data-id="${form.id}">ยกเลิกคำร้อง</button>
                </div>`;
                }

            }
            formDOM.innerHTML = htmlData;

            const statusElements = document.querySelectorAll('.status');
            statusElements.forEach(status => {
                const statusText = status.textContent.trim();
                if (statusText === '0' || statusText === "ไม่อนุมัติ") {
                    status.textContent = "ไม่อนุมัติ";
                    status.style.color = 'red';
                } else if (statusText === '1' || statusText === "อนุมัติ") {
                    status.textContent = "อนุมัติ";
                    status.style.color = 'green';
                } else {
                    status.style.color = 'purple';
                }
            });

        } catch (error) {
            console.error("Error fetching forms:", error);
            const formDOM = document.getElementById('forms-container');
            if (formDOM) {
                //formDOM.innerHTML += "<p>Error loading data. Please try again later.</p>";
                document.getElementById('test_text_show').classList.toggle('active');
                formDOM.classList.toggle('none');
            }
        }
    } else if(mode ==="EDIT"){
        try {
            const response = await axios.get(`${BASE_URL}/forms/advisor/${searchKey}`);
            console.log(response.data);
            const formDOM = document.getElementById('forms-container');

            //ตรวจสอบสถานะ
            const getStatus = (approvalValue) => {
                if (approvalValue == 1) return 'อนุมัติ';
                if (approvalValue == 0) return 'ไม่อนุมัติ';
                return 'รอการอนุมัติ';
            };

            let htmlData = '';
            for (let i = 0; i < response.data.length; i++) {
                let form = response.data[i];
                if(form.comments) {
                    htmlData += 
                    `<div class="form edit" data-id='${form.id}'>
                        <p><strong>เรื่อง:</strong> ${form.subject}</p>
                        <p><strong>รหัสนักศึกษา:</strong> ${form.studentID}</p>
                        <p><strong>ชื่อ-นามสกุล:</strong> ${form.firstName} ${form.lastName}</p>
                        <p><strong>เหตุผลที่ยื่นคำร้อง:</strong> ${form.purpose}</p>
                        <p><strong>อาจารย์ที่ปรึกษา:</strong> ${form.advisor}</p>
                        <p><strong>สถานะ:</strong></p>
                        <p><strong>อาจารย์ที่ปรึกษา:</strong> <span class="status">${getStatus(form.advisor_approved)}</span></p>
                        <p><strong>อาจารย์ผู้สอน:</strong> <span class="status">${getStatus(form.teacher_approved)}</span></p>
                        <p><strong>คณบดี:</strong> <span class="status">${getStatus(form.dean_approved)}</span></p>
                        ${form.comments ? `<p><strong>ข้อเสนอแนะ:</strong> ${form.comments}</p>` : ''}
                    </div>`;
                }else {
                    htmlData += `<div class="form edit" data-id='${form.id}'>
                    <p><strong>เรื่อง:</strong> ${form.subject}</p>
                        <p><strong>รหัสนักศึกษา:</strong> ${form.studentID}</p>
                        <p><strong>ชื่อ-นามสกุล:</strong> ${form.firstName} ${form.lastName}</p>
                        <p><strong>เหตุผลที่ยื่นคำร้อง:</strong> ${form.purpose}</p>
                        <p><strong>อาจารย์ที่ปรึกษา:</strong> ${form.advisor}</p>
                        <p><strong>สถานะ:</strong></p>
                        <p><strong>อาจารย์ที่ปรึกษา:</strong> <span class="status">${getStatus(form.advisor_approved)}</span></p>
                        <p><strong>อาจารย์ผู้สอน:</strong> <span class="status">${getStatus(form.teacher_approved)}</span></p>
                        <p><strong>คณบดี:</strong> <span class="status">${getStatus(form.dean_approved)}</span></p>
                </div>`;
                }
            }
            formDOM.innerHTML = htmlData;

            const statusElements = document.querySelectorAll('.status');
            const items = document.getElementsByClassName("form");

            for (let i = 0; i < items.length; i++) {
                items[i].addEventListener("click", (event) => {
                    const id = event.currentTarget.dataset.id; // Use event.currentTarget to get the data-id
                    window.location.href = `request.html?searchKey=${id}&userName=test`;
                });
            }
            
            statusElements.forEach(status => {
                const statusText = status.textContent.trim();
                if (statusText === '0' || statusText === "ไม่อนุมัติ") {
                    status.textContent = "ไม่อนุมัติ";
                    
                    status.style.color = 'red';
                } else if (statusText === '1' || statusText === "อนุมัติ") {
                    status.textContent = "อนุมัติ";
                    status.style.color = 'green';
                } else {
                    status.style.color = 'purple';
                }
            });
        formDOM.classList.toggle('active');

        } catch (error) {
            console.error("Error fetching forms:", error);
            const formDOM = document.getElementById('forms-container');
            if (formDOM) {
                //formDOM.innerHTML += "<p>Error loading data. Please try again later.</p>";
                document.getElementById('test_text_show').classList.toggle('active');
                formDOM.classList.toggle('none');
            }
        }
    }else if (mode === "VERIFY") {
        try {
            const userType = type === "dean" ? "dean" : "teacher"; // ตรวจสอบว่าเป็น dean หรือ teacher
            const response = await axios.get(`${BASE_URL}/forms/${userType}/${searchKey}`); // ใช้ userType
            console.log(response.data);
            const formDOM = document.getElementById('forms-container');
    
            //ตรวจสอบสถานะ
            const getStatus = (approvalValue) => {
                if (approvalValue == 1) return 'อนุมัติ';
                if (approvalValue == 0) return 'ไม่อนุมัติ';
                return 'รอการอนุมัติ';
            };

            let htmlData = '';
            for (let i = 0; i < response.data.length; i++) {
                let form = response.data[i];
                if(form.comments) {
                    htmlData += `<div class="form edit" data-id ='${form.id}'>
                        <p><strong>เรื่อง:</strong> ${form.subject}</p>
                        <p><strong>รหัสนักศีกษา:</strong> ${form.studentID}</p>
                        <p><strong>ชื่อ-นามสุกล:</strong> ${form.firstName + ' ' + form.lastName}</p>
                        <p><strong>เหตุผลที่ยื่นคําร้อง:</strong> ${form.purpose}</p>
                        <p><strong>อาจารย์ที่ปรึกษา:</strong> ${form.advisor}</p>
                        <p><strong>สถานะ:</strong> <span class="status"></span></p>
                        <p><strong>อาจารย์ที่ปรึกษา:</strong> <span class="status">${getStatus(form.advisor_approved)}</span></p>
                        <p><strong>อาจารย์ผู้สอน:</strong> <span class="status">${getStatus(form.teacher_approved)}</span></p>
                        <p><strong>คณบดี:</strong> <span class="status">${getStatus(form.dean_approved)}</span></p>
                        ${form.comments ? `<p><strong>ข้อเสนอแนะ:</strong> ${form.comments}</p>` : ''}
                    </div>`;
                } else {
                    htmlData += `<div class="form edit" data-id ='${form.id}'>
                        <p><strong>เรื่อง:</strong> ${form.subject}</p>
                        <p><strong>รหัสนักศีกษา:</strong> ${form.studentID}</p>
                        <p><strong>ชื่อ-นามสุกล:</strong> ${form.firstName + ' ' + form.lastName}</p>
                        <p><strong>เหตุผลที่ยื่นคําร้อง:</strong> ${form.purpose}</p>
                        <p><strong>อาจารย์ที่ปรึกษา:</strong> ${form.advisor}</p>
                        <p><strong>สถานะ:</strong> <span class="status">${form.approved ?? 'รอการอนุมัติ'}</span></p>
                        <p><strong>อาจารย์ที่ปรึกษา:</strong> <span class="status">${getStatus(form.advisor_approved)}</span></p>
                        <p><strong>อาจารย์ผู้สอน:</strong> <span class="status">${getStatus(form.teacher_approved)}</span></p>
                        <p><strong>คณบดี:</strong> <span class="status">${getStatus(form.dean_approved)}</span></p>
                    </div>`;
                }
            }
            formDOM.innerHTML = htmlData;
    
            const statusElements = document.querySelectorAll('.status');
            const items = document.getElementsByClassName("form");
    
            for (let i = 0; i < items.length; i++) {
                items[i].addEventListener("click", (event) => {
                    const id = event.currentTarget.dataset.id; // ใช้ event.currentTarget เพื่อรับค่า data-id
                    window.location.href = `request_${userType}.html?searchKey=${id}&userName=${userType}`; // สำหรับทั้ง dean และ teacher
                });
            }
    
            statusElements.forEach(status => {
                const statusText = status.textContent.trim();
                if (statusText === '0' || statusText === "ไม่อนุมัติ") {
                    status.textContent = "ไม่อนุมัติ";
                    status.style.color = 'red';
                } else if (statusText === '1' || statusText === "อนุมัติ") {
                    status.textContent = "อนุมัติ";
                    status.style.color = 'green';
                } else {
                    status.style.color = 'purple';
                }
            });

        } catch (error) {
            console.error("Error fetching forms:", error);
            const formDOM = document.getElementById('forms-container');
            if (formDOM) {
                document.getElementById('test_text_show').classList.toggle('active');
                formDOM.classList.toggle('none');
            }
        }
    }
}

// การยกเลิกคำร้อง
document.addEventListener('click', async function(event) {
    // ตรวจสอบว่าปุ่มที่ถูกคลิกมีคลาส cancel-button หรือไม่
    if (event.target && event.target.classList.contains('cancel-button')) {
        const formId = event.target.getAttribute('data-id'); // ดึงค่า data-id ของคำร้องที่เลือก
        if (!formId) {
            alert("ไม่พบคำร้องที่เลือก");
            return;
        }

        const confirmCancel = confirm("คุณต้องการยกเลิกคำร้องนี้หรือไม่?");
        if (!confirmCancel) return;

        try {
            const response = await axios.delete(`${BASE_URL}/forms/${formId}`);
            if (response.status === 200) {
                alert("ยกเลิกคำร้องเรียบร้อยแล้ว");
                // หลีกเลี่ยงการรีเฟรชหน้าทั้งหมด
                const formContainer = event.target.closest('.form'); // หาคอนเทนเนอร์ของคำร้องที่ถูกยกเลิก
                if (formContainer) {
                    formContainer.remove(); // ลบคำร้องที่ถูกยกเลิกออกจากหน้าจอ
                }
            } else {
                alert("เกิดข้อผิดพลาดในการยกเลิกคำร้อง");
            }
        } catch (error) {
            console.error("Error cancelling request:", error);
            alert("ไม่สามารถยกเลิกคำร้องได้");
        }
    }
});
