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
            console.log("falta un valor");
            if (!$("#name").val()) {
                console.log("no name");
            }
            if ($("#lastname").val()) {

            } 
            if ($("#username").val()) {

            } 
            if ($("#email").val()) {

            } 
            if ($("#password").val()) {

            } 
            if ($("#dob").val()) {
                
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