function redirectUser() {
    if (!checkIfLogged()) {
        window.location.href = './index.html';
    }
}

function fetchInformation() {
    $.ajax({
        url: "/api/getUser/" + localStorage.getItem("userID"),
        method: "GET",
        dataType: "JSON",
        success: function (user) {
            console.log(user);
            $("#profileUsername").append(`<h2>${user.username}</h2>`);
            $("#restOfContent").append(`<h3>Full Name: ${user.name} ${user.lastname}</h3><h3>Date of birth: ${user.dob}</h3><h3>Email: ${user.email}</h3>`);

            $(".spinner-border").hide();

        },
        error: function (err) {
            console.log("err", err);
        }
    });
}

redirectUser();
fetchInformation();