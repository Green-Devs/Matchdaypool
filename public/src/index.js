function watchButton() {
    $("#login").on("click", (event) => {
        event.preventDefault();

        window.location.href = './html/login.html';
    })
}

watchButton();