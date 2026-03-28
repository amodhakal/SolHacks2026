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
    form_info.firstname = document.getElementById('firstName').value;
    form_info.lastname = document.getElementById('lastName').value;
    form_info.email = document.getElementById('email').value;
    form_info.DOB = document.getElementById('dob').value;
    form_info.insurance = document.getElementById('insurance').value;
    form_info.address = document.getElementById('address').value;
    form_info.medical_department = document.getElementById('medical_department').value;
    form_info.medical_history = document.getElementById('additionalInfo').value;
    console.log(form_info);

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
