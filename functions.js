// Add this script at the end of your HTML or in a separate JS file
const goToTopBtn = document.getElementById('goToTopBtn');

// Show the button when scrolling down
window.onscroll = function () {
    if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
        goToTopBtn.style.display = 'block';
    } else {
        goToTopBtn.style.display = 'none';
    }
};

// Scroll to the "Table of Contents" section when the button is clicked
goToTopBtn.onclick = function () {
    const tableOfContents = document.getElementById('table-of-contents');
    if (tableOfContents) {
        tableOfContents.scrollIntoView({ behavior: 'smooth' });
    }
};