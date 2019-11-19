function createUser() {
    $("#createAcc").on("click", (event) => {
        event.preventDefault();

        let url = "/api/postUser";
        let newUser = {
            name, 
            lastname, 
            username, 
            email, 
            password
        }
        
        let settings = {
            url: url ,
            method: "POST",
            data: JSON.stringify(newUser), // info sent to the API
            dataType: "JSON", // returned type of the response
            contentType: "application/json", // type of sent data in the request
            success: function(responseJSON){
                console.log("success", responseJSON);
            },
            error: function(err){
                console.log("err", err);
            }
        };

        $.ajax(settings);

        window.location.href = './../html/pools.html';
    })
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