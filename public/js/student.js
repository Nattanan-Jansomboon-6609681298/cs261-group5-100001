let mainBox = document.getElementById('main_box');
let showForm = document.getElementById('show_form');
let showMoreForm = document.getElementById('show_more_form');

let registOradd = document.getElementById('regist/add');
let reMove = document.getElementById('remove');
let reQuest = document.getElementById('request');
let reSign = document.getElementById('resign');
let submitButton = document.getElementById('submit');


registOradd.addEventListener("click",function(){
    document.getElementById('select_text').innerHTML = "จดทะเบียน/เพิ่มถอน";
    mainBox.classList.toggle('none');
    showForm.classList.toggle('active');
});

reMove.addEventListener("click",function(){
    document.getElementById('select_text').innerHTML = "ขอถอนวิชา/ถอนรายวิชา";
    mainBox.classList.toggle('none');
    showForm.classList.toggle('active');
});

reQuest.addEventListener("click",function(){
    document.getElementById('select_text').innerHTML = "ขอจดทะเบียนรายวิชาศึกษานอกหลักสูตร";
    mainBox.classList.toggle('none');
    showForm.classList.toggle('active');
});

reSign.addEventListener("click",function(){
    document.getElementById('select_text').innerHTML = "ลาออก";
    mainBox.classList.toggle('none');
    showForm.classList.toggle('active');
    showMoreForm.classList.toggle('active');
});

submitButton.addEventListener("click",function(){
    mainBox.classList.toggle('none');
    showForm.classList.toggle('none');
    showMoreForm.classList.toggle('none');
    alert("คุณได้ยื่นคำร้องเรียบร้อยแล้ว");
});