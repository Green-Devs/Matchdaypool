let firstMessage = false;
let secondMessage = false;

function watchButtons() {
    $("#loginBtn").on("click", (event) => {
        event.preventDefault();
        if (document.getElementById('username').value == "") {
            if (!firstMessage) {
                $('#usernameForm').append(`<label class="RedMessages" id="redUsername"><b>Please enter your username</b></label>`);
                firstMessage = true;
            }
        }
        else {
            $("#redUsername").remove();
            firstMessage = false;
        }
        if (document.getElementById('userPassword').value == "") {
            if (!secondMessage) {
                $('#passwordForm').append(`<label class="RedMessages" id="redPassword"><b>Please enter your password</b></label>`);
                secondMessage = true;
            }
        }
        else {
            $("#redPassword").remove();
            secondMessage = false;
        }
        if (document.getElementById('userPassword').value != "" && document.getElementById('username').value != "") {
            let user = {
                username: $('#username').val(),
                password: $('#userPassword').val()
            }
            let settings = {
                url: "/api/login",
                method: "POST",
                data: JSON.stringify(user), // info sent to the API
                dataType: "JSON", // returned type of the response
                contentType: "application/json", // type of sent data in the request
                success: function (loggedUser) {
                    console.log("success", loggedUser);
                    localStorage.setItem("user", loggedUser);
                    window.location.href = './index.html';
                },
                error: function (err) {
                    console.log("err", err);
                }
            };

            $.ajax(settings);
        }
    })

    $("#signup").on("click", (event) => {
        event.preventDefault();

        window.location.href = './../html/signup.html';
    })
}

watchButtons()
