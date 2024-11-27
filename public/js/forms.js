const BASE_URL = 'http://localhost:3000';
const params = new URLSearchParams(window.location.search);
const searchKey = params.get('searchKey');
const type = params.get('type');
let mode = (type === "student") ? "WATCH" : 
           (type === "employee") ? "EDIT" : 
           (type === "dean" || type === "teacher") ? "VERIFY" : "DEFAULT";

window.onload = async () => {
    await loadRequestDetail();
};

function isPastDate(date) {
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0); // ตั้งเป็นเวลา 00:00 ของวันนี้
    const selectedDate = new Date(date);
    selectedDate.setHours(0, 0, 0, 0); // ตั้งเป็นเวลา 00:00 ของวันที่เลือก
    return selectedDate < currentDate; 
}

async function updateAppointmentStatus(formID, action, type) {
    if(type === 'teacher') {
        try {
            const response = await axios.put(`${BASE_URL}/appointment/teacher/update/${formID}/${action}`);
            console.log(`Update successful for form ID ${formID}:`, response.data);
        } catch (error) {
            console.error(`Error updating status for form ID ${formID}:`, error);
            alert('เกิดข้อผิดพลาดในการอัปเดตสถานะ');
        }
    } else if(type === 'employee') {
        try {
            const response = await axios.put(`${BASE_URL}/appointment/advisor/update/${formID}/${action}`);
            console.log(`Update successful for form ID ${formID}:`, response.data);
    
            // อัปเดตสถานะในหน้าเว็บ
            const formElement = document.querySelector(`.form[data-id="${formID}"]`);
            const statusElement = formElement.querySelector('.status');
            // if (action === '1') {
            //     statusElement.textContent = 'อนุมัติ';
            //     statusElement.style.color = 'green';
            // } else {
            //     statusElement.textContent = 'ไม่อนุมัติ';
            //     statusElement.style.color = 'red';
            // }
        } catch (error) {
            console.error(`Error updating status for form ID ${formID}:`, error);
            alert('เกิดข้อผิดพลาดในการอัปเดตสถานะ');
        }
    }

}


async function loadRequestDetail() {
    if (mode === "WATCH") {
        console.log(mode);
        try {
            const response = await axios.get(`${BASE_URL}/forms/${searchKey}`);
            console.log(response.data);
            const formDOM = document.getElementById('forms-container');

            const getStatus = (approvalValue) => {
                if (approvalValue == 1) return 'อนุมัติ';
                if (approvalValue == 0) return 'ไม่อนุมัติ';
                return 'รอการอนุมัติ';
            };

            let htmlData = '';
        for (let i = 0; i < response.data.length; i++) {
            let form = response.data[i];
            let formID = response.data[i].id;
            console.log(formID);
            const apmResponse = await axios.get(`${BASE_URL}/appointment/${formID}`);
            const apm = apmResponse.data[0];
            let advisor_date;
            let teacher_date;
            // let advisorAPM_status;
            // let teacherAPM_status;
            // // if(apm == null) {
            //     advisorAPM_status = 'ไม่ได้นัดหมาย';
            //     teacherAPM_status = 'ไม่ได้นัดหมาย';
            // } else {
            //     advisorAPM_status = apm.advisor_approved == 1 ? 'ผ่าน':'ปฎิเสธ';
            //     teacherAPM_status = apm.teacher_approved == 1 ? 'ผ่าน':'ปฎิเสธ';
            // }
            const options = {
                timeZone: 'Asia/Bangkok',
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
            };

            if(apm?.advisor_date) {
                let advisorDateObj = new Date(apm.advisor_date);
                advisor_date = advisorDateObj.toLocaleString('th-TH', options);
            }else {
                advisor_date = 'ไม่ได้นัดหมาย';
            }
            if(apm?.teacher_date) {
                let teacherDateObj = new Date(apm.teacher_date);
                teacher_date = teacherDateObj.toLocaleString('th-TH', options);
            }else {
                teacher_date = 'ไม่ได้นัดหมาย';
            }


            console.log(advisor_date); 
            console.log(teacher_date); 
            console.log(apmResponse.data);
            console.log(apm);
            if (apmResponse.data.length === 0) {
                if(form.subject === 'ลาออก') {
                    htmlData += `<div class="form" data-id='${form.id}'>
                    <p><strong>เรื่อง:</strong> ${form.subject}</p>
                    <p id="studentID" data-id="${form.studentID}"><strong>รหัสนักศีกษา:</strong> ${form.studentID}</p>
                    <p id="fullName" data-firstname="${form.firstName}" data-lastname="${form.lastName}"><strong>ชื่อ-นามสุกล:</strong> ${form.firstName + ' ' + form.lastName}</p>
                    <p><strong>เหตุผลที่ยื่นคําร้อง:</strong> ${form.purpose}</p>
                    <p><strong>อาจารย์ที่ปรึกษา:</strong> ${form.advisor}</p>
                    <p><strong>สถานะ:</strong></p>
                    <p id="advisor" data-advisor="${form.advisor}"><strong>อาจารย์ที่ปรึกษา:</strong> <span class="status">${form.advisor_approved ?? 'รอการอนุมัติ'}</span></p>
                    <p><strong>อาจารย์ผู้สอน:</strong> <span class="status">${getStatus(form.teacher_approved)}</span></p>
                    <p><strong>คณบดี:</strong> <span class="status">${getStatus(form.dean_approved)}</span></p>
                    <form>
                        <label for="appointment_date"><strong>ขอนัดหมายอาจารย์ที่ปรึกษา:</strong></label>
                        <input type="date" class="appointment_advisor" name="date">
                    </form>
                    <p><strong>ข้อเสนอแนะ:</strong>${form.comments ?? ''}</p>
                    <div class="btn-container">
                        <button class="appointment_btn">นัดหมาย<button>
                    </div>
                    <button class="cancel-button" data-id="${form.id}">ยกเลิกคำร้อง</button>
                </div>`;
                }
                else {
                    htmlData += `<div class="form" data-id='${form.id}'>
                    <p><strong>เรื่อง:</strong> ${form.subject}</p>
                    <p id="studentID" data-id="${form.studentID}"><strong>รหัสนักศีกษา:</strong> ${form.studentID}</p>
                    <p id="fullName" data-firstname="${form.firstName}" data-lastname="${form.lastName}"><strong>ชื่อ-นามสุกล:</strong> ${form.firstName + ' ' + form.lastName}</p>
                    <p><strong>เหตุผลที่ยื่นคําร้อง:</strong> ${form.purpose}</p>
                    <p><strong>อาจารย์ที่ปรึกษา:</strong> ${form.advisor}</p>
                    <p><strong>สถานะ:</strong></p>
                    <p id="advisor" data-advisor="${form.advisor}"><strong>อาจารย์ที่ปรึกษา:</strong> <span class="status">${form.advisor_approved ?? 'รอการอนุมัติ'}</span></p>
                    <p id="teacher" data-teacher="${form.teacher}"><strong>อาจารย์ผู้สอน:</strong> <span class="status">${form.teacher_approved ?? 'รอการอนุมัติ'}</span></p>
                    <p><strong>คณบดี:</strong> <span class="status">${getStatus(form.dean_approved)}</span></p>
                    <form>
                        <label for="appointment_date"><strong>ขอนัดหมายอาจารย์ที่ปรึกษา:</strong></label>
                        <input type="date" class="appointment_advisor" name="date">
                    </form>
                    <form>
                        <label for="appointment_date"><strong>ขอนัดหมายอาจารย์ผู้สอน:</strong></label>
                        <input type="date" class="appointment_teacher" name="date">
                    </form>                    
                    <p><strong>ข้อเสนอแนะ:</strong>${form.comments ?? ''}</p>
                    <div class="btn-container">
                        <button class="appointment_btn">นัดหมาย<button>
                    </div>
                    <button class="cancel-button" data-id="${form.id}">ยกเลิกคำร้อง</button>
                </div>`;
                }

            } else {
                if(form.subject === 'ลาออก') {
                    htmlData += `<div class="form" data-id='${form.id}'>
                    <p><strong>เรื่อง:</strong> ${form.subject}</p>
                    <p id="studentID" data-id="${form.studentID}"><strong>รหัสนักศีกษา:</strong> ${form.studentID}</p>
                    <p id="fullName" data-firstname="${form.firstName}" data-lastname="${form.lastName}"><strong>ชื่อ-นามสุกล:</strong> ${form.firstName + ' ' + form.lastName}</p>
                    <p><strong>เหตุผลที่ยื่นคําร้อง:</strong> ${form.purpose}</p>
                    <p id="advisor" data-advisor="${form.advisor}"><strong>อาจารย์ที่ปรึกษา:</strong> <span class="status">${form.advisor_approved?? 'รอการอนุมัติ'}</span></p>
                    <p><strong>วันนัดหมายอาจาร์ที่ปรึกษา:</strong> ${advisor_date} <span class="status">${apm.advisor_approved?? 'รอการอนุมัติ'}</span></p>
                    <p><strong>คณบดี:</strong> <span class="status">${form.approved ?? 'รอการอนุมัติ'}</span></p>
                    <button class="cancel-button" data-id="${form.id}">ยกเลิกคำร้อง</button>
                </div>`;
                }
                else {
                    // if(advisor_approved) {
                    //     console.log("advisor_approved != null")
                    // } else {
                    //     console.log("advisor_approved = null")
                    // }
                    htmlData += `<div class="form" data-id='${form.id}'>
                    <p><strong>เรื่อง:</strong> ${form.subject}</p>
                    <p id="studentID" data-id="${form.studentID}"><strong>รหัสนักศีกษา:</strong> ${form.studentID}</p>
                    <p id="fullName" data-firstname="${form.firstName}" data-lastname="${form.lastName}"><strong>ชื่อ-นามสุกล:</strong> ${form.firstName + ' ' + form.lastName}</p>
                    <p><strong>เหตุผลที่ยื่นคําร้อง:</strong> ${form.purpose}</p>
                    <p id="advisor" data-advisor="${form.advisor}"><strong>อาจารย์ที่ปรึกษา:</strong> <span class="status">${form.advisor_approved ?? 'รอการอนุมัติ'}</span></p>
                    <p><strong>วันนัดหมายอาจาร์ที่ปรึกษา:</strong> ${advisor_date} <span class="status">${apm.advisor_approved ?? 'รอการอนุมัติ'}</span></p>
                    <p id="teacher" data-teacher="${form.teacher}"><strong>อาจารย์ผู้สอน:</strong> <span class="status">${form.teacher_approved ?? 'รอการอนุมัติ'}</span></p>
                    <p><strong>วันนัดหมายอาจารย์ผู้สอน:</strong> ${teacher_date} <span class="status">${apm.teacher_approved ?? 'รอการอนุมัติ'}</span></p>
                    <p><strong>คณบดี:</strong> <span class="status">${form.dean_approved ?? 'รอการอนุมัติ'}</span></p>
                    <button class="cancel-button" data-id="${form.id}">ยกเลิกคำร้อง</button>
                </div>`;
                }
            }
        }
        formDOM.innerHTML = htmlData;

        const dateInputs = document.querySelectorAll('input[type="date"]');
        dateInputs.forEach(item => {
            item.addEventListener("change", () => {
                const date = item.value;
                if (date && isPastDate(date)) {
                    alert("ไม่สามารถเลือกวันที่ในอดีตได้สำหรับวันที่อาจารย์ที่ปรึกษา");
                    item.value = ""; // Clear the date
                } else {
                    console.log(`วันที่เลือก: ${date}`);
                }
            });
            
        });

        const appointmentBtns = document.getElementsByClassName('appointment_btn');
        for (let btn of appointmentBtns) {
            btn.style.background = "rgb(88, 102, 255)";
            btn.style.borderRadius = "7px";
            btn.addEventListener("click", async (event) => {
                const formElement = event.currentTarget.closest('.form');
                if (!formElement) {
                    console.error("Error: Form element not found!");
                    return;
                }

                const id = formElement.dataset.id;
                if (!id) {
                    console.error("Error: Form ID is missing!");
                    return;
                }

                const advisorDateInput = formElement.querySelector('.appointment_advisor');
                const teacherDateInput = formElement.querySelector('.appointment_teacher');

                const advisor_date = advisorDateInput?.value || null;
                const teacher_date = teacherDateInput?.value || null;
                

                    // ตรวจสอบเมื่อมีการเปลี่ยนแปลงวันที่ 
                    // if (advisorDateInput) {
                    //     advisorDateInput.addEventListener('change', () => {
                    //         const advisor_date = advisorDateInput.value;
                    //         if (advisor_date && isPastDate(advisor_date)) {
                    //             alert("ไม่สามารถเลือกวันที่ในอดีตได้สำหรับวันที่อาจารย์ที่ปรึกษา");
                    //             advisorDateInput.value = ""; // Clear the date
                    //         } else {
                    //             console.log(`วันที่อาจารย์ที่ปรึกษาเลือก: ${advisor_date}`);
                    //         }
                    //     });
                    // }
                    // if (teacherDateInput) {
                    //     teacherDateInput.addEventListener('change', () => {
                    //         const teacher_date = teacherDateInput.value;
                    //         if (teacher_date && isPastDate(teacher_date)) {
                    //             alert("ไม่สามารถเลือกวันที่ในอดีตได้สำหรับวันที่อาจารย์ผู้สอน");
                    //             teacherDateInput.value = ""; // Clear the date
                    //         } else {
                    //             console.log(`วันที่อาจารย์ผู้สอนเลือก: ${teacher_date}`);
                    //         }
                    //     });
                    // }

                    // function isPastDate(date) {
                    //     const currentDate = new Date();
                    //     currentDate.setHours(0, 0, 0, 0); // ตั้งเป็นเวลา 00:00 ของวันนี้
                    //     const selectedDate = new Date(date);
                    //     selectedDate.setHours(0, 0, 0, 0); // ตั้งเป็นเวลา 00:00 ของวันที่เลือก
                    //     return selectedDate < currentDate; 
                    // }

                if(advisor_date === null && teacher_date === null) {
                    alert("กรุณาระบุวันที่นัดหมาย");
                    return;
                }

                // ยืนยันจากผู้ใช้ก่อนดำเนินการ
                const confirmAction = confirm("การนัดหมายสามารถทำได้เพียงครั้งเดียว ท่านต้องการดำเนินการต่อไหม?");
                if (!confirmAction) {
                    console.log("การดำเนินการถูกยกเลิก");
                    return; // หากผู้ใช้ไม่ยืนยัน ก็จะหยุดการดำเนินการ
                }

                const fullNameElement = formElement.querySelector('#fullName');
                if (!fullNameElement) {
                    console.error("Error: Full Name element not found!");
                    return;
                }
                const firstName = fullNameElement.dataset.firstname || "Unknown";
                const lastName = fullNameElement.dataset.lastname || "Unknown";

                const studentIDElement = formElement.querySelector('#studentID');
                const studentID = studentIDElement?.dataset.id || "Unknown";

                const advisorElement = formElement.querySelector('#advisor');
                const advisor = advisorElement?.dataset.advisor || "Unknown";

                const teacherElement = formElement.querySelector('#teacher');
                const teacher = teacherElement?.dataset.teacher || "Unknown";

                console.log("Form ID:", id);
                console.log("Student ID:", studentID);
                console.log("Advisor:", advisor);
                console.log("Advisor Appointment Date:", advisor_date);
                console.log("Teacher:", teacher);
                console.log("Teacher Appointment Date:", teacher_date);
                console.log("First Name:", firstName);
                console.log("Last Name:", lastName);

                const data = {
                    formID : id,
                    studentID,
                    advisor,
                    teacher,
                    advisor_date,
                    teacher_date,
                    firstName,
                    lastName,
                };
                console.log(data);

                try {
                    const response = await axios.post(`${BASE_URL}/appointment`, data);
                    console.log("Response:", response.data);
                    alert("นัดหมายสําเร็จ");
                    await  loadRequestDetail();
                } catch (error) {
                    if(error.response.status === 500) {
                        alert("กรุณาใส่ข้อมูลให้ครบถ้วน");
                        return;
                    }
                    console.error("Error:", error.response ? error.response.data : error.message);
                }
            });
        }

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
    } else if (mode === "EDIT") {
        console.log(mode);
        try {
            const response = await axios.get(`${BASE_URL}/forms/advisor/${searchKey}`);
            console.log(response.data);
    
            const formDOM = document.getElementById('forms-container');
            if (!formDOM) {
                console.error("Forms container not found");
                return;
            }
    
            const getStatus = (approvalValue) => {
                if (approvalValue == 1) return 'อนุมัติ';
                if (approvalValue == 0) return 'ไม่อนุมัติ';
                return 'รอการอนุมัติ';
            };
    
            let htmlData = '';
            for (let i = 0; i < response.data.length; i++) {
                const form = response.data[i];
    
                // Check if form and required properties exist
                if (!form || form.id === undefined || form.advisor_approved === undefined) {
                    console.warn(`Invalid form data at index ${i}:`, form);
                    continue; // Skip this form and continue with the next one
                }
    
                const id = form.id;
                let apmResponse = { data: [] }; // Default value if no appointment data is found
                let apm = null;
                let date = 'ไม่ได้นัดหมาย'; // Default value if no appointment found
    
                try {
                    // Fetch appointment data
                    apmResponse = await axios.get(`${BASE_URL}/appointment/advisor/${id}/${searchKey}`);
                    console.log(apmResponse.data);
    
                    if (apmResponse.data.length > 0) {
                        apm = apmResponse.data[0];
                        console.log(apm.advisor_approved);
                        if (apm.advisor_date) {
                            const options = {
                                timeZone: 'Asia/Bangkok',
                                year: 'numeric',
                                month: '2-digit',
                                day: '2-digit',
                            };
                            const advisorDateObj = new Date(apm.advisor_date);
                            date = advisorDateObj.toLocaleString('th-TH', options);
                        }
                    }
                    else {
                        date = "ไม่ได้นัดหมาย";
                    }
                } catch (apmError) {
                    console.warn(`Error fetching appointment data for form ID ${id}:`, apmError);
                }
    
                // Build the HTML structure
                if(apm == null) {
                    console.log("apm == null")
                    htmlData += `
                    <div class="form edit" data-id="${form.id}">
                        <p><strong>เรื่อง:</strong> ${form.subject}</p>
                        <p><strong>รหัสนักศึกษา:</strong> ${form.studentID}</p>
                        <p><strong>ชื่อ-นามสกุล:</strong> ${form.firstName + ' ' + form.lastName}</p>
                        <p><strong>เหตุผลที่ยื่นคำร้อง:</strong> ${form.purpose}</p>
                        <p><strong>อาจารย์ที่ปรึกษา:</strong> ${form.advisor}</p>
                        <p><strong>อาจารย์ที่ปรึกษา:</strong> <span class="status">${getStatus(form.advisor_approved)}</span></p>
                        <p><strong>อาจารย์ผู้สอน:</strong> <span class="status">${getStatus(form.teacher_approved)}</span></p>
                        <p><strong>คณบดี:</strong> <span class="status">${getStatus(form.dean_approved)}</span></p>
                        <p><strong>วันที่นัดหมาย:</strong>ไม่ได้นัดหมาย</p>
                    </div>`;
                continue;
                }
                if (apmResponse.data.length === 0 || apm.advisor_approved != null) {
                    console.log("apmResponse.data.length == 0 || apm.advisor_approved != null")
                    // No appointment or decision already made (approved/rejected)
                    console.log("apm", apm);
                    if(apm.advisor_approved == 0) {
                        console.log("apmResponse.advisor_approved ==0")
                        console.log("")
                        htmlData += `
                        <div class="form edit" data-id="${form.id}">
                            <p><strong>เรื่อง:</strong> ${form.subject}</p>
                            <p><strong>รหัสนักศึกษา:</strong> ${form.studentID}</p>
                            <p><strong>ชื่อ-นามสกุล:</strong> ${form.firstName + ' ' + form.lastName}</p>
                            <p><strong>เหตุผลที่ยื่นคำร้อง:</strong> ${form.purpose}</p>
                            <p><strong>อาจารย์ที่ปรึกษา:</strong> ${form.advisor}</p>
                            <p><strong>อาจารย์ที่ปรึกษา:</strong> <span class="status">${getStatus(form.advisor_approved)}</span></p>
                            <p><strong>อาจารย์ผู้สอน:</strong> <span class="status">${getStatus(form.teacher_approved)}</span></p>
                            <p><strong>คณบดี:</strong> <span class="status">${getStatus(form.dean_approved)}</span></p>
                            <p><strong>วันที่นัดหมาย:</strong> ไม่ได้นัดหมาย</p>
                        </div>`;
                    } else {
                        console.log("apmResponse.advisor_approved != 0")
                        htmlData += `
                        <div class="form edit" data-id="${form.id}">
                            <p><strong>เรื่อง:</strong> ${form.subject}</p>
                            <p><strong>รหัสนักศึกษา:</strong> ${form.studentID}</p>
                            <p><strong>ชื่อ-นามสกุล:</strong> ${form.firstName + ' ' + form.lastName}</p>
                            <p><strong>เหตุผลที่ยื่นคำร้อง:</strong> ${form.purpose}</p>
                            <p><strong>อาจารย์ที่ปรึกษา:</strong> ${form.advisor}</p>
                            <p><strong>อาจารย์ที่ปรึกษา:</strong> <span class="status">${getStatus(form.advisor_approved)}</span></p>
                            <p><strong>อาจารย์ผู้สอน:</strong> <span class="status">${getStatus(form.teacher_approved)}</span></p>
                            <p><strong>คณบดี:</strong> <span class="status">${getStatus(form.dean_approved)}</span></p>
                            <p><strong>วันที่นัดหมาย:</strong> ${date}</p>
                        </div>`;
                    }

                } else {
                    console.log("ตรงกันข้าม apmResponse.data.length === 0 || apm.advisor_approved != null")
                    htmlData += `
                        <div class="form edit" data-id="${form.id}">
                            <p><strong>เรื่อง:</strong> ${form.subject}</p>
                            <p><strong>รหัสนักศึกษา:</strong> ${form.studentID}</p>
                            <p><strong>ชื่อ-นามสกุล:</strong> ${form.firstName + ' ' + form.lastName}</p>
                            <p><strong>เหตุผลที่ยื่นคำร้อง:</strong> ${form.purpose}</p>
                            <p><strong>อาจารย์ที่ปรึกษา:</strong> ${form.advisor}</p>
                            <p><strong>อาจารย์ที่ปรึกษา:</strong> <span class="status">${getStatus(form.advisor_approved)}</span></p>
                            <p><strong>อาจารย์ผู้สอน:</strong> <span class="status">${getStatus(form.teacher_approved)}</span></p>
                            <p><strong>คณบดี:</strong> <span class="status">${getStatus(form.dean_approved)}</span></p>
                            <p><strong>วันนัดหมาย:</strong>${date}</span></p>
                            <div class="advisor-action-container">
                                <p>นักศึกษาต้องการนัดหมายวันที่ ${date}</p>
                                <div>
                                    <!-- Check if decision already made (either approved or rejected) -->

                                        <button class="approved-btn" data-id="${form.id}" data-action="1">ยอมรับ</button>
                                        <button class="reject-btn" data-id="${form.id}" data-action="0">ปฏิเสธ</button>
                                </div>
                            </div>
                        </div>`;
                }
            }
    
            // Update the DOM
            formDOM.innerHTML = htmlData;
    
            // Add event listeners to .form elements
            const forms = document.querySelectorAll('.form');
            forms.forEach((form) => {
                form.addEventListener('click', (event) => {
                    const id = event.currentTarget.dataset.id;
                    console.log(id);
                    window.location.href = `request.html?searchKey=${id}&userName=test`;
                });
            });
    
            // Add event listeners to buttons
            const approveButtons = document.querySelectorAll('.approved-btn');
            const rejectButtons = document.querySelectorAll('.reject-btn');
    
            approveButtons.forEach((button) => {
                button.addEventListener('click', async (event) => {
                    event.stopPropagation(); // Prevent triggering the .form click event
                    const formID = event.target.dataset.id;
                    const action = event.target.dataset.action;
                    await updateAppointmentStatus(formID, action, type);
                    await loadRequestDetail();
                });
            });
    
            rejectButtons.forEach((button) => {
                button.addEventListener('click', async (event) => {
                    event.stopPropagation(); // Prevent triggering the .form click event
                    const formID = event.target.dataset.id;
                    const action = event.target.dataset.action;
                    date = 'ไม่ได้นัดหมาย';
                    await updateAppointmentStatus(formID, action, type);
                    await loadRequestDetail();
                });
            });
    
            // Update status elements' styles
            const statusElements = document.querySelectorAll('.status');
            statusElements.forEach((status) => {
                const statusText = status.textContent.trim();
                if (statusText === '0' || statusText === 'ไม่อนุมัติ') {
                    status.textContent = 'ไม่อนุมัติ';
                    status.style.color = 'red';
                } else if (statusText === '1' || statusText === 'อนุมัติ') {
                    status.textContent = 'อนุมัติ';
                    status.style.color = 'green';
                } else {
                    status.style.color = 'purple';
                }
            });
    
            formDOM.classList.add('active');
        } catch (error) {
            console.error("Error fetching forms:", error);
    
            const formDOM = document.getElementById('forms-container');
            const errorText = document.getElementById('test_text_show');
            if (formDOM) formDOM.classList.add('none');
            if (errorText) errorText.classList.add('active');
        }

    } else if (mode === "VERIFY") {
        console.log(mode);
        let endpoint;
        if (type === 'dean') {
            endpoint = `${BASE_URL}/forms/request/dean`;
        } else if (type === 'teacher') {
            endpoint = `${BASE_URL}/forms/${type}/${searchKey}`;
        }
    
        try {
            const response = await axios.get(endpoint);
            console.log(response.data);
    
            const formDOM = document.getElementById('forms-container');
    
            const getStatus = (approvalValue) => {
                if (approvalValue == 1) return 'อนุมัติ';
                if (approvalValue == 0) return 'ไม่อนุมัติ';
                return 'รอการอนุมัติ';
            };
    
            let htmlData = '';
            for (let i = 0; i < response.data.length; i++) {
                let form = response.data[i];
    
                // Check if type is 'teacher' and fetch appointment details for teacher
                if (type === 'teacher') {
                    const apmResponse = await axios.get(`${BASE_URL}/appointment/teacher/${form.id}/${type}`);
                    const apm = apmResponse.data[0];
                    console.log("test:", apm)
    
                    let date;
                    const options = {
                        timeZone: 'Asia/Bangkok',
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                    };
    
                    if (apm?.teacher_date) {
                        let appointmentDateObj = new Date(apm.teacher_date);
                        date = appointmentDateObj.toLocaleString('th-TH', options);
                    } else {
                        date = 'ไม่ได้นัดหมาย';
                    }
    
                    if(apm == null) {
                        console.log("apm == null");
                        htmlData += `
                        <div class="form edit" data-id='${form.id}'>
                            <p><strong>เรื่อง:</strong> ${form.subject}</p>
                            <p><strong>รหัสนักศึกษา:</strong> ${form.studentID}</p>
                            <p><strong>ชื่อ-นามสกุล:</strong> ${form.firstName} ${form.lastName}</p>
                            <p><strong>เหตุผลที่ยื่นคำร้อง:</strong> ${form.purpose}</p>
                            <p><strong>อาจารย์ที่ปรึกษา:</strong> ${form.advisor}</p>
                            <p><strong>อาจารย์ที่ปรึกษา:</strong> <span class="status">${getStatus(form.advisor_approved)}</span></p>
                            <p><strong>อาจารย์ผู้สอน:</strong> <span class="status">${getStatus(form.teacher_approved)}</span></p>
                            <p><strong>คณบดี:</strong> <span class="status">${getStatus(form.dean_approved)}</span></p>
                            <p><strong>วันที่นัดหมาย:</strong> ${date}</p>
                            ${form.comments ? `<p><strong>ข้อเสนอแนะ:</strong> ${form.comments}</p>` : ''}
                        </div>
                    `;
                    continue;
                    }
                    if(apm.teacher_approved != null) {
                        if(apm.teacher_approved == 1) {
                            console.log("apm.teacher_approved == 1");
                            htmlData += `
                            <div class="form edit" data-id='${form.id}'>
                                <p><strong>เรื่อง:</strong> ${form.subject}</p>
                                <p><strong>รหัสนักศึกษา:</strong> ${form.studentID}</p>
                                <p><strong>ชื่อ-นามสกุล:</strong> ${form.firstName} ${form.lastName}</p>
                                <p><strong>เหตุผลที่ยื่นคำร้อง:</strong> ${form.purpose}</p>
                                <p><strong>อาจารย์ที่ปรึกษา:</strong> ${form.advisor}</p>
                                <p><strong>อาจารย์ที่ปรึกษา:</strong> <span class="status">${getStatus(form.advisor_approved)}</span></p>
                                <p><strong>อาจารย์ผู้สอน:</strong> <span class="status">${getStatus(form.teacher_approved)}</span></p>
                                <p><strong>คณบดี:</strong> <span class="status">${getStatus(form.dean_approved)}</span></p>
                                <p><strong>วันที่นัดหมาย:</strong> ${date}</p>
                                ${form.comments ? `<p><strong>ข้อเสนอแนะ:</strong> ${form.comments}</p>` : ''}
                            </div>
                        `;
                        }
                        else {
                            console.log("apm.teacher_approved == 2");
                            htmlData += `
                            <div class="form edit" data-id='${form.id}'>
                                <p><strong>เรื่อง:</strong> ${form.subject}</p>
                                <p><strong>รหัสนักศึกษา:</strong> ${form.studentID}</p>
                                <p><strong>ชื่อ-นามสกุล:</strong> ${form.firstName} ${form.lastName}</p>
                                <p><strong>เหตุผลที่ยื่นคำร้อง:</strong> ${form.purpose}</p>
                                <p><strong>อาจารย์ที่ปรึกษา:</strong> ${form.advisor}</p>
                                <p><strong>อาจารย์ที่ปรึกษา:</strong> <span class="status">${getStatus(form.advisor_approved)}</span></p>
                                <p><strong>อาจารย์ผู้สอน:</strong> <span class="status">${getStatus(form.teacher_approved)}</span></p>
                                <p><strong>คณบดี:</strong> <span class="status">${getStatus(form.dean_approved)}</span></p>
                                <p><strong>วันที่นัดหมาย:</strong>ไม่ได้นัดมาย</p>
                                ${form.comments ? `<p><strong>ข้อเสนอแนะ:</strong> ${form.comments}</p>` : ''}
                            </div>
                        `;
                        }

                    } else {
                        console.log("apm.teacher_approved == null");
                        htmlData += `
                        <div class="form edit" data-id='${form.id}'>
                            <p><strong>เรื่อง:</strong> ${form.subject}</p>
                            <p><strong>รหัสนักศึกษา:</strong> ${form.studentID}</p>
                            <p><strong>ชื่อ-นามสกุล:</strong> ${form.firstName} ${form.lastName}</p>
                            <p><strong>เหตุผลที่ยื่นคำร้อง:</strong> ${form.purpose}</p>
                            <p><strong>อาจารย์ที่ปรึกษา:</strong> ${form.advisor}</p>
                            <p><strong>อาจารย์ที่ปรึกษา:</strong> <span class="status">${getStatus(form.advisor_approved)}</span></p>
                            <p><strong>อาจารย์ผู้สอน:</strong> <span class="status">${getStatus(form.teacher_approved)}</span></p>
                            <p><strong>คณบดี:</strong> <span class="status">${getStatus(form.dean_approved)}</span></p>
                            ${form.comments ? `<p><strong>ข้อเสนอแนะ:</strong> ${form.comments}</p>` : ''}
                            <div class="advisor-action-container">
                                <p>นักศึกษาต้องการนัดหมายวันที่ ${date}</p>
                                <div>
                                    <!-- Check if decision already made (either approved or rejected) -->

                                        <button class="approved-btn" data-id="${form.id}" data-action="1">ยอมรับ</button>
                                        <button class="reject-btn" data-id="${form.id}" data-action="0">ปฏิเสธ</button>
                                </div>
                            </div>
                        </div>
                    `;
                    }

                } else {
                    console.log("type == dean")
                    if(form.subject === 'ลาออก') {
                        htmlData += `
                        <div class="form edit" data-id='${form.id}'>
                            <p><strong>เรื่อง:</strong> ${form.subject}</p>
                            <p><strong>รหัสนักศึกษา:</strong> ${form.studentID}</p>
                            <p><strong>ชื่อ-นามสกุล:</strong> ${form.firstName} ${form.lastName}</p>
                            <p><strong>เหตุผลที่ยื่นคำร้อง:</strong> ${form.purpose}</p>
                            <p><strong>อาจารย์ที่ปรึกษา:</strong> <span class="status">${getStatus(form.advisor_approved)}</span></p>
                            <p><strong>คณบดี:</strong> <span class="status">${getStatus(form.dean_approved)}</span></p>
                            ${form.comments ? `<p><strong>ข้อเสนอแนะ:</strong> ${form.comments}</p>` : ''}
                        </div>
                    `;
                    }
                    else {
                        htmlData += `
                        <div class="form edit" data-id='${form.id}'>
                            <p><strong>เรื่อง:</strong> ${form.subject}</p>
                            <p><strong>รหัสนักศึกษา:</strong> ${form.studentID}</p>
                            <p><strong>ชื่อ-นามสกุล:</strong> ${form.firstName} ${form.lastName}</p>
                            <p><strong>เหตุผลที่ยื่นคำร้อง:</strong> ${form.purpose}</p>
                            <p><strong>อาจารย์ที่ปรึกษา:</strong> <span class="status">${getStatus(form.advisor_approved)}</span></p>
                            <p><strong>อาจารย์ผู้สอน:</strong> <span class="status">${getStatus(form.teacher_approved)}</span></p>
                            <p><strong>คณบดี:</strong> <span class="status">${getStatus(form.dean_approved)}</span></p>
                            ${form.comments ? `<p><strong>ข้อเสนอแนะ:</strong> ${form.comments}</p>` : ''}
                        </div>
                    `;

                    }
                }
            }
    
            formDOM.innerHTML = htmlData;
    
            // Handle status elements
            const statusElements = document.querySelectorAll('.status');
            statusElements.forEach((status) => {
                const statusText = status.textContent.trim();
                if (statusText === '0' || statusText === 'ไม่อนุมัติ') {
                    status.textContent = 'ไม่อนุมัติ';
                    status.style.color = 'red';
                } else if (statusText === '1' || statusText === 'อนุมัติ') {
                    status.textContent = 'อนุมัติ';
                    status.style.color = 'green';
                } else {
                    status.style.color = 'purple';
                }
            });
    
            // Handle form item clicks
            const items = document.getElementsByClassName("form");
            for (let i = 0; i < items.length; i++) {
                items[i].addEventListener("click", (event) => {
                    const id = event.currentTarget.dataset.id; // Use event.currentTarget to get the data-id
                    window.location.href = `request_${type}.html?searchKey=${id}&userName=${type}`; // For both dean and teacher
                });
            }
    
            if(type === 'teacher') {
                            // Add event listeners to approve/reject buttons
            const approveButtons = document.querySelectorAll('.approved-btn');
            const rejectButtons = document.querySelectorAll('.reject-btn');
    
            approveButtons.forEach((button) => {
                button.addEventListener('click', async (event) => {
                    event.stopPropagation(); // Prevent triggering the .form click event
                    const formID = event.target.dataset.id;
                    const action = event.target.dataset.action;
                    await updateAppointmentStatus(formID, action, type);
                    await loadRequestDetail();
                });
            });
    
            rejectButtons.forEach((button) => {
                button.addEventListener('click', async (event) => {
                    event.stopPropagation(); // Prevent triggering the .form click event
                    const formID = event.target.dataset.id;
                    const action = event.target.dataset.action;
                    await updateAppointmentStatus(formID, action, type);
                    await loadRequestDetail();
                });
            });
            }

    
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
    
    
     //else if (mode === "VERIFY") {
    //     try {
    //         const userType = type === "dean" ? "dean" : "teacher"; // ตรวจสอบว่าเป็น dean หรือ teacher
    //         const response = await axios.get(`${BASE_URL}/forms/${userType}/${searchKey}`); // ใช้ userType
    //         console.log(response.data);
    //         const formDOM = document.getElementById('forms-container');
    
    //         //ตรวจสอบสถานะ
    //         const getStatus = (approvalValue) => {
    //             if (approvalValue == 1) return 'อนุมัติ';
    //             if (approvalValue == 0) return 'ไม่อนุมัติ';
    //             return 'รอการอนุมัติ';
    //         };
    
    //         let htmlData = '';
    //         for (let i = 0; i < response.data.length; i++) {
    //             let form = response.data[i];
    //             htmlData += `
    //                 <div class="form edit" data-id='${form.id}'>
    //                     <p><strong>เรื่อง:</strong> ${form.subject}</p>
    //                     <p><strong>รหัสนักศึกษา:</strong> ${form.studentID}</p>
    //                     <p><strong>ชื่อ-นามสกุล:</strong> ${form.firstName} ${form.lastName}</p>
    //                     <p><strong>เหตุผลที่ยื่นคำร้อง:</strong> ${form.purpose}</p>
    //                     <p><strong>อาจารย์ที่ปรึกษา:</strong> ${form.advisor}</p>
    //                     <p><strong>สถานะ:</strong></p>
    //                     <p><strong>อาจารย์ที่ปรึกษา:</strong> <span class="status">${getStatus(form.advisor_approved)}</span></p>
    //                     <p><strong>อาจารย์ผู้สอน:</strong> <span class="status">${getStatus(form.teacher_approved)}</span></p>
    //                     <p><strong>คณบดี:</strong> <span class="status">${getStatus(form.dean_approved)}</span></p>
                        
    //                     ${form.comments ? `<p><strong>ข้อเสนอแนะ:</strong> ${form.comments}</p>` : ''}
    //                 </div>
    //             `;
    //         }
    //         formDOM.innerHTML = htmlData;
    
    //         const statusElements = document.querySelectorAll('.status');
    //         const items = document.getElementsByClassName("form");

    //         // เพิ่ม event listener เพื่อเปลี่ยนเส้นทางไปยังหน้ารายละเอียดฟอร์ม
    
    //         for (let i = 0; i < items.length; i++) {
    //             items[i].addEventListener("click", (event) => {
    //                 const id = event.currentTarget.dataset.id; // ใช้ event.currentTarget เพื่อดึง data-id
    //                 window.location.href = `request_dean.html?searchKey=${id}&userName=dean`;
    //             });
    //         }

    //         statusElements.forEach(status => {
    //             const statusText = status.textContent.trim();
    //             if (statusText === '0' || statusText === "ไม่อนุมัติ") {
    //                 status.textContent = "ไม่อนุมัติ";
    //                 status.style.color = 'red';
    //             } else if (statusText === '1' || statusText === "อนุมัติ") {
    //                 status.textContent = "อนุมัติ";
    //                 status.style.color = 'green';
    //             } else {
    //                 status.style.color = 'purple';
    //             }
    //         });

    //     } catch (error) {
    //         console.error("Error fetching forms:", error);
    //         const formDOM = document.getElementById('forms-container');
    //         if (formDOM) {
    //             document.getElementById('test_text_show').classList.toggle('active');
    //             formDOM.classList.toggle('none');
    //         }
    //     }
    // }


function editForm(formId) {
    window.location.href = `editForm.html?formId=${formId}`;
}