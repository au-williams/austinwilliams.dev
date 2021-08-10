const mainElement = document.querySelector("main");
const scrollToTop = function() { window.scrollTo({ top: 0, behavior: "smooth" }); }
const scrollDown = function() { mainElement.scrollIntoView({ behavior: "smooth" }); }