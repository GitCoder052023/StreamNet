document.addEventListener('DOMContentLoaded', () => {
    const scrollAnimationElements = document.querySelectorAll('.scroll-animate');
    const GetStarted_Btn = document.getElementById("GetStarted_Btn");
    const RegisterBtn = document.getElementById("signUpButton");
    const ExploreRepoButton = document.getElementById("ExploreRepoBtn");

    GetStarted_Btn.addEventListener("click", () => {
        window.location.href = "/auth/login";
    });

    RegisterBtn.addEventListener("click", () => {
        window.location.href = "/auth/signup";
    });

    ExploreRepoButton.addEventListener("click", () => {
        window.location.href = "https://github.com/GitCoder052023/LChat";
    });

    const scrollObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    scrollObserver.unobserve(entry.target);
                }
            });
        },
        {
            root: null,
            threshold: 0.15,
            rootMargin: '0px 0px -10% 0px'
        }
    );

    scrollAnimationElements.forEach(element => {
        scrollObserver.observe(element);
    });

    document.querySelectorAll('nav a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
});
