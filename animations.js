// Intersection Observer for scroll animations
const observerOptions = {
  root: null,
  rootMargin: '0px',
  threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('animate');
    }
  });
}, observerOptions);

// Animate elements on scroll
document.addEventListener('DOMContentLoaded', () => {
  // Animate hero content
  const heroContent = document.querySelector('.hero-content');
  heroContent.classList.add('fade-in');

  // Animate book items
  const bookItems = document.querySelectorAll('.book-item');
  bookItems.forEach(item => {
    item.classList.add('slide-up');
    observer.observe(item);
  });

  // Animate footer sections
  const footerSections = document.querySelectorAll('.footer-section');
  footerSections.forEach(section => {
    section.classList.add('fade-in');
    observer.observe(section);
  });
}); 