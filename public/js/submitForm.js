const BASE_URL = 'http://localhost:3000';
const params = new URLSearchParams(window.location.search);
const studentID = params.get('studentID'); 
const type = params.get('type');
const userEmail = params.get('email');
document.getElementById('submitRequestForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const subject = document.getElementById('subject').innerText;
    const fname = document.getElementById('fname').value;
    const lname = document.getElementById('lname').value;
    const id = document.getElementById('id').value;
    const year = document.getElementById('year').value;
    const addressNumber = document.getElementById('address_number').value;
    const district = document.getElementById('district').value;
    const country = document.getElementById('country').value;
    const province = document.getElementById('province').value;
    const phoneNumber = document.getElementById('phone_number').value;
    const phoneParent = document.getElementById('phone_parent').value;
    const teacher = document.getElementById('teacher').value;
    const courseSection = document.getElementById('course_section').value;
    const courseCode = document.getElementById('course_code').value;
    const courseName = document.getElementById('course_name').value;
    const section = document.getElementById('section').value;
    const reason = document.getElementById('reason').value;


    const formData = {
        studentID : id,
        subject: subject,
        firstName : fname,
        lastName : lname,
        year : year,
        addressNumber : addressNumber,
        contactNumber : phoneNumber,
        parentContactNumber : phoneParent,
        purpose : reason,
        advisor : teacher,
        semester : courseSection,
        courseCode : courseCode,
        courseName : courseName,
        section : section,
        subdistrict : district,
        district : country,
        province : province,
        email : userEmail
    };

    try {
        let res = await axios.post( `${BASE_URL}/forms`, formData);
        console.log(res);
    
        if (res.status === 200 && res.data.status === 200) { 
            document.getElementById('message').textContent = 'Request submitted successfully!';
            document.getElementById('message').style.color = 'green';
            document.getElementById('submitRequestForm').reset();
        } else {
            throw res.data.message;
        }
    
    } catch (error) {
        console.log(error.message)
        document.getElementById('message').textContent = 'An error occurred. Please try again later.';
    }
});

document.getElementById('submit').addEventListener('click', () => {
    // ตรวจสอบฟิลด์ที่จำเป็น
    const requiredFields = [
        'fname', 'lname', 'id', 'year', 
        'address_number', 'district', 'country', 
        'province', 'phone_number', 'phone_parent', 
        'teacher', 'course_section', 'course_code', 
        'course_name', 'section', 'reason'
    ];

    let isFormValid = true;
    for (let field of requiredFields) {
        const fieldValue = document.getElementById(field).value.trim();
        if (!fieldValue) {
            isFormValid = false;
            document.getElementById(field).style.border = '2px solid red'; // ไฮไลต์ฟิลด์ที่ขาดหายไป
        } else {
            document.getElementById(field).style.border = ''; // รีเซ็ตถ้ามีข้อมูล
        }
    }

    // แสดงการแจ้งเตือนถ้าข้อมูลไม่ครบถ้วน
    if (!isFormValid) {
        alert("กรุณากรอกข้อมูลให้ครบทุกช่องที่จำเป็น");
        return; // หยุดการทำงานถ้าข้อมูลไม่ครบ
    }

    // ถ้าข้อมูลครบถ้วน
    alert("คุณได้ส่งคำร้องเรียบร้อยแล้ว");
    window.location.href = `forms.html?searchKey=${studentID}&type=${type}`; 
});