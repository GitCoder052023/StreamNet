const GetStarted_Btn = document.getElementById("GetStarted_Btn")
const mobileMenuButton = document.getElementById('mobile-menu-button');
const mobileMenu = document.getElementById('mobile-menu');

mobileMenuButton.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
});

GetStarted_Btn.addEventListener("click", function() {
  window.location.href = "/chat";
});