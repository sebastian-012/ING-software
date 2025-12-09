const slides = document.querySelectorAll(".slide");
let currentSlide = 0;

export function startSlider() {
    if (slides.length === 0) return;

    setInterval(() => {
        slides[currentSlide].classList.remove("active");
        currentSlide = (currentSlide + 1) % slides.length;
        slides[currentSlide].classList.add("active");
    }, 4000);
}
