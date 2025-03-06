document.addEventListener('DOMContentLoaded', () => {
    const GetStarted_Btn = document.getElementById("GetStarted_Btn");
    const RegisterBtn = document.getElementById("signUpButton");
    const ExploreRepoButton = document.getElementById("ExploreRepoBtn");

    GetStarted_Btn.addEventListener("click", () => {
        window.location.href = "/auth/login";
    });

    RegisterBtn.addEventListener("click", () => {
        window.location.href = "/auth/signup";
    });

    if (ExploreRepoButton) {
        ExploreRepoButton.addEventListener("click", () => {
            window.location.href = "https://github.com/GitCoder052023/LChat";
        });
    }

    const elementsToAnimate = [
        { selector: 'section:first-of-type h1', animationType: 'scroll-animate' },
        { selector: 'section:first-of-type p', animationType: 'scroll-animate' },
        { selector: 'section:first-of-type div.flex', animationType: 'scroll-animate' },

        { selector: '#features h2', animationType: 'scroll-animate' },
        { selector: '#features .grid > div', animationType: 'scroll-animate' },

        { selector: '#chatllama .text-center', animationType: 'scroll-animate' },
        { selector: '#chatllama .flex.justify-center > div', animationType: 'scroll-animate' },
        { selector: '#chatllama .flex.items-start', animationType: 'scroll-animate' },

        { selector: '.bg-gradient-to-r h3', animationType: 'scroll-animate fade-in' },
        { selector: '.bg-gradient-to-r p', animationType: 'scroll-animate fade-in' },
        { selector: '.bg-gradient-to-r .grid > div', animationType: 'scroll-animate zoom' },
        { selector: '.bg-gradient-to-r .mt-16', animationType: 'scroll-animate' },

        { selector: '.bg-white h3', animationType: 'scroll-animate slide-right' },
        { selector: '.bg-white p', animationType: 'scroll-animate slide-right' },
        { selector: '.bg-white .space-y-4 > div', animationType: 'scroll-animate slide-right' },
        { selector: '.bg-white .rounded-2xl', animationType: 'scroll-animate slide-left' },

        { selector: '#community h2', animationType: 'scroll-animate' },
        { selector: '#community p', animationType: 'scroll-animate' },
        { selector: '#community .flex.justify-center', animationType: 'scroll-animate' },

        { selector: 'footer h2', animationType: 'scroll-animate' },
        { selector: 'footer .max-w-6xl > div > div', animationType: 'scroll-animate' }
    ];

    elementsToAnimate.forEach(item => {
        const elements = document.querySelectorAll(item.selector);
        elements.forEach(element => {
            element.classList.add(...item.animationType.split(' '));
        });
    });

    const scrollObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        },
        {
            root: null,
            threshold: 0.15,
            rootMargin: '0px 0px -10% 0px'
        }
    );

    document.querySelectorAll('.scroll-animate').forEach(element => {
        scrollObserver.observe(element);
    });

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
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

    const nav = document.querySelector('nav');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            nav.classList.add('sticky-glass');
        } else {
            nav.classList.remove('sticky-glass');
        }
    });
});
