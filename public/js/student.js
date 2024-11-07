let mainBox = document.getElementById('main_box');
let registOradd = document.getElementById('regist/add');
let showForm = document.getElementById('show_form');

registOradd.addEventListener("click",function(){
    mainBox.classList.toggle('none');
    showForm.classList.toggle('active')
});