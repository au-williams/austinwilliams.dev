window.onload   = () => updateNavbar();
window.onscroll = () => updateNavbar();

const showNavbar = () => navbar.style.top = 0;
const hideNavbar = () => navbar.style.top = "-400px";

function updateNavbar() {
    const landing = document.getElementById("landing");
    const offset = .75;

    if (window.pageYOffset > (landing.scrollHeight * offset))
        showNavbar()
    else if (window.pageYOffset < (landing.scrollHeight * offset))
        hideNavbar()
}

function scrollToId(id) {
    const element = document.getElementById(id);

    if (!element) {
        console.log(`Warning: 'scrollToId(id)' Could not find id ${id} to scroll to`);
        return;
    }

    element.scrollIntoView({ behavior: 'smooth' });
}