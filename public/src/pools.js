function getPools() {
    let url = "/api/pools";
    let settings = {
        url: url ,
        method: "GET",
        dataType: "JSON", // returned type of the response
        success: function(responseJSON){
            console.log("success", responseJSON);
            for (let i = 0; i < responseJSON.length; i++) {
                $(".listOfPools").append(`
                <li class="pool">
                    ${responseJSON[i].name} (${responseJSON[i].typeOfPet})
                </li>
                `);
            }
        },
        error: function(err){
            console.log("err", err);
        }
    };
    
    $.ajax(settings);

}

getPools();