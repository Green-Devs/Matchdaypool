document.querySelector("#nav-item-create-pool").classList.add("active");

function redirectUser() {
    if (checkIfLogged()) {
        window.location.href = './index.html';
    }
}

function createPool() {
    
}