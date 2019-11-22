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

function createNavBar() {
    if (checkIfLogged()) {
        $(".navbar-nav").append(`
            <li class="nav-item" id="nav-item-user-pools">
                <a class="nav-link" href="myPools.html">My Pools</a>
            </li>
            <li class="nav-item" id="nav-item-create-pool">
                <a class="nav-link" href="createPool.html">Create a pool</a>
            </li>`
        );
        $(".navbar-collapse").append(`<div class="dropdown">
            <button class="btn btn-danger dropdown-toggle my-2 my-sm-0" type="button" id="dropdownMenuButton" data-toggle="dropdown"
                aria-haspopup="true" aria-expanded="false"><img src="./assets/portrait.png" width="30" height="30" class="d-inline-block align-top" alt="">
                    ${localStorage.getItem("user")}
            </button>
                <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                    <a class="dropdown-item" href="#"><img src="assets/account.png"> Profile</a>
                    <a class="dropdown-item" href="#"><img src="assets/edit.png"> Edit information</a>
                    <a class="dropdown-item" href="#"><img src="assets/invitations.png"> Invitations</a>
                    <a class="dropdown-item" id="signOut" href="#"><img src="assets/Redsignout.png"> Sign out</a>
            </div>
        </div>`);
    }
    else {
        $(".navbar-collapse").append(`<a class="nav-link" href="login.html"><button class="btn btn-outline-danger my-2 my-sm-0" type="submit">Log In / Sign Up</button></a>`);
    }
}


function signOut() {
    $("#signOut").on("click", (event) => {
        localStorage.setItem("user", "guest");
        window.location.href = './index.html';
    })
}

createNavBar()
signOut();