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
                if (!responseJSON.private) {
                    let id = responseJSON[i].owner;

                    let getSettings = {
                        url: "/api/getUser/" + id,
                        method: "GET",
                        dataType: "JSON",
                        success: function (user) {
                            owner = user.username;
                            $(".listOfPools").append(`
                            <div class="card mb-3">
                                <div class="card-body text-white bg-dark">
                                <h5 class="card-title">${responseJSON[i].name}</h5>
                                <p class="card-text miniText"><small>Sport: ${responseJSON[i].sport} Cost: $${responseJSON[i].cost}</small></p>
                                <p class="card-text">${responseJSON[i].desc}</p>
                                <p class="card-text"><small class="text-muted">Owner: ${owner}</small></p>
                                </div>
                    </div>`);
                        },
                        error: function (err) {
                            console.log("err", err);
                        }
                    }

                    $.ajax(getSettings);
                }
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