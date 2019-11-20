function watchButton() {

    document.querySelector("#nav-item-" + "home").classList.add("active");
    $("#login").on("click", (event) => {
        event.preventDefault();

        window.location.href = './html/login.html';
    })
}

watchButton();