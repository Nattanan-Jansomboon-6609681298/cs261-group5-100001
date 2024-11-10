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