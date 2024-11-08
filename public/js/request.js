async function requestFormOutput(requestId) {
    try {
        const response = await fetch(`/api/requests/${requestId}`);
        const request = await response.json();

        if (response.ok) {
            document.getElementById('requestFormOutput').innerHTML = `
        <h3>Request Form Output</h3>
        <p>ชื่อ: <span>${data.fname}</span></p>
        <p>นามสกุล: <span>${data.lname}</span></p>
        <p>รหัสนักศึกษา: <span>${data.id}</span></p>
        <p>ชั้นปี: <span>${data.year}</span></p>
        <p>บ้านเลขที่: <span>${data.addressNumber}</span></p>
        <p>ตำบล: <span>${data.district}</span></p>
        <p>ประเทศ: <span>${data.country}</span></p>
        <p>จังหวัด: <span>${data.province}</span></p>
        <p>เบอร์โทรศัพท์: <span>${data.phoneNumber}</span></p>
        <p>เบอร์โทรผู้ปกครอง: <span>${data.phoneParent}</span></p>
        <p>อาจารย์ที่ปรึกษา: <span>${data.teacher}</span></p>
        <p>หมวดวิชา: <span>${data.courseSection}</span></p>
        <p>รหัสวิชา: <span>${data.courseCode}</span></p>
        <p>ชื่อวิชา: <span>${data.courseName}</span></p>
        <p>หมวดวิชา: <span>${data.section}</span></p>
        <p>เหตุผล: <span>${data.reason}</span></p>
        <p>ลงชื่อ: <span>${data.signName}</span></p>
        <p>วันที่: <span>${data.date}</span></p>
        <p>สถานะ: <span>${data.status}</span></p>
            `;
        } else {
            document.getElementById('requestFormOutput').textContent = 'Unable to load request details';
        }
    } catch (error) {
        document.getElementById('requestFormOutput').textContent = 'Error loading request';
    }
}

// Load request details when the page is loaded
document.addEventListener('DOMContentLoaded', () => {
    loadRequestDetails('REQUEST_ID');  // Replace 'REQUEST_ID' with actual ID
});

// Show the confirmation dialog
function confirmApprove(requestId) {
    document.getElementById('confirmationDialog').style.display = 'block';
    document.getElementById('approveButton').setAttribute('disabled', true);  // Disable the approve button during confirmation
    document.getElementById('rejectButton').setAttribute('disabled', true);   // Disable the reject button during confirmation
    window.selectedRequestId = requestId;
    window.selectedAction = 'approve';
}

function confirmReject(requestId) {
    document.getElementById('confirmationDialog').style.display = 'block';
    document.getElementById('approveButton').setAttribute('disabled', true);  // Disable the approve button during confirmation
    document.getElementById('rejectButton').setAttribute('disabled', true);   // Disable the reject button during confirmation
    window.selectedRequestId = requestId;
    window.selectedAction = 'reject';
}

// Finalize the approval or rejection after confirmation
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

        if (response.ok) {
            document.getElementById('message').textContent = `Request ${action}d successfully!`;
            document.getElementById('message').style.color = 'green';
        } else {
            document.getElementById('message').textContent = `Failed to ${action} request`;
            document.getElementById('message').style.color = 'red';
        }
    } catch (error) {
        document.getElementById('message').textContent = `Error ${action}ing request`;
        document.getElementById('message').style.color = 'red';
    }


    // Refresh the page after action is completed
    setTimeout(function() {
        location.reload();  // Refresh the page to update the request status
    }, 1000); // Add delay before page refresh

    // Hide confirmation dialog and enable buttons
    cancelConfirmation();
}

// Cancel the confirmation and close the dialog
function cancelConfirmation() {
    document.getElementById('confirmationDialog').style.display = 'none';
    document.getElementById('approveButton').removeAttribute('disabled');
    document.getElementById('rejectButton').removeAttribute('disabled');
}
