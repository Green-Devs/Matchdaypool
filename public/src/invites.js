function getInvites() {
    let settings = {
        url: "/api/getInvites/" + localStorage.getItem("userID"),
        method: "GET",
        dataType: "JSON", // returned type of the response
        success: function (responseJSON) {
            console.log("success", responseJSON);

            for (let i = 0; i < responseJSON.length; i++) {
                let id = responseJSON[i].pool;
                let getPools = {
                    url: "/api/getPoolInfo/" + id,
                    method: "GET",
                    dataType: "JSON",
                    success: function (pool) {
                        console.log(pool);
                        let userID = pool[0].owner;
                        let getUser = {
                            url: "/api/getUser/" + userID,
                            method: "GET",
                            dataType: "JSON",
                            success: function (user) {
                                $(".invitesList").append(`
                                    <div class="card mb-3">
                                        <div class="card-body text-white bg-dark">
                                            <h5 class="card-title">${pool[0].name}</h5>
                                            <p class="card-text miniText"><small>Sport: ${pool[0].sport} Cost: $${pool[0].cost}</small></p><hr>
                                            <p class="card-text">${pool[0].desc}</p>
                                            <p class="card-text"><small class="text-muted">Owner: ${user.username}</small></p>
                                        </div>
                                    </div>`);
                            },
                            error: function (err) {
                                console.log("err", err);
                            }
                        }
                        $.ajax(getUser);
                        
                    },
                    error: function (err) {
                        console.log("err", err);
                    }
                }  
                $.ajax(getPools);   
            }
        },
        error: function (err) {
            console.log("err", err);
        }
    }
    $.ajax(settings);
}

getInvites();