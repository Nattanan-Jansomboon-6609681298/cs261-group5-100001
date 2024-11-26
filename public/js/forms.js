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
                    <p id="advisor" data-advisor="${form.advisor}"><strong>อาจารย์ที่ปรึกษา:</strong> <span class="status">${form.approved ?? 'รอการอนุมัติ'}</span></p>
                    <form>
                        <label for="appointment_date"><strong>ขอนัดหมายอาจารย์ที่ปรึกษา:</strong></label>
                        <input type="date" class="appointment_advisor" name="date">
                    </form>
                    
                    <p><strong>คณบดี:</strong> <span class="status">${form.dean_approved ?? 'รอการอนุมัติ'}</span></p>
                    <div class="btn-container">
                        <button class="appointment_btn">นัดหมาย<button>
                    </div>
                </div>`;
                }
                else {
                    htmlData += `<div class="form" data-id='${form.id}'>
                    <p><strong>เรื่อง:</strong> ${form.subject}</p>
                    <p id="studentID" data-id="${form.studentID}"><strong>รหัสนักศีกษา:</strong> ${form.studentID}</p>
                    <p id="fullName" data-firstname="${form.firstName}" data-lastname="${form.lastName}"><strong>ชื่อ-นามสุกล:</strong> ${form.firstName + ' ' + form.lastName}</p>
                    <p><strong>เหตุผลที่ยื่นคําร้อง:</strong> ${form.purpose}</p>
                    <p id="advisor" data-advisor="${form.advisor}"><strong>อาจารย์ที่ปรึกษา:</strong> <span class="status">${form.approved ?? 'รอการอนุมัติ'}</span></p>
                    <form>
                        <label for="appointment_date"><strong>ขอนัดหมายอาจารย์ที่ปรึกษา:</strong></label>
                        <input type="date" class="appointment_advisor" name="date">
                    </form>
                    <p id="teacher" data-teacher="${form.teacher}"><strong>อาจารย์ผู้สอน:</strong> <span class="status">${form.teacher_approved ?? 'รอการอนุมัติ'}</span></p>
                    <form>
                        <label for="appointment_date"><strong>ขอนัดหมายอาจารย์ผู้สอน:</strong></label>
                        <input type="date" class="appointment_teacher" name="date">
                    </form>
                    <p><strong>คณบดี:</strong> <span class="status">${form.dean_approved ?? 'รอการอนุมัติ'}</span></p>
                    <div class="btn-container">
                        <button class="appointment_btn">นัดหมาย<button>
                    </div>
                </div>`;
                }

            } else {
                if(form.subject === 'ลาออก') {
                    htmlData += `<div class="form" data-id='${form.id}'>
                    <p><strong>เรื่อง:</strong> ${form.subject}</p>
                    <p id="studentID" data-id="${form.studentID}"><strong>รหัสนักศีกษา:</strong> ${form.studentID}</p>
                    <p id="fullName" data-firstname="${form.firstName}" data-lastname="${form.lastName}"><strong>ชื่อ-นามสุกล:</strong> ${form.firstName + ' ' + form.lastName}</p>
                    <p><strong>เหตุผลที่ยื่นคําร้อง:</strong> ${form.purpose}</p>
                    <p id="advisor" data-advisor="${form.advisor}"><strong>อาจารย์ที่ปรึกษา:</strong> <span class="status">${form.approved ?? 'รอการอนุมัติ'}</span></p>
                    <p><strong>วันนัดหมายอาจาร์ที่ปรึกษา:</strong> ${advisor_date}</p>
                    <p><strong>คณบดี:</strong> <span class="status">${form.approved ?? 'รอการอนุมัติ'}</span></p>
                </div>`;
                }
                else {
                    htmlData += `<div class="form" data-id='${form.id}'>
                    <p><strong>เรื่อง:</strong> ${form.subject}</p>
                    <p id="studentID" data-id="${form.studentID}"><strong>รหัสนักศีกษา:</strong> ${form.studentID}</p>
                    <p id="fullName" data-firstname="${form.firstName}" data-lastname="${form.lastName}"><strong>ชื่อ-นามสุกล:</strong> ${form.firstName + ' ' + form.lastName}</p>
                    <p><strong>เหตุผลที่ยื่นคําร้อง:</strong> ${form.purpose}</p>
                    <p id="advisor" data-advisor="${form.advisor}"><strong>อาจารย์ที่ปรึกษา:</strong> <span class="status">${form._advisor_approved ?? 'รอการอนุมัติ'}</span></p>
                    <p><strong>วันนัดหมายอาจาร์ที่ปรึกษา:</strong> ${advisor_date}</p>
                    <p id="teacher" data-teacher="${form.teacher}"><strong>อาจารย์ผู้สอน:</strong> <span class="status">${form.teacher_approved ?? 'รอการอนุมัติ'}</span></p>
                    <p><strong>วันนัดหมายอาจารย์ผู้สอน:</strong> ${teacher_date}</p>
                    <p><strong>คณบดี:</strong> <span class="status">${form.dean_approved ?? 'รอการอนุมัติ'}</span></p>
                </div>`;
                }
            }
        }
        formDOM.innerHTML = htmlData;

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

                // ฟังก์ชันตรวจสอบวันที่เก่ากว่าปัจจุบัน
                function isPastDate(date) {
                    const currentDate = new Date();
                    currentDate.setHours(0, 0, 0, 0); 
                    const selectedDate = new Date(date);
                    selectedDate.setHours(0, 0, 0, 0); 
                    return selectedDate < currentDate;
                }

                // ตรวจสอบเมื่อมีการเปลี่ยนแปลงวันที่
                advisorDateInput.addEventListener('change', (event) => {
                    const advisor_date = advisorDateInput.value;
                    if (advisor_date && isPastDate(advisor_date)) {
                        alert("ไม่สามารถเลือกวันที่ในอดีตได้สำหรับวันที่อาจารย์ที่ปรึกษา");
                        advisorDateInput.value = ""; // ล้างวันที่
                    }
                });

                teacherDateInput.addEventListener('change', (event) => {
                    const teacher_date = teacherDateInput.value;
                    if (teacher_date && isPastDate(teacher_date)) {
                        alert("ไม่สามารถเลือกวันที่ในอดีตได้สำหรับวันที่อาจารย์ผู้สอน");
                        teacherDateInput.value = ""; // ล้างวันที่
                    }
                });

                const advisor_date = advisorDateInput?.value || null;
                const teacher_date = teacherDateInput?.value || null;

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
    } else if(mode ==="EDIT"){
        console.log(mode);
        try {
            const response = await axios.get(`${BASE_URL}/forms/advisor/${searchKey}`);
            const apmResponse = await axios.get(`${BASE_URL}/appointment/`)
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
                if(form.comments) {
                    htmlData += `<div class="form edit" data-id ='${form.id}'>
                    <p><strong>เรื่อง:</strong> ${form.subject}</p>
                    <p><strong>รหัสนักศีกษา:</strong> ${form.studentID}</p>
                    <p><strong>ชื่อ-นามสุกล:</strong> ${form.firstName + ' ' + form.lastName}</p>
                    <p><strong>เหตุผลที่ยื่นคําร้อง:</strong> ${form.purpose}</p>
                    <p><strong>อาจารย์ที่ปรึกษา:</strong> ${form.advisor}</p>
                    <p><strong>สถานะ:</strong></p>
                    <p><strong>อาจารย์ที่ปรึกษา:</strong> <span class="status">${getStatus(form.advisor_approved)}</span></p>
                    <p><strong>อาจารย์ผู้สอน:</strong> <span class="status">${getStatus(form.teacher_approved)}</span></p>
                    <p><strong>คณบดี:</strong> <span class="status">${getStatus(form.dean_approved)}</span></p>
                    ${form.comments ? `<p><strong>ข้อเสนอแนะ:</strong> ${form.comments}</p>` : ''}
                </div>`;
                }
                else {
                    htmlData += `<div class="form edit" data-id ='${form.id}'>
                    <p><strong>เรื่อง:</strong> ${form.subject}</p>
                    <p><strong>รหัสนักศีกษา:</strong> ${form.studentID}</p>
                    <p><strong>ชื่อ-นามสุกล:</strong> ${form.firstName + ' ' + form.lastName}</p>
                    <p><strong>เหตุผลที่ยื่นคําร้อง:</strong> ${form.purpose}</p>
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
                    console.log(id);
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
        console.log(mode);
        let endpoint;
        if(type === 'dean') {
            endpoint = `${BASE_URL}/forms/request/dean`;
        }else if(type === 'teacher'){
            endpoint= `${BASE_URL}/forms/${type}/${searchKey}`
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
                htmlData += `
                    <div class="form edit" data-id='${form.id}'>
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
                    </div>
                `;
            }
            formDOM.innerHTML = htmlData;
    
            const statusElements = document.querySelectorAll('.status');
            const items = document.getElementsByClassName("form");
    
            for (let i = 0; i < items.length; i++) {
                items[i].addEventListener("click", (event) => {
                    const id = event.currentTarget.dataset.id; // ใช้ event.currentTarget เพื่อรับค่า data-id
                    window.location.href = `request_${type}.html?searchKey=${id}&userName=${type}`; // สำหรับทั้ง dean และ teacher
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
        //formDOM.classList.toggle('active');

        } catch (error) {
            console.error("Error fetching forms:", error);
            const formDOM = document.getElementById('forms-container');
            if (formDOM) {
                //formDOM.innerHTML += "<p>Error loading data. Please try again later.</p>";
                document.getElementById('test_text_show').classList.toggle('active');
                formDOM.classList.toggle('none');
            }
        }
    } //else if (mode === "VERIFY") {
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
}