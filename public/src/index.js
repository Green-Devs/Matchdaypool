function checkIfLogged() {
    console.log(localStorage.getItem("user"));
    if (localStorage.getItem("user") == null) {
        localStorage.setItem("user", "guest");
        return false;
    }
    else {
        if (localStorage.getItem("user") != "guest") {
            return true;
        }
        return false;
    }
}

function watchButton() {

    document.querySelector("#nav-item-" + "home").classList.add("active");
    $("#login").on("click", (event) => {
        event.preventDefault();

        window.location.href = './html/login.html';
    })
}

watchButton();
checkIfLogged();