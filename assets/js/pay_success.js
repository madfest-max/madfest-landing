(function() {
    "use strict";

    function initPages() {
        let paraTag = document.getElementById("contentTag")
        const urlParams = new URLSearchParams(window.location.search);
        let firstName =  urlParams.get("firstname");
        let transactionId = urlParams.get("txnid")

        if(firstName && transactionId){
            let composeText = `Dear <strong>${firstName}</strong>, your registration is successful with transaction Id : <strong>${transactionId}</strong> on <strong>${new Date().toLocaleString()}</strong>.`
            paraTag.innerHTML = composeText
        }else{
            window.location.href = "../../index.html"
        }
        
    }

    initPages()

})();