document.querySelector("#nav-item-public-pools").classList.add("active");

let pools = [];
let owner;

function getPools() {
    let url = "/api/getPools";
    let settings = {
        url: url ,
        method: "GET",
        dataType: "JSON", // returned type of the response
        success: function(responseJSON){
            console.log("success", responseJSON);
            
            for (let i = 0; i < responseJSON.length; i++) {
                if (!responseJSON.private) {
                    let id = responseJSON[i].owner;
                    
                    let getSettings = {
                        url: "/api/getUser/" + id,
                        method: "GET",
                        dataType: "JSON",
                        success: function(responseJSON) {
                            console.log(responseJSON);
                            owner = responseJSON.name;
                        },
                        error: function(err){
                            console.log("err", err);
                        }
                    }

                    fetch(getSetting.url)
                        .then(function(response) {
                            console.log(response);
                            if (response.ok) {
                                return response.json();
                            }
                            throw new Error("Something went wrong");
                        })
                        .then( function(responseJSON) {
                            console.log(responseJSON);
                            owner = responseJSON.name;
                        })
                        .catch(function(err) {
                            console.log(err);
                        });

                    $.ajax(getSettings);

                    $(".listOfPools").append(`
                        <div class="pool">
                            <div class="name">${responseJSON[i].name}</div>
                            <div class="desc">${responseJSON[i].desc}</div>
                            <div class="cost">${responseJSON[i].cost}</div>
                            <div class="owner">${owner}</div>
                        </div>
                        `);
                }
            }

            $(".spinner-border").hide();
            
        },
        error: function(err){
            console.log("err", err);
        }
    };
    
    $.ajax(settings);

}

getPools();