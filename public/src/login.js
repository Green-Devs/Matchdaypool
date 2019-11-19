function watchButtons() {
    $("#login").on("click", (event) => {
        event.preventDefault();
    })

    $("#signup").on("click", (event) => {
        event.preventDefault();

        window.location.href = './../html/signup.html';
    })
}

watchButtons()
