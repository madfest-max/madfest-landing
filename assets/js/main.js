/**
* Template Name: Gp
* Template URL: https://bootstrapmade.com/gp-free-multipurpose-html-bootstrap-template/
* Updated: Aug 15 2024 with Bootstrap v5.3.3
* Author: BootstrapMade.com
* License: https://bootstrapmade.com/license/
*/

(function() {
  "use strict";

  /**
   * Apply .scrolled class to the body as the page is scrolled down
   */
  function toggleScrolled() {
    const selectBody = document.querySelector('body');
    const selectHeader = document.querySelector('#header');
    if (!selectHeader.classList.contains('scroll-up-sticky') && !selectHeader.classList.contains('sticky-top') && !selectHeader.classList.contains('fixed-top')) return;
    window.scrollY > 100 ? selectBody.classList.add('scrolled') : selectBody.classList.remove('scrolled');
  }

  document.addEventListener('scroll', toggleScrolled);
  window.addEventListener('load', toggleScrolled);

  /**
   * Mobile nav toggle
   */
  const mobileNavToggleBtn = document.querySelector('.mobile-nav-toggle');

  function mobileNavToogle() {
    document.querySelector('body').classList.toggle('mobile-nav-active');
    mobileNavToggleBtn.classList.toggle('bi-list');
    mobileNavToggleBtn.classList.toggle('bi-x');
  }
  if (mobileNavToggleBtn) {
    mobileNavToggleBtn.addEventListener('click', mobileNavToogle);
  }

  /**
   * Hide mobile nav on same-page/hash links
   */
  document.querySelectorAll('#navmenu a').forEach(navmenu => {
    navmenu.addEventListener('click', () => {
      if (document.querySelector('.mobile-nav-active')) {
        mobileNavToogle();
      }
    });

  });

  /**
   * Toggle mobile nav dropdowns
   */
  document.querySelectorAll('.navmenu .toggle-dropdown').forEach(navmenu => {
    navmenu.addEventListener('click', function(e) {
      e.preventDefault();
      this.parentNode.classList.toggle('active');
      this.parentNode.nextElementSibling.classList.toggle('dropdown-active');
      e.stopImmediatePropagation();
    });
  });

  /**
   * Preloader
   */
  const preloader = document.querySelector('#preloader');
  if (preloader) {
    window.addEventListener('load', () => {
      preloader.remove();
    });
  }

  /**
   * Scroll top button
   */
  let scrollTop = document.querySelector('.scroll-top');

  function toggleScrollTop() {
    if (scrollTop) {
      window.scrollY > 100 ? scrollTop.classList.add('active') : scrollTop.classList.remove('active');
    }
  }
  scrollTop.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  window.addEventListener('load', toggleScrollTop);
  document.addEventListener('scroll', toggleScrollTop);

  /**
   * Animation on scroll function and init
   */
  function aosInit() {
    AOS.init({
      duration: 600,
      easing: 'ease-in-out',
      once: true,
      mirror: false
    });
  }
  window.addEventListener('load', aosInit);

  /**
   * Init swiper sliders
   */
  function initSwiper() {
    document.querySelectorAll(".init-swiper").forEach(function(swiperElement) {
      let config = JSON.parse(
        swiperElement.querySelector(".swiper-config").innerHTML.trim()
      );

      if (swiperElement.classList.contains("swiper-tab")) {
        initSwiperWithCustomPagination(swiperElement, config);
      } else {
        new Swiper(swiperElement, config);
      }
    });
  }

  window.addEventListener("load", initSwiper);

  /**
   * Initiate glightbox
   */
  const glightbox = GLightbox({
    selector: '.glightbox'
  });

  /**
   * Init isotope layout and filters
   */
  document.querySelectorAll('.isotope-layout').forEach(function(isotopeItem) {
    let layout = isotopeItem.getAttribute('data-layout') ?? 'masonry';
    let filter = isotopeItem.getAttribute('data-default-filter') ?? '*';
    let sort = isotopeItem.getAttribute('data-sort') ?? 'original-order';

    let initIsotope;
    imagesLoaded(isotopeItem.querySelector('.isotope-container'), function() {
      initIsotope = new Isotope(isotopeItem.querySelector('.isotope-container'), {
        itemSelector: '.isotope-item',
        layoutMode: layout,
        filter: filter,
        sortBy: sort
      });
    });

    isotopeItem.querySelectorAll('.isotope-filters li').forEach(function(filters) {
      filters.addEventListener('click', function() {
        isotopeItem.querySelector('.isotope-filters .filter-active').classList.remove('filter-active');
        this.classList.add('filter-active');
        initIsotope.arrange({
          filter: this.getAttribute('data-filter')
        });
        if (typeof aosInit === 'function') {
          aosInit();
        }
      }, false);
    });

  });

  /**
   * Initiate Pure Counter
   */
  new PureCounter();

  /**
   * Correct scrolling position upon page load for URLs containing hash links.
   */
  window.addEventListener('load', function(e) {
    if (window.location.hash) {
      if (document.querySelector(window.location.hash)) {
        setTimeout(() => {
          let section = document.querySelector(window.location.hash);
          let scrollMarginTop = getComputedStyle(section).scrollMarginTop;
          window.scrollTo({
            top: section.offsetTop - parseInt(scrollMarginTop),
            behavior: 'smooth'
          });
        }, 100);
      }
    }
  });

  /**
   * Navmenu Scrollspy
   */
  let navmenulinks = document.querySelectorAll('.navmenu a');

  function navmenuScrollspy() {
    navmenulinks.forEach(navmenulink => {
      if (!navmenulink.hash) return;
      let section = document.querySelector(navmenulink.hash);
      if (!section) return;
      let position = window.scrollY + 200;
      if (position >= section.offsetTop && position <= (section.offsetTop + section.offsetHeight)) {
        document.querySelectorAll('.navmenu a.active').forEach(link => link.classList.remove('active'));
        navmenulink.classList.add('active');
      } else {
        navmenulink.classList.remove('active');
      }
    })
  }
  window.addEventListener('load', navmenuScrollspy);
  document.addEventListener('scroll', navmenuScrollspy);

  var musicSelected = false;
  var artSelected = false;
  var danceSelected = false;
  var totalPrice = 0.00;

  var inputCount = document.getElementById("candPartCount")

  var inputNumberEvents = ['input', 'change', 'focus', 'blur', 'keydown', 'keyup', 'keypress', 'wheel', 'click'];

  document.querySelector("#candPartType").addEventListener('change',function(){
    startCalcProcess()
  })

  // document.querySelector("#candPartCount").addEventListener('change',function(){
  //   startCalcProcess()
  // })

  // Add event listeners for each event type
  inputNumberEvents.forEach(function(event) {
    inputCount.addEventListener(event, function() {
        console.log('Button triggered by ' + event + ' event!');
        startCalcProcess()
    });
  });

  function showErrorMsg(errorMsg){
    let textBox = document.getElementById("messageBox")
    textBox.style.display = "block";
    textBox.innerHTML = errorMsg
    document.getElementById("finalPayBtn").disabled = true
    document.getElementById("candTotalAmount").value = 0.00
  }

  function displayTotalCost(candType,candCount,candCategory){

    let ticketAmt = candType==="student"?100:200;

    let ticketPrice = ticketAmt * candCount * candCategory;
    document.getElementById("candTotalAmount").value = ticketPrice

    let textBox = document.getElementById("messageBox")
    textBox.style.display = "none";
    document.getElementById("finalPayBtn").disabled = false

  }

  function startCalcProcess() {
    let partTypeValue = document.getElementById("candPartType").value;
    let partCountValue = Number(document.getElementById("candPartCount").value)

    if( partTypeValue !== "-999" ){
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

var nameRegex = /^[a-zA-Z]+([ '-][a-zA-Z]+)*$/;
var mobileNumberRegex = /^[6-9]\d{9}$/;
var emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
var instagramUrlRegex = /^https?:\/\/(www\.)?instagram\.com\/[a-zA-Z0-9._]{1,30}\/?$/;
var aadharRegex = /^\d{12}$/;
var pinCodeRegex = /^[1-9][0-9]{5}$/;

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
    showBasicError("Select a date and your age should be above 12!")
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

function validateContact(screenName){

  if(screenName!=="contact_details"){
    return false;
  }

  let candMobile = document.getElementById("candMobile").value
  let candEmail = document.getElementById("candEmail").value
  let candInstagram = document.getElementById("candInstagram").value
  let candAadharCard = document.getElementById("candAadharCard").value

  if(!mobileNumberRegex.test(candMobile)){
    showBasicError("Enter a proper mobile number","block","messageContact")
    return false;
  }else if(!emailRegex.test(candEmail)){
    showBasicError("Enter a proper email id","block","messageContact")
    return false;
  }else if(!instagramUrlRegex.test(candInstagram)){
    showBasicError("Enter a proper instagram id","block","messageContact")
    return false;
  }else if(!aadharRegex.test(candAadharCard)){
    showBasicError("Enter a proper aadhar number","block","messageContact")
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

  console.log('Difference in years: ' + diffInYears);
  if(diffInYears>=12){
    return true;
  }else{
    return false;
  }
}

function buttonActions(showScreen,destroyScreen){

  let validFlag = false;

  if(validBasicDetails(destroyScreen) || validateContact(destroyScreen) || validateResidential(destroyScreen)){
    validFlag = true;
  }
  
  if(validFlag){
    document.getElementById(showScreen).className = "d-block";
    document.getElementById(destroyScreen).className = "d-none"; 
  }

}