document.querySelector("#nav-item-user-pools").classList.add("active");

let owner;

function redirectUser() {
    if (!checkIfLogged()) {
        window.location.href = './index.html';
    }
}

function fetchPools() {
    let settings = {
        url: "/api/getUser/" + localStorage.getItem("userID"),
        method: "GET",
        dataType: "JSON", // returned type of the response
        success: function (responseJSON) {
            console.log("success", responseJSON);

            let id = responseJSON._id;
            let getPools = {
                url: "/api/getUserPools/" + id,
                method: "GET",
                dataType: "JSON",
                success: function (pools) {
                    for (let i = 0; i < pools.ownedPools.length; i++) {
                        $(".ownedPools").append(`
                            <div class="card mb-3">
                                <div class="card-body text-white bg-dark">
                                    <h5 class="card-title">${pools.ownedPools[i].name}</h5>
                                    <p class="card-text miniText"><small>Sport: ${pools.ownedPools[i].sport} Cost: $${pools.ownedPools[i].cost}</small></p><hr>
                                    <p class="card-text">${pools.ownedPools[i].desc}</p>
                                    <button type="submit" class="btn btn-primary" id="${pools.ownedPools[i]._id}">Go to pool</button>
                                    <p class="card-text"><small class="text-muted">Owner: YOU</small></p>
                                </div>
                            </div>`);
                    }
                    if (pools.ownedPools.length == 0) {
                        $(".ownedPools").append(`<h4>You don't currently own any pool</h4>`)
                    }
                    if (pools.participatingPools.length == 0) {
                        $(".otherPools").append(`<h4>You are not currently participating in any pool</h4>`)
                    }
                    console.log(pools.participatingPools);
                    for (let i = 0; i < pools.participatingPools.length; i++) {
                        $.ajax({
                            url: "/api/getPoolInfo/" + pools.participatingPools[i].pool,
                            method: "GET",
                            dataType: "JSON",
                            success: function (pool) {
                                $.ajax({
                                    url: "/api/getUser/" + pool[0].owner,
                                    method: "GET",
                                    dataType: "JSON",
                                    success: function (user) {
                                        $(".otherPools").append(`
                                    <div class="card mb-3">
                                        <div class="card-body text-white bg-dark">
                                            <h5 class="card-title">${pool[0].name}</h5>
                                            <p class="card-text miniText"><small>Sport: ${pool[0].sport} Cost: $${pool[0].cost}</small></p><hr>
                                            <p class="card-text">${pool[0].desc}</p>
                                            <button type="submit" class="btn btn-primary" id="${pools.participatingPools[i]._id}">Go to pool</button>
                                            <p class="card-text"><small class="text-muted">Owner: ${user.username}</small></p>
                                        </div>
                                    </div>`);
                                    },
                                    error: function (err) {
                                        console.log("err", err);
                                    }
                                })
                            },
                            error: function (err) {
                                console.log("err", err);
                            }
                        });
                    }
                },
                error: function (err) {
                    console.log("err", err);
                }
            }

            $.ajax(getPools);

            $(".spinner-border").hide();

        },
        error: function (err) {
            console.log("err", err);
        }
    };

    $.ajax(settings);
}

function watchPools() {
    $(".ownedPools").on("click", "button", (event) => {
        event.preventDefault();
        localStorage.setItem("poolID", event.target.id);
        window.location.href = './pool.html';
    });
    $(".otherPools").on("click", "button", (event) => {
        event.preventDefault();
        localStorage.setItem("poolID", event.target.id);
        window.location.href = './pool.html';
    });
}

redirectUser();
fetchPools();
watchPools();