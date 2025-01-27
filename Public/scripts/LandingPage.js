const GetStarted_Btn = document.getElementById("GetStarted_Btn");

document.querySelectorAll('nav a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
            targetElement.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

GetStarted_Btn.addEventListener("click", function () {
    window.location.href = "/chat";
});