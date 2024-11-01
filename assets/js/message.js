// const base_url = "http://localhost:8080/"
const base_url = "https://api.madfest.in/"

const form = document.querySelector("#madfestForm")
const loaderDiv = document.getElementById("loadingBar")
const errorDiv = document.getElementById("errorMessageDiv")
const successDiv = document.getElementById("successMessageDiv")
const mailSubmitBtn = document.getElementById("mailSubmit")

function getFormValues(form){

    const formData = new FormData(form);
    const exportData = new URLSearchParams();

    formData.forEach((value,key)=>{exportData.append(key,value)});

    return exportData;

}

function displayMessage(useCase){

    successDiv.style.display = "none";
    errorDiv.style.display = "none"
    mailSubmitBtn.disabled = false;

    if(useCase==="form_success"){
        successDiv.style.display = "block";
        mailSubmitBtn.disabled = true;
    }else{
        errorDiv.innerHTML = "Server Error! Try Later!"
        errorDiv.style.display = "block"
        mailSubmitBtn.disabled = true;
    }

    setTimeout(()=>{
        successDiv.style.display = "none";
        errorDiv.innerHTML = ""
        errorDiv.style.display = "none"
        mailSubmitBtn.disabled = false;
    },15000)

}

form.addEventListener('submit',(event)=>{
    event.preventDefault()

    loaderDiv.style.display = "block";

    let formValues = getFormValues(form)
    // console.log("Form:",formValues)
    
    let messagePostUrl = `${base_url}messages/`

    fetch(messagePostUrl, {
        method: 'POST', // Specify the HTTP method
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded' // Important
        },
        body: formValues // Convert your data to JSON format
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
        loaderDiv.style.display = "none";
        displayMessage("form_success")
        form.reset()
      })
      .catch(error => {
        // console.log("error:",error)
        loaderDiv.style.display = "none";
        displayMessage("form_failure")
      });

})