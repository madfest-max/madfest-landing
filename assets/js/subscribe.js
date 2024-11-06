const post_base_url = "https://api.madfest.in/"
// const post_base_url = "http://localhost:8080/"
const newsForm = document.querySelector("#madfestSubscription")
const subscribeLoader = document.getElementById("newsletterLoader")
const subscribeErr = document.getElementById("newsLetterError")
const subscribeSuccess = document.getElementById("newsLetterSuccess")
const newsLetterSubmit = document.getElementById("subscribeSubmit")

function fetchFormData(form){

  const formData = new FormData(form);
  const exportData = new URLSearchParams();

  formData.forEach((value,key)=>{exportData.append(key,value)});

  return exportData;

}

function displayNewsResult(useCase){

    subscribeSuccess.style.display = "none";
    subscribeErr.style.display = "none"
    newsLetterSubmit.disabled = false;

    if(useCase==="form_success"){
        subscribeSuccess.style.display = "block";
        newsLetterSubmit.disabled = true;
    }else{
        subscribeErr.innerHTML = "Server Error! Try Later!"
        subscribeErr.style.display = "block"
        newsLetterSubmit.disabled = true;
    }

    setTimeout(()=>{
        subscribeSuccess.style.display = "none";
        subscribeErr.innerHTML = ""
        subscribeErr.style.display = "none"
        newsLetterSubmit.disabled = false;
    },15000)

}

newsForm.addEventListener('submit',(event)=>{
    event.preventDefault()

    subscribeLoader.style.display = "block";

    let formValues = fetchFormData(newsForm)
    // console.log("Form:",formValues)
    
    let messagePostUrl = `${post_base_url}subscription/`

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
        subscribeLoader.style.display = "none";
        displayNewsResult("form_success")
        newsForm.reset()
      })
      .catch(error => {
        // console.log("error:",error)
        subscribeLoader.style.display = "none";
        displayNewsResult("form_failure")
      });

})