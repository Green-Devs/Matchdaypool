let owner = localStorage.getItem("ownerUsername");
let id = localStorage.getItem("poolID");

function redirectUser() {
    if (!checkIfLogged()) {
        window.location.href = './index.html';
    }
}

function fetchPoolInfo() {
    console.log(id);
    $.ajax({
        url: "/api/getPoolInfo/" + id,
        method: "GET",
        dataType: "JSON", 
        success: function (poolInfo) {
            console.log(poolInfo);
            $('#poolTitle').append(`${poolInfo[0].name}`);
        },
        error: function (err) {
            console.log("err", err);
        }
    });
}

redirectUser();
fetchPoolInfo();