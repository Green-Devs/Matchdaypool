let firstMessage = false;
let secondMessage = false;

function watchButtons() {
    
    $("#loginBtn").on("click", (event) => {
        event.preventDefault();
        if (document.getElementById('userEmail').value == "") {
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
    })

    $("#signup").on("click", (event) => {
        event.preventDefault();

        window.location.href = './../html/signup.html';
    })
}

watchButtons()
