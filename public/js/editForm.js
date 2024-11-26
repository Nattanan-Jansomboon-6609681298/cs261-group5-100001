const BASE_URL = 'http://localhost:3000';
const params = new URLSearchParams(window.location.search);
const formId = params.get('formId');

let mainBox = document.getElementById('main_box');
let showForm = document.getElementById('show_form');
let showMoreForm = document.getElementById('show_more_form');
let reSignHide = document.getElementById('resign_hide');
let selectedForm;

window.onload = async () => {
    if (formId) {
        try {
            const response = await axios.get(`${BASE_URL}/forms/edit/${formId}`);
            const formData = response.data;
            console.log(formData);

            // ค้นหา object ที่ตรงกับ formId
            const selectedForm = formData.find(form => form.id == formId);
            console.log(selectedForm)
            if (selectedForm) {
                if (selectedForm.subject === 'ลาออก') {
                    console.log(1)
                    showForm.classList.add('active');
                    showMoreForm.classList.add('active');
                    reSignHide.classList.toggle('none');

                    // กำหนดค่าลงในช่อง input
                    document.getElementById('subject').innerHTML = `<b>${selectedForm.subject || ''}</b>`;
                    document.getElementById('fname').value = selectedForm.firstName || '';
                    document.getElementById('lname').value = selectedForm.lastName || '';
                    document.getElementById('id').value = selectedForm.studentID || '';
                    document.getElementById('year').value = selectedForm.year || '';
                    document.getElementById('address_number').value = selectedForm.addressNumber || '';
                    document.getElementById('district').value = selectedForm.district || '';
                    document.getElementById('country').value = selectedForm.subdistrict || '';
                    document.getElementById('province').value = selectedForm.province || '';
                    document.getElementById('phone_number').value = selectedForm.contactNumber || '';
                    document.getElementById('phone_parent').value = selectedForm.parentContactNumber || '';
                    document.getElementById('teacher').value = selectedForm.advisor || '';
                    document.getElementById('course_section').value = selectedForm.semester || '';
                    document.getElementById('reason').value = selectedForm.purpose || '';
                    document.getElementById('course_code').value = selectedForm.courseCode || '';
                } else {
                    console.log(2)
                    showForm.classList.add('active');
                    document.getElementById('subject').innerHTML = `<b>${selectedForm.subject || ''}</b>`;
                    document.getElementById('fname').value = selectedForm.firstName || '';
                    document.getElementById('lname').value = selectedForm.lastName || '';
                    document.getElementById('id').value = selectedForm.studentID || '';
                    document.getElementById('year').value = selectedForm.year || '';
                    document.getElementById('address_number').value = selectedForm.addressNumber || '';
                    document.getElementById('district').value = selectedForm.district || '';
                    document.getElementById('country').value = selectedForm.subdistrict || '';
                    document.getElementById('province').value = selectedForm.province || '';
                    document.getElementById('phone_number').value = selectedForm.contactNumber || '';
                    document.getElementById('phone_parent').value = selectedForm.parentContactNumber || '';
                    document.getElementById('teacher').value = selectedForm.advisor || '';
                    document.getElementById('academic_semester').value = selectedForm.semester || '';
                    document.getElementById('reason').value = selectedForm.purpose || '';
                    document.getElementById('course_code').value = selectedForm.courseCode || '';
                    document.getElementById('course_name').value = selectedForm.courseName || '';
                    document.getElementById('section').value = selectedForm.section || '';
                    document.getElementById('course_section').value = selectedForm.semester || '';
                    document.getElementById('reason').value = selectedForm.purpose || '';
                }
            } else {
                console.error("Form not found!");
                alert("ไม่พบฟอร์มที่ต้องการ");
            }
        } catch (error) {
            console.error("Error loading form details:", error);
            alert("ไม่สามารถโหลดข้อมูลฟอร์มได้");
        }
    } else {
        console.error("Form ID is not provided in the URL.");
        alert("กรุณาระบุ Form ID ใน URL");
    }
};

// Handle form submission when the user updates the form
document.getElementById('submit').addEventListener('click', async () => {
    const formId = new URLSearchParams(window.location.search).get('formId'); // Get formId from URL
    if (!formId) {
        alert("Form ID is missing.");
        return;
    }

    // Collect updated data from the form
    const formData = {
        id: formId,
        studentID: document.getElementById('id').value,
        subject: document.getElementById('subject').innerText,
        firstName: document.getElementById('fname').value,
        lastName: document.getElementById('lname').value,
        year: document.getElementById('year').value,
        addressNumber: document.getElementById('address_number').value,
        subdistrict: document.getElementById('country').value,
        district: document.getElementById('district').value,
        province: document.getElementById('province').value,
        contactNumber: document.getElementById('phone_number').value,
        parentContactNumber: document.getElementById('phone_parent').value,
        advisor: document.getElementById('teacher').value,
        semester: document.getElementById('academic_semester').value,
        courseCode: document.getElementById('course_code').value,
        courseName: document.getElementById('course_name').value,
        section: document.getElementById('section').value,
        purpose: document.getElementById('reason').value,
        // comments: "", // Optional: Add a field for comments if needed
        // email: "", // Optional: Add a field for email if needed
    };

    try {
        // Send the updated data to the backend
        const response = await axios.put(`${BASE_URL}/forms/student/edit/${formId}`, formData);
        alert(response.data.message || "Updated successfully!");
    } catch (error) {
        console.error("Error updating form:", error);
        alert("Error updating the form.");
    }
});
