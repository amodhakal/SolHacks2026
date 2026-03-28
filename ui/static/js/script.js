const myDialog = document.getElementById('myDialog');
const ConfirmButton = document.getElementById('confirmSubmit');
const CancelButton = document.getElementById('cancelSubmit');
const SubmitButton = document.getElementById('SubmitButton');

SubmitButton.addEventListener('click', () => {
    myDialog.showModal();
});

ConfirmButton.addEventListener('click', () => {
    myDialog.close();
    // You can add code here to handle the form submission

});

CancelButton.addEventListener('click', () => {
    myDialog.close();
});

const form_info = {
    firstname: "",
    lastname: "",
    email: "",
    DOB: "",
    insurance: "",
    address: "",
    medical_department: "",
    medical_history: "",
}
