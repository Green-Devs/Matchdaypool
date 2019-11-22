function redirectUser() {
    if (checkIfLogged()) {
        window.location.href = './index.html';
    }
}

function signup() {
    $(".btn.btn-primary").on("click", (event) => {
        event.preventDefault();

        console.log("signup");

        if ($("#name").val() && $("#lastname").val() && $("#username").val() && $("#email").val() && $("#password").val() && $("#dob").val()) {

            document.querySelector("#redName").hidden = true;
            document.querySelector("#redLastname").hidden = true;
            document.querySelector("#redUsername").hidden = true;
            document.querySelector("#redBirthday").hidden = true;
            document.querySelector("#redEmail").hidden = true;
            document.querySelector("#redPassword").hidden = true;
            document.querySelector("#redConfPassword").hidden = true;
                
            
            if ($("#password").val() == $("#confPassword").val()) {

                document.querySelector("#redPassword").hidden = true;

                let url = "/api/registerUser";
                let newUser = {
                    name: $("#name").val(), 
                    lastname: $("#lastname").val(), 
                    username: $("#username").val(), 
                    email: $("#email").val(), 
                    password: $("#password").val(),
                    dob: $("#dob").val()
                }
                
                let settings = {
                    url: url ,
                    method: "POST",
                    data: JSON.stringify(newUser), // info sent to the API
                    dataType: "JSON", // returned type of the response
                    contentType: "application/json", // type of sent data in the request
                    success: function(responseJSON){
                        console.log("success", responseJSON);
                        window.location.href = './index.html';
                    },
                    error: function(err){
                        console.log("err", err);
                    }
                };

                $.ajax(settings);
            } else {
                // show that passwords dont match
                document.querySelector("#redPassword").innerHTML = "<b>Your passwords don't match</b>";
                document.querySelector("#redPassword").hidden = false;
            }
            
        } else {
            console.log("falta un valor");
            if (!$("#name").val()) {
                console.log("no name");
                document.querySelector("#redName").hidden = false;
            } else {
                document.querySelector("#redName").hidden = true;
            }

            if (!$("#lastname").val()) {
                document.querySelector("#redLastname").hidden = false;
            } else {
                document.querySelector("#redLastname").hidden = true;
            }

            if (!$("#username").val()) {
                document.querySelector("#redUsername").hidden = false;
            } else {
                document.querySelector("#redUsername").hidden = true;
            }

            if (!$("#dob").val()) {
                document.querySelector("#redBirthday").hidden = false;
            } else {
                document.querySelector("#redBirthday").hidden = true;
            }

            if (!$("#email").val()) {
                document.querySelector("#redEmail").hidden = false;
            } else {
                document.querySelector("#redEmail").hidden = true;
            }

            if (!$("#password").val()) {
                document.querySelector("#redPassword").innerHTML = "<b>Please enter your password</b>";
                document.querySelector("#redPassword").hidden = false;
            } else {
                document.querySelector("#redPassword").hidden = true;
            }

            if (!$("#confPassword").val()) {
                document.querySelector("#redConfPassword").hidden = false;
            } else {
                document.querySelector("#redConfPassword").hidden = true;
            }
        }
    });
}

function examplesForPUTandPOSTMethods() {
    let objToSend = {
        id: 10,
        typeOfPet: "Dog",
        name: "Bruno"
    }
    
    // For POST and PUT
    
    fetch(url, {
        method: "POST", // or "PUT"
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(objToSend)
    }).then().then()
    
    $.ajax({
        method: "PUT",
        url: url,
        data: JSON.stringify(objToSend),
        contentType: "aplication/json",
        dataType: "JSON"
    });
}

signup();
redirectUser();