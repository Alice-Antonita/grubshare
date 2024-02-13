document.addEventListener("DOMContentLoaded", function() {
    var urlParams = new URLSearchParams(window.location.search);
    document.getElementById("organiser").innerText = "Organiser: " + urlParams.get('organiser');
    document.getElementById("ename").innerText = "Event Name: " + urlParams.get('ename');
    document.getElementById("edate").innerText = "Event Date: " + urlParams.get('edate');
    document.getElementById("etime").innerText = "Event Time: " + urlParams.get('etime');
    document.getElementById("elocation").innerText = "Event Location: " + urlParams.get('elocation');
    document.getElementById("edesc").innerText = "Event Description: " + urlParams.get('edesc');
    document.getElementById("eimage").innerText = "Event Image: " + urlParams.get('eimage');
});
