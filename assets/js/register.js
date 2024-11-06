(function() {
  "use strict";

var musicSelected = false;
var artSelected = false;
var danceSelected = false;
var totalPrice = 0.00;

var inputCount = document.getElementById("candPartCount")

var inputNumberEvents = ['input', 'change', 'focus', 'blur', 'keydown', 'keyup', 'keypress', 'wheel', 'click'];

function gatherAllForm(){

  // Basic Details
  let firstName = document.getElementById("candFirstName").value
  let lastName = document.getElementById("candLastName").value
  let candidGender = document.getElementById("candGender").value
  let candidDob = document.getElementById("candDob").value
  let candBloodGroup = document.getElementById("candBloodGroup").value

  // Contact Details
  let candMobile = document.getElementById("candMobile").value
  let candEmail = document.getElementById("candEmail").value
  let candInstagram = document.getElementById("candInstagram").value
  let candAadharCard = document.getElementById("candAadharCard").value

  // Residential Fields
  let candAddressLine = document.getElementById("candAddressLine").value;
  let candAddressState = document.getElementById("candAddressState").value;
  let candAddressDistrict = document.getElementById("candAddressDistrict").value;
  let candZipcode = document.getElementById("candZipcode").value;

  // Participation Fields
  let partTypeValue = document.getElementById("candPartType").value;
  let partCountValue = Number(document.getElementById("candPartCount").value)

  let categoryArr = []
  if(musicSelected){
    categoryArr.push("music")
  }
  if(artSelected){
    categoryArr.push("art")
  }
  if(danceSelected){
    categoryArr.push("dance")
  }

  let partTotalAmount = Number(document.getElementById("candTotalAmount").value)
  let partUtrNumber = document.getElementById("candUtrNumber").value

  let finalJson = {
    
    "entryId": "SFX00002",
    "entryFirstName":firstName,
    "entryLastName":lastName,
    "entryGender":candidGender,
    "entryBloodGrp":candBloodGroup,
    "entryDob":candidDob,

    "entryMobile":candMobile,
    "entryEmail":candEmail,
    "entryInstaId":candInstagram,
    "entryAadharCard":candAadharCard,
    
    "entryAddrLine":candAddressLine,
    "entryAddrState":candAddressState,
    "entryAddrDist":candAddressDistrict,
    "entryAddrPin":candZipcode,

    "entryType":partTypeValue,
    "entryCount":partCountValue,
    "entryCategory":categoryArr,
    "entryAmount":partTotalAmount,
  }

  return convertJsonFormData(finalJson)
}

function convertJsonFormData(obj) {

  const formData = new URLSearchParams();

  Object.keys(obj).forEach(key => {
      // console.log(`${key}: ${obj[key]}`);
    formData.append(key, obj[key]);
  });

  formData.delete("entryCategory")

  let tempCategory = obj["entryCategory"]
  tempCategory.forEach(item => {
      formData.append('entryCategory[]', item); // Use a key like 'fruits[]' for array notation
  });

  return formData;
}

const utrRegex = /^\d{12}$/;

const base_url = "https://api.madfest.in/"
// const base_url = "http://localhost:8080/"

function genTransId(){
  const timeStamp = new Date().getTime()
  const randomNum = Math.floor(Math.random() * 1000000)
  const merchantPrefix = "MDFT24"
  const transactionID = `${merchantPrefix}${timeStamp}${randomNum}`
  return transactionID;
}

function fetchHashCode(params){

  let userTransactionId = genTransId()

  const hashData = new URLSearchParams();

  hashData.append("userName",params.userName)
  hashData.append("userEmail",params.userEmail)
  hashData.append("userAmount",params.userAmount)
  hashData.append("transactionId",userTransactionId)
  
  fetch(`${base_url}payu/hash`,{
    method: 'POST', // Specify the HTTP method
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded' // Important
    },
    body: hashData // Convert your data to JSON format
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
    paymentAction(params,json)
  })
  .catch((error)=>{
    console.log("Hash Error: ",error)
  })

}

function paymentAction(params,response){

  let displayName = document.getElementById("displayFirstName")
  let displayEmail = document.getElementById("displayEmailId")
  let displayAmount = document.getElementById("displayFinalAmt")

  let payFinalAmt = document.getElementById("payuFinalAmount")
  let payFirstName = document.getElementById("payuFirstName")
  let payEmailId = document.getElementById("payuEmailId")
  let payuMobileNum = document.getElementById("payuMobileNum")

  let payTransactionId = document.getElementById("payuTransId")
  let payTransactionHash = document.getElementById("payuMadfestHash")

  payTransactionHash.value = response.hash
  payTransactionId.value = response.transactionId

  displayName.value = params.userName
  displayEmail.value = params.userEmail
  displayAmount.value = params.userAmount

  payFinalAmt.value = params.userAmount
  payFirstName.value = params.userName
  payEmailId.value = params.userEmail
  payuMobileNum.value = params.userMobile

  changeSteps("checkout-page")
}

function finalBtnAction() {

  let allValuesJson = gatherAllForm()
  console.log("all:",allValuesJson)
  // return;

  let hashjson = {
    "userName":allValuesJson.get("entryFirstName"),
    "userEmail":allValuesJson.get("entryEmail"),
    "userAmount":Number(allValuesJson.get("entryAmount")).toFixed(2),
    "userMobile":allValuesJson.get("entryMobile")
  }

  // return;

  fetch(`${base_url}participation/`, {
    method: 'POST', // Specify the HTTP method
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded' // Important
    },
    body: allValuesJson // Convert your data to JSON format
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
    if(allValuesJson.get("entryType")==="kids" && Number(allValuesJson.get("entryAmount")).toFixed(2)==="0.00"){
      // console.log("I am a kid")
      changeSteps("form_success")
    }else{
      fetchHashCode(hashjson)
    }
      
  })
  .catch(error => {
    // console.log("error:",error)
    changeSteps("form_failure")
  });

}

document.querySelector("#finalPayBtn").addEventListener('click',function(){
  finalBtnAction()
})

document.querySelector("#candPartType").addEventListener('change',function(){
  startCalcProcess()
})

// document.querySelector("#candPartCount").addEventListener('change',function(){
//   startCalcProcess()
// })

// Add event listeners for each event type
inputNumberEvents.forEach(function(event) {
  inputCount.addEventListener(event, function() {
      // console.log('Button triggered by ' + event + ' event!');
      startCalcProcess()
  });
});

function showErrorMsg(errorMsg,resetAmount=true){
  let textBox = document.getElementById("messageBox")
  textBox.style.display = "block";
  textBox.innerHTML = errorMsg
  if(resetAmount){
    document.getElementById("finalPayBtn").disabled = true
    document.getElementById("candTotalAmount").value = 0.00
  }
}

function kidsAgeCheck(){
  
  let dobValue = document.getElementById("candDob").value

  if(!dobValue){
      return false
  }

  // Create two Date objects
  var startDate = new Date(dobValue);
  var endDate = new Date();

  // Calculate the difference in years
  var diffInYears = endDate.getFullYear() - startDate.getFullYear();

  // Adjust for the case where the end date is before the start date's month and day
  if (endDate.getMonth() < startDate.getMonth() || 
      (endDate.getMonth() === startDate.getMonth() && endDate.getDate() < startDate.getDate())) {
      diffInYears--;
  }

  // console.log('Kids Check ' + diffInYears);
  if(diffInYears>=3 && diffInYears<12){
      return true;
  }else{
      return false;
  }
}

function ticketTypeAmount(candType){

  let ticketPrice = 0;

  switch(candType){
      case "kids":
          ticketPrice = 0;
          break;
      case "student":
          ticketPrice = 100;
          break;
      case "non-student":
          ticketPrice = 200;
          break;
  }

  return ticketPrice;

}

function displayTotalCost(candType,candCount,candCategory){

  let ticketAmt = ticketTypeAmount(candType)

  let ticketPrice = ticketAmt * candCount * candCategory;
  document.getElementById("candTotalAmount").value = ticketPrice

  let textBox = document.getElementById("messageBox")
  textBox.style.display = "none";
  document.getElementById("finalPayBtn").disabled = false

}

function startCalcProcess() {
  let partTypeValue = document.getElementById("candPartType").value;
  let partCountValue = Number(document.getElementById("candPartCount").value)

  if( partTypeValue !== "-999"){
    
      if(partTypeValue==="kids" && !kidsAgeCheck()){
          showErrorMsg("Sorry your not a kid anymore!")
          return;
      }
      
    if(partCountValue > 0 && partCountValue < 9){
      if(musicSelected || artSelected || danceSelected){
        let categoryCount = 0;

        if(musicSelected){
          categoryCount+=1;
        }

        if(artSelected){
          categoryCount+=1
        }

        if(danceSelected){
          categoryCount+=1
        }
        displayTotalCost(partTypeValue,partCountValue,categoryCount)
      }else{
        showErrorMsg("Select a category")
      }
    }else{
      showErrorMsg("Enter number of team members")
    }
  }else{
    showErrorMsg("Select Participation Type")
  }
}

document.querySelector("#calculateBtn").addEventListener('click',function(){

  startCalcProcess()

})

document.querySelector("#music_img_tag").addEventListener('click',function(){
  if(!musicSelected){
    this.src =  "/assets/img/category-icons/music.gif"
    this.parentElement.style.border = "1px solid #33CCCC";
    musicSelected = true;
    startCalcProcess()
  }else{
    this.src =  "/assets/img/category-icons/music.png"
    this.parentElement.style.border = "none";
    musicSelected = false;
    startCalcProcess()
  }
})

document.querySelector("#art_img_tag").addEventListener('click',function(){
  if(!artSelected){
    this.src =  "/assets/img/category-icons/drawing.gif"
    this.parentElement.style.border = "1px solid #33CCCC";
    artSelected = true;
    startCalcProcess()
  }else{
    this.src =  "/assets/img/category-icons/drawing.png"
    this.parentElement.style.border = "none";
    artSelected = false;
    startCalcProcess()
  }
})

document.querySelector("#dance_img_tag").addEventListener('click',function(){
  if(!danceSelected){
    this.src =  "/assets/img/category-icons/hula.gif"
    this.parentElement.style.border = "1px solid #33CCCC";
    danceSelected = true;
    startCalcProcess()
  }else{
    this.src =  "/assets/img/category-icons/hula.png"
    this.parentElement.style.border = "none";
    danceSelected = false;
    startCalcProcess()
  }
})
})();

const nameRegex = /^[a-zA-Z]+([ '-][a-zA-Z]+)*$/;
const mobileNumberRegex = /^[6-9]\d{9}$/;
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const instagramUrlRegex = /^https?:\/\/(www\.)?instagram\.com\/[a-zA-Z0-9._]{1,30}\/?$/;
const instagramIdRegex = /^(?=.{1,30}$)[a-zA-Z0-9._]+$/;
const aadharRegex = /^\d{12}$/;
const pinCodeRegex = /^[1-9][0-9]{5}$/;

function showBasicError(errMsg,display="block",boxId="messageBasic"){

let errorBox = document.getElementById(boxId)
errorBox.style.display = display
errorBox.innerHTML = errMsg

}



function validBasicDetails(screenName) {

if(screenName!=="basic_details"){
  return false;
}

let firstName = document.getElementById("candFirstName").value
let lastName = document.getElementById("candLastName").value
let candidGender = document.getElementById("candGender").value
let candidDob = document.getElementById("candDob").value
let candBloodGroup = document.getElementById("candBloodGroup").value

if(!nameRegex.test(firstName)){
  showBasicError("Enter proper first name!")
  return false;
}else if(!nameRegex.test(lastName)){
  showBasicError("Enter proper last name!")
  return false;
}else if(candidGender==="-999"){
  showBasicError("Select a gender!")
  return false;
}else if(candidDob==="" || !calculateAge(candidDob)){
  showBasicError("Select a date and your age should be above 3!")
  return false;
}else if(candBloodGroup==="-999"){
  showBasicError("Select a blood group!")
  return false;
}else{
  showBasicError("","none")
  return true;
}

// console.log("firstName",firstName)
// console.log("lastName",lastName)
// console.log("candidGender",candidGender)
// console.log("candidDob",candidDob)
// console.log("candBloodGroup",candBloodGroup)

}

async function checkEmailAadhar(allValuesJson){

const base_url = "https://api.madfest.in/"
// const base_url = "http://localhost:8080/"
let response = await fetch(`${base_url}participation/check-unique-mail/`, {
  method: 'POST', // Specify the HTTP method
  headers: {
      'Content-Type': 'application/json', // Ensure server expects JSON
      'Accept': 'application/json' // Indicates client expects JSON response
  },
  body: JSON.stringify(allValuesJson) // Convert your data to JSON format
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
  let userExisting = json["success"]
  if(!userExisting){
    showBasicError(json["message"],"block","messageContact")
  }
  return userExisting
})
.catch(error => {
  showBasicError("Technical Issue, Try Again Later !","block","messageContact")
  // console.log("error:",error)
  return false
});

// console.log("unique response:",response)
return response
// return false
}

async function validateContact(screenName){

if(screenName!=="contact_details"){
  return false;
}

let candMobile = document.getElementById("candMobile").value
let candEmail = document.getElementById("candEmail").value
let candInstagram = document.getElementById("candInstagram").value
let candAadharCard = document.getElementById("candAadharCard").value

let bodyJson = {
  "entryAadharCard":candAadharCard,
  "entryEmail":candEmail,
}

if(!mobileNumberRegex.test(candMobile)){
  showBasicError("Enter a proper mobile number","block","messageContact")
  return false;
}else if(!emailRegex.test(candEmail)){
  showBasicError("Enter a proper email id","block","messageContact")
  return false;
}else if(!instagramIdRegex.test(candInstagram)){
  showBasicError("Enter a proper instagram id","block","messageContact")
  return false;
}else if(!aadharRegex.test(candAadharCard)){
  showBasicError("Enter a proper aadhar number","block","messageContact")
  return false;
}else if(await checkEmailAadhar(bodyJson) == false){
  return false;
}else{
  showBasicError("","none","messageContact")
  return true;
}

}

function validateResidential(screenName){

if(screenName!=="residential_details"){
  return false;
}

let candAddressLine = document.getElementById("candAddressLine").value;
let candAddressState = document.getElementById("candAddressState").value;
let candAddressDistrict = document.getElementById("candAddressDistrict").value;
let candZipcode = document.getElementById("candZipcode").value;

if(candAddressLine===""){
  showBasicError("Enter an address line.","block","messageResidential")
  return false;
}else if(candAddressState==="-999"){
  showBasicError("Select State","block","messageResidential")
  return false;
}else if(candAddressDistrict==="-999"){
  showBasicError("Select District","block","messageResidential")
  return false;
}else if(!pinCodeRegex.test(candZipcode)){
  showBasicError("Enter a proper pin code","block","messageResidential")
  return false;
}else{
  showBasicError("","none","messageResidential")
  return true;
}

}

function calculateAge(dobValue){

if(!dobValue){
  return false
}

// Create two Date objects
var startDate = new Date(dobValue);
var endDate = new Date();

// Calculate the difference in years
var diffInYears = endDate.getFullYear() - startDate.getFullYear();

// Adjust for the case where the end date is before the start date's month and day
if (endDate.getMonth() < startDate.getMonth() || 
  (endDate.getMonth() === startDate.getMonth() && endDate.getDate() < startDate.getDate())) {
    diffInYears--;
}

// console.log('Difference in years: ' + diffInYears);
if(diffInYears>=3){
  return true;
}else{
  return false;
}
}

const base_illus_url = "./assets/img/form-steps/"

function changeSteps(showScreen){

let formIllustration = document.getElementById("steps-form-illustration")
let formIndicator = document.getElementById("form-steps-indicator")
let finalFieldSet = document.getElementById("participation_details")
let successDiv = document.getElementById("success-result")
let failureDiv = document.getElementById("failure-result")
let checkout_page = document.getElementById("payment-gateway")
let classBlockValue = "row w-100 p-2 d-block"

// console.log("showIng:",showScreen,formIllustration.style.backgroundImage)

switch(showScreen){
  
  case "basic_details":
    formIllustration.style.setProperty('background-image', `url('${base_illus_url}basic_details.jpg')`, 'important');
    formIndicator.innerHTML = "Step 1 / 4"
    break;
  case "contact_details":
    formIllustration.style.setProperty('background-image', `url('${base_illus_url}contact_details.jpg')`, 'important');
    formIndicator.innerHTML = "Step 2 / 4"
    break;
  case "residential_details":
      formIllustration.style.setProperty('background-image', `url('${base_illus_url}address_details.jpg')`, 'important');
      formIndicator.innerHTML = "Step 3 / 4"
      break;
    case "participation_details":
      formIllustration.style.setProperty('background-image', `url('${base_illus_url}event_details.jpg')`, 'important');
      formIndicator.innerHTML = "Step 4 / 4"
      break;
    case "checkout-page":
      formIllustration.style.setProperty('background-image', `url('${base_illus_url}payment_session.jpg')`, 'important');
      finalFieldSet.className = "d-none"
      formIndicator.innerHTML = "Payment Page"
      checkout_page.className = classBlockValue;
      break;
    case "form_success":
      formIllustration.style.setProperty('background-image', `url('${base_illus_url}final_step.jpg')`, 'important');
      formIndicator.innerHTML = "Thank You!"
      finalFieldSet.className = "d-none"
      successDiv.className = classBlockValue
      break;
    case "form_failure":
      formIllustration.style.setProperty('background-image', `url('${base_illus_url}server_issue.jpg')`, 'important');
      formIndicator.innerHTML = "Try Later!"
      finalFieldSet.className = "d-none"
      failureDiv.className = classBlockValue
      break;
  default:
    return;
}

}

function goToPage(newLocation){
window.location.href = newLocation
}

async function buttonActions(showScreen,destroyScreen,backBtn=false){

let validFlag = false;

if(validBasicDetails(destroyScreen) || await validateContact(destroyScreen) || validateResidential(destroyScreen)){
  validFlag = true;
}

if(validFlag || backBtn){
  document.getElementById(showScreen).className = "d-block";
  document.getElementById(destroyScreen).className = "d-none"; 
  changeSteps(showScreen)
}

}