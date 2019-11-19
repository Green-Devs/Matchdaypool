function signup() {
    $(".btn.btn-primary").on("click", (event) => {
        event.preventDefault();

        console.log("signup");

        let url = "/api/postUser";
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
                localStorage.setItem("userID", responseJSON._id);
                window.location.href = './publicPools.html';
            },
            error: function(err){
                console.log("err", err);
            }
        };

        $.ajax(settings);

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
