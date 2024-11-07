document.getElementById('submitRequestForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    // Collect form data
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
    const signName = document.getElementById('sign_name').value;
    const date = document.getElementById('date').value;

    // Create request data object
    const requestData = {
        fname,
        lname,
        id,
        year,
        addressNumber,
        district,
        country,
        province,
        phoneNumber,
        phoneParent,
        teacher,
        courseSection,
        courseCode,
        courseName,
        section,
        reason,
        signName,
        date,
        status: 'Pending'
    };

    try {
        // Send POST request to API endpoint
        const response = await fetch('/api/requests', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestData)
        });

        // Parse and handle the response
        const result = await response.json();

        if (response.ok) {
            document.getElementById('message').textContent = 'Request submitted successfully!';
            document.getElementById('message').style.color = 'green';
            document.getElementById('submitRequestForm').reset();
        } else {
            document.getElementById('message').textContent = result.message || 'Error submitting request.';
            document.getElementById('message').style.color = 'red';
        }
    } catch (error) {
        document.getElementById('message').textContent = 'An error occurred. Please try again later.';
        document.getElementById('message').style.color = 'red';
    }
});