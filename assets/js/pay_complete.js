(function() {
    "use strict";

    function feedValues(){
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        let emailField = document.getElementById("floatingEmail")
        const urlParams = new URLSearchParams(window.location.search);
        let registeredEmail =  urlParams.get("regemail");

        if(registeredEmail && emailRegex.test(registeredEmail)){
            emailField.value = registeredEmail
        }
    }

    feedValues()

})();

// const base_url = "http://localhost:8080/"
const base_url = "https://api.madfest.in/"

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const floatingEmail = document.getElementById("floatingEmail");
const displayFirstName = document.getElementById("displayFirstName");
const displayMobile = document.getElementById("displayMobile");
const displayAmount = document.getElementById("displayAmount");

const payuTransId = document.getElementById("payuTransId");
const payuFinalAmount = document.getElementById("payuFinalAmount");
const payuFirstName = document.getElementById("payuFirstName");
const payuEmailId = document.getElementById("payuEmailId");
const payuMadfestHash = document.getElementById("payuMadfestHash");
const payuMobileNum = document.getElementById("payuMobileNum");

const completeNowBtn = document.getElementById("completeNowBtn");
const completeErr = document.getElementById("completeErr");
const completeLoader = document.getElementById("completeLoader");
const successHashDiv = document.getElementById("successHashDiv");

function resetError(){
    completeErr.style.display = "none";
    completeErr.innerHTML = ""
}

function displayError(errMsg){
    completeErr.style.display = "block";
    completeErr.innerHTML = errMsg
    setTimeout(() => {
        resetError()
    }, 15000);
}

function assignValues(params){
    displayFirstName.value = params.userName
    payuFirstName.value = params.userName

    displayMobile.value = params.userMobile
    payuMobileNum.value = params.userMobile

    payuEmailId.value = params.userEmail

    displayAmount.value = params.userAmount.toFixed(2)
    payuFinalAmount.value = params.userAmount.toFixed(2)

    payuTransId.value = params.transactionId
    payuMadfestHash.value = params.hash
}

function completeNowAction(){

    resetError()

    let registeredEmail = floatingEmail.value

    if(!registeredEmail || !emailRegex.test(registeredEmail)){
        displayError("Enter a valid mail id!")
        return
    }

    const formData = new URLSearchParams();

    formData.append("regMailId",registeredEmail)
    completeLoader.style.display = "block";
    fetch(`${base_url}payu/complete-payment`,{
        method:"POST",
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded' // Important
        },
        body:formData
    })
    .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.text(); // For debugging
      })
      .then(text => {
        // console.log('Response Text:', text);
        const json = text ? JSON.parse(text) : {}; // Handle empty response
        // console.log('Parsed JSON:', json);
        console.log("Hash Response: ",json)
        completeNowBtn.style.display = "none";
        successHashDiv.style.display = "block";
        completeLoader.style.display = "none";
        assignValues(json)
      })
      .catch((error)=>{
        console.log("Hash Error: ",error)
        displayError("Technical Issue! Try Again!")
        completeLoader.style.display = "none";
      })
}

function cancelPaymentAction(){
    resetError()
    successHashDiv.style.display = "none";
    completeNowBtn.style.display = "block"
}