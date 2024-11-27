let mainBox = document.getElementById('main_box');
let showForm = document.getElementById('show_form');
let showMoreForm = document.getElementById('show_more_form');

let registOradd = document.getElementById('regist/add');
let reMove = document.getElementById('remove');
let reQuest = document.getElementById('request');
let reSign = document.getElementById('resign');
let submitButton = document.getElementById('submit');
let bottonChoice = document.getElementById('text_botton');
let reSignHide = document.getElementById('resign_hide');


bottonChoice.addEventListener("click",function(){
    registOradd.classList.toggle('active');
    reMove.classList.toggle('active');
    reQuest.classList.toggle('active');
    reSign.classList.toggle('active');
})


registOradd.addEventListener("click",function(){
    document.getElementById('subject').innerHTML = "เรื่อง<b>จดทะเบียน/เพิ่มถอน<b>";
    showForm.classList.toggle('active');
    reMove.classList.toggle('none');
    reQuest.classList.toggle('none');
    reSign.classList.toggle('none');
});

reMove.addEventListener("click",function(){
    document.getElementById('subject').innerHTML = "เรื่อง<b>ขอถอนวิชา/ถอนรายวิชา<b>";
    showForm.classList.toggle('active');
    registOradd.classList.toggle('none');
    reQuest.classList.toggle('none');
    reSign.classList.toggle('none');
});

reQuest.addEventListener("click",function(){
    document.getElementById('subject').innerHTML = "เรื่อง<b>ขอจดทะเบียนรายวิชาศึกษานอกหลักสูตร</b>";
    showForm.classList.toggle('active');
    registOradd.classList.toggle('none');
    reMove.classList.toggle('none');
    reSign.classList.toggle('none');
});

reSign.addEventListener("click",function(){
    document.getElementById('subject').innerHTML = "เรื่อง<b>ลาออก</b>";
    showForm.classList.toggle('active');
    showMoreForm.classList.toggle('active');
    registOradd.classList.toggle('none');
    reMove.classList.toggle('none');
    reQuest.classList.toggle('none');
    reSignHide.classList.toggle('none');
});

/*submitButton.addEventListener("click",function(){
    mainBox.classList.toggle('none');
    showForm.classList.toggle('none');
    showMoreForm.classList.toggle('none');
    alert("คุณได้ยื่นคำร้องเรียบร้อยแล้ว");
});*/

document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('exampleModal');
    const showExampleBtn = document.getElementById('showExampleBtn');
    const closeBtn = document.getElementsByClassName('close')[0];
    const exampleContent = document.getElementById('exampleContent');

    const examples = {
        'จดทะเบียน/เพิ่มถอน': {
            name: 'สมหญิง ใฝ่ดี',
            id: '6409610333',
            year: '1',
            address: '123/45',
            district: 'คลองหลวง',
            country: 'คลองหลวง',
            province: 'ปทุมธานี',
            phone: '0823456789',
            parent_phone: '0823456789',
            teacher: 'ผศ.ดร.สมชาย สอนเขียนซี',
            course_section: '1',
            course_code: 'CS102',
            course_name: 'Computer Programing',
            section: '10001',
            reason: 'มีความประสงค์ในการจดทะเบียนของรายวิชา Computer Programing'
        },
        'ขอถอนวิชา/ถอนรายวิชา': {
            name: 'สมหญิง ใฝ่ดี',
            id: '6409610333',
            year: '2',
            address: '89/12',
            district: 'คลองหลวง',
            country: 'คลองหลวง',
            province: 'ปทุมธานี',
            phone: '0823456789',
            parent_phone: '0887654321',
            teacher: 'รศ.ดร.วิชัย การสอน',
            course_section: '2',
            course_code: 'MA221',
            course_name: 'Calculus1',
            section: '10002',
            reason: 'เนื่องจากมีปัญหาด้านสุขภาพทำให้ไม่สามารถเข้าเรียนได้อย่างต่อเนื่อง จึงขอถอนรายวิชาเพื่อลงทะเบียนใหม่ในภาคการศึกษาถัดไป'
        },
        'ขอจดทะเบียนรายวิชาศึกษานอกหลักสูตร': {
            name: 'สมหญิง ใฝ่ดี',
            id: '6409610333',
            year: '2',
            address: '89/12',
            district: 'คลองหลวง',
            country: 'คลองหลวง',
            province: 'ปทุมธานี',
            phone: '0823456789',
            parent_phone: '0887654321',
            teacher: 'รศ.ดร.สมหมาย หิวข้าว',
            course_section: '2',
            course_code: 'MA222',
            course_name: 'Calculus 2',
            section: '10003',
            reason: 'ต้องการเรียนเพิ่มเติมในส่วนของวิชาแคลคูลัส 2'
        },
        'ลาออก': {
            name: 'สมปอง ดีงาม',
            id: '6409876543',
            year: '4',
            address: '789/12',
            district: 'คลองหลวง',
            country: 'คลองหลวง',
            province: 'ปทุมธานี',
            phone: '0891234567',
            parent_phone: '0867890123',
            teacher: 'อ.ดร.จิตติ วิทยาการ',
            course_section: '',
            course_code: '',
            course_name: '',
            section: '',
            term_end: '2',
            year_end: '2567',
            debt: 'ไม่มีภาระหนี้สินคงค้าง',
            reason: 'เนื่องจากมีเหตุผลส่วนตัวที่ไม่สามารถเรียนต่อได้'
        }
        
    };

    function showExample() {
        const currentSubject = document.getElementById('subject').innerText.split('เรื่อง')[1].trim();
        let requestType = '';
        
        if (currentSubject.includes('จดทะเบียน/เพิ่มถอน')) {
            requestType = 'จดทะเบียน/เพิ่มถอน';
        } else if (currentSubject.includes('ขอถอนวิชา')) {
            requestType = 'ขอถอนวิชา/ถอนรายวิชา';
        } else if (currentSubject.includes('ขอจดทะเบียนรายวิชาศึกษานอกหลักสูตร')) {
            requestType = 'ขอจดทะเบียนรายวิชาศึกษานอกหลักสูตร';
        } else if (currentSubject.includes('ลาออก')) {
            requestType = 'ลาออก';
        }
       

        const example = examples[requestType];
        if (example) {
            exampleContent.innerHTML = `
                <div class="example-form">
                    <h3>ตัวอย่างการกรอกแบบฟอร์ม${requestType}</h3>
                    <p><span class="example-label">ชื่อ-นามสกุล:</span> ${example.name}</p>
                    <p><span class="example-label">เลขทะเบียน:</span> ${example.id}</p>
                    <p><span class="example-label">ชั้นปี:</span> ${example.year}</p>
                    <p><span class="example-label">ที่อยู่:</span> เลขที่ ${example.address} แขวง/ตำบล ${example.district} เขต/อำเภอ ${example.country} จังหวัด ${example.province}</p>
                    <p><span class="example-label">เบอร์ติดต่อ:</span> ${example.phone}</p>
                    <p><span class="example-label">เบอร์ผู้ปกครอง:</span> ${example.parent_phone}</p>
                    <p><span class="example-label">อาจารย์ที่ปรึกษา:</span> ${example.teacher}</p>
                     ${requestType !== 'ลาออก' && example.course_section ? `
                    <p><span class="example-label">รายละเอียดวิชา:</span> ภาคที่เรียน ${example.course_section} รหัสวิชา ${example.course_code} ${example.course_name} section ${example.section}</p>
                    ` : ''}
                    ${example.academic_semester && example.semester_year ? `
                        <p><span class="example-label">ตั้งแต่ภาคเรียนการศึกษา:</span> ${example.academic_semester}</p>
                        <p><span class="example-label">ปีการศึกษา:</span> ${example.semester_year}</p>
                    ` : ''}
                    ${example.debt ? `
                        <p><span class="example-label">สถานะหนี้สินคงค้าง:</span> ${example.debt}</p>
                    ` : ''}
                    <p><span class="example-label">เหตุผลที่ยื่นคำร้อง:</span><br>${example.reason}</p>
                </div>
            `;
        } else {
            exampleContent.innerHTML = '<p>ไม่พบตัวอย่างสำหรับคำร้องประเภทนี้</p>';
        }
        modal.style.display = 'block';
    }

    showExampleBtn.onclick = showExample;
    closeBtn.onclick = function() {
        modal.style.display = 'none';
    }

    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    }
});