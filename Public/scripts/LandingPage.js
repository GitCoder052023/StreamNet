const GetStarted_Btn = document.getElementById("GetStarted_Btn");
const RegisterBtn = document.getElementById("signUpButton");

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

GetStarted_Btn.addEventListener("click", () => {
    window.location.href = "/auth/login";
});

RegisterBtn.addEventListener("click", () => {
    window.location.href = "/auth/signup";
});