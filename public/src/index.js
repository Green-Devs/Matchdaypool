function createPool() {
    
}

function init() {
    let url = "/api/pools"
    let settings = {
        method: "GET"
    }
    fetch(url, settings)
        .then(response => {
            if (response.ok) {
                return response.json();
            }

            throw new Error (response.statusText);
        })
        .then(responseJSON => {
            console.log(responseJSON);

            for (let i = 0; i < responseJSON.length; i++) {
                $(".listOfPools").append(`
                <li class="pet">
                    ${responseJSON[i].name} (${responseJSON[i].typeOfPet})
                </li>
                `);
            }
        })
        .catch(err => {
            console.log(err);
        });
    
    // hello

}

init();

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

