
const links ={
    "CATEGORY": "man-categories.html",
    "GAME": "man-games.html"
}
function init() {
    const items = document.querySelectorAll('.nav-link');
    items.forEach(e => {
        e.addEventListener("click", function(event) {
            document.querySelector('.nav-link.active').classList.replace("active", "text-white");
            this.classList.replace("text-white", "active");
            document.querySelector('#current-page').src=links[this.dataset.link];
        })
    });
}
init();