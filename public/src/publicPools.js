let owner;

function fetchPublicPools() {
    let url = "/api/getPools";
    let settings = {
        url: url,
        method: "GET",
        dataType: "JSON", // returned type of the response
        success: function (responseJSON) {
            console.log("success", responseJSON);

            for (let i = 0; i < responseJSON.length; i++) {
            

                $(".listOfPools").append(`
                <div class="card mb-3">
                    <div class="card-body text-white bg-dark">
                        <h5 class="card-title">${responseJSON[i].name}</h5>
                        <p class="card-text">${responseJSON[i].desc}</p>
                        <p class="card-text"><small class="text-muted">Owner: ${responseJSON[i].ownerName}, ${responseJSON[i].owner} Sport: ${responseJSON[i].sport} Cost: ${responseJSON[i].cost}</small></p>
                    </div>
                </div>`);
                
            }

            $(".spinner-border").hide();

        },
        error: function (err) {
            console.log("err", err);
        }
    };

    $.ajax(settings);
}

fetchPublicPools();