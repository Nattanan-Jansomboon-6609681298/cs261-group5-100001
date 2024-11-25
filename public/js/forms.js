const BASE_URL = 'http://localhost:3000';
const params = new URLSearchParams(window.location.search);
const searchKey = params.get('searchKey');
const type = params.get('type');
let mode = type === "student" ? "WATCH" : "EDIT";

window.onload = async () => {
    if (mode === "WATCH") {
        console.log(mode);
        try {
            const response = await axios.get(`${BASE_URL}/forms/${searchKey}`);
            console.log(response.data);
            const formDOM = document.getElementById('forms-container');

            let htmlData = '';
for (let i = 0; i < response.data.length; i++) {
    let form = response.data[i];
    if (form.subject === 'ลาออก') {
        htmlData += `<div class="form" data-id='${form.id}'>
            <p><strong>เรื่อง:</strong> ${form.subject}</p>
            <p id="studentID" data-id="${form.studentID}"><strong>รหัสนักศีกษา:</strong> ${form.studentID}</p>
            <p id="fullName" data-firstname="${form.firstName}" data-lastname="${form.lastName}"><strong>ชื่อ-นามสุกล:</strong> ${form.firstName + ' ' + form.lastName}</p>
            <p><strong>เหตุผลที่ยื่นคําร้อง:</strong> ${form.purpose}</p>
            <p><strong>สถานะ:</strong> <span class="status">${form.approved ?? ''}</span></p>
            <p id="advisor" data-advisor="${form.advisor}"><strong>อาจารย์ที่ปรึกษา:</strong> <span class="status">${form.approved ?? 'รอการอนุมัติ'}</span></p>
            <form>
                <label for="appointment_date"><strong>ขอนัดหมาย:</strong></label>
                <input type="date" class="appointment_advisor" name="date">
            </form>
            <p><strong>คณบดี:</strong> <span class="status">${form.approved ?? 'รอการอนุมัติ'}</span></p>
            <button class="appointment_btn">นัดหมาย<button>
        </div>`;
    } else {
        htmlData += `<div class="form" data-id='${form.id}'>
            <p><strong>เรื่อง:</strong> ${form.subject}</p>
            <p id="studentID" data-id="${form.studentID}"><strong>รหัสนักศีกษา:</strong> ${form.studentID}</p>
            <p id="fullName" data-firstname="${form.firstName}" data-lastname="${form.lastName}"><strong>ชื่อ-นามสุกล:</strong> ${form.firstName + ' ' + form.lastName}</p>
            <p><strong>เหตุผลที่ยื่นคําร้อง:</strong> ${form.purpose}</p>
            <p id="advisor" data-advisor="${form.advisor}"><strong>อาจารย์ที่ปรึกษา:</strong> <span class="status">${form.approved ?? 'รอการอนุมัติ'}</span></p>
            <form>
                <label for="appointment_date"><strong>ขอนัดหมาย:</strong></label>
                <input type="date" class="appointment_advisor" name="date">
            </form>
            <p><strong>อาจารย์ผู้สอน:</strong> <span class="status">${form.approved ?? 'รอการอนุมัติ'}</span></p>
            <form>
                <label for="appointment_date"><strong>ขอนัดหมาย:</strong></label>
                <input type="date" class="appointment_teacher" name="date">
            </form>
            <p><strong>คณบดี:</strong> <span class="status">${form.approved ?? 'รอการอนุมัติ'}</span></p>
            <button class="appointment_btn">นัดหมาย<button>
        </div>`;
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

        const advisor_date = advisorDateInput?.value || null;
        const teacher_date = teacherDateInput?.value || null;

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

        console.log("Form ID:", id);
        console.log("Student ID:", studentID);
        console.log("Advisor:", advisor);
        console.log("Advisor Appointment Date:", advisor_date);
        console.log("Teacher Appointment Date:", teacher_date);
        console.log("First Name:", firstName);
        console.log("Last Name:", lastName);

        const data = {
            studentID,
            advisor,
            advisor_date,
            teacher_date,
            firstName,
            lastName,
        };

        try {
            const response = await axios.post(`${BASE_URL}/appointment`, data);
            console.log("Response:", response.data);
            alert("นัดหมายสําเร็จ");
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
    } else {
        try {
            const response = await axios.get(`${BASE_URL}/forms/advisor/${searchKey}`);
            console.log(response.data);
            const formDOM = document.getElementById('forms-container');

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
                    <p><strong>สถานะ:</strong> <span class="status">${form.approved ?? 'รอการอนุมัติ'}</span></p>
                    <p><strong>ข้อเสนอแนะ:</strong>${form.comments}</p>
                </div>`;
                }
                else {
                    htmlData += `<div class="form edit" data-id ='${form.id}'>
                    <p><strong>เรื่อง:</strong> ${form.subject}</p>
                    <p><strong>รหัสนักศีกษา:</strong> ${form.studentID}</p>
                    <p><strong>ชื่อ-นามสุกล:</strong> ${form.firstName + ' ' + form.lastName}</p>
                    <p><strong>เหตุผลที่ยื่นคําร้อง:</strong> ${form.purpose}</p>
                    <p><strong>อาจารย์ที่ปรึกษา:</strong> ${form.advisor}</p>
                    <p><strong>สถานะ:</strong> <span class="status">${form.approved ?? 'รอการอนุมัติ'}</span></p>
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
    }
};
