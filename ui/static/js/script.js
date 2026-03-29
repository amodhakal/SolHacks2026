
const myDialog = document.getElementById('myDialog');
const ConfirmButton = document.getElementById('confirmSubmit');
const CancelButton = document.getElementById('cancelSubmit');
const SubmitButton = document.getElementById('SubmitButton');


const questions = {
    "introduction" : "This website is designed to provide translation services for users. It offers a user-friendly interface where users can input text in one language and receive translations in another language. The website supports multiple languages and uses advanced translation algorithms to ensure accurate and reliable translations.",
    "firstName" : "What is your first name?",
    "lastName" : "What is your last name?",
    "email" : "What is your email address?",
    "dob" : "What is your date of birth?",
    "insurance" : "Do you have any insurance",
    "address" : "What is your address?",
    "whoToVisit" : "What medical department do you want to visit?",
    "additionalInfo" : "Is there anything else you wish to tell us?"
};

document.getElementById("introduction").innerHTML = questions.introduction;
document.getElementById("firstNameQuestion").innerHTML = questions.firstName;
document.getElementById("lastNameQuestion").innerHTML = questions.lastName;
document.getElementById("emailQuestion").innerHTML = questions.email;
document.getElementById("dobQuestion").innerHTML = questions.dob;
document.getElementById("insuranceQuestion").innerHTML = questions.insurance;
document.getElementById("addressQuestion").innerHTML = questions.address;
document.getElementById("whoToVisitQuestion").innerHTML = questions.whoToVisit;
document.getElementById("additionaalInfoQuestion").innerHTML = questions.additionalInfo;



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
