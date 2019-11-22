let owner = localStorage.getItem("ownerUsername");
let id = localStorage.getItem("poolID");
let isUserParticipating = false;

function redirectUser() {
    if (!checkIfLogged()) {
        window.location.href = './index.html';
    }
}

function checkIfOwner(ownerID) {
    $.ajax({
        url: "/api/getUser/" + ownerID,
        method: "GET",
        dataType: "JSON",
        success: function (poolOwner) {
            if (poolOwner.username == localStorage.getItem("user")) {
                $(".topPart").append(`<button type="submit" class="btn btn-primary" id="editBtn">Edit Pool</button><button type="submit" class="btn btn-warning" id="sendBtn">Send invitations</button><button type="submit" class="btn btn-success" id="addBtn">Add a Matchday</button><button type="submit" class="btn btn-danger" id="deleteBtn">Delete Pool</button>`)
            }
            else {
                $(".topPart").remove();
            }

        },
        error: function (err) {
            console.log("err", err);
        }
    });
}

function fetchPoolInfo() {
    console.log(id);
    $.ajax({
        url: "/api/getPoolInfo/" + id,
        method: "GET",
        dataType: "JSON",
        success: function (poolInfo) {
            checkIfOwner(poolInfo[0].owner);
            if (!poolInfo[0].private)
                $('.genInfo').append(`<button type ="submit" class="btn btn-success" id="joinBtn">Join the Pool</button>`);
            $('#poolTitle').append(`${poolInfo[0].name}`);
            $('.textInfo').append(`<p>${poolInfo[0].desc}</p><p>Sport: ${poolInfo[0].sport}</p><p>Cost: $${poolInfo[0].cost}</p>`)
            $.ajax({
                url: "/api/getPoolTeams/" + poolInfo[0]._id,
                method: "GET",
                dataType: "JSON",
                success: function (teams) {
                    for (let i = 0; i < teams.length; i++) {
                        $('.teamsInThePool').append(`<li>${teams[i].name}</li>`);
                    }
                },
                error: function (err) {
                    console.log("err", err);
                }
            });
            $.ajax({
                url: "/api/getPoolParticipants/" + poolInfo[0]._id,
                method: "GET",
                dataType: "JSON",
                success: function (users) {
                    console.log(users);
                    for (let i = 0; i < users.length; i++) {
                        $.ajax({
                            url: "/api/getUser/" + users[i].participant,
                            method: "GET",
                            dataType: "JSON",
                            success: function (participant) {
                                if (participant.username == localStorage.getItem("user")) {
                                    $('.genInfo').append(`<button type ="submit" class="btn btn-success" id="voteBtn"> Vote in the current Mathday</button>`);
                                    $('#joinBtn').remove();
                                }
                                $('.usersInThePool').append(`<li>${participant.username}</li>`);
                                checkIfUserIsParticipating(isUserParticipating, poolInfo[0].private);
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
            });
            $.ajax({
                url: "/api/getPoolMatchdays/" + poolInfo[0]._id,
                method: "GET",
                dataType: "JSON",
                success: function (matchDays) {
                    for (let i = 0; i < matchDays.length; i++) {
                        $('.poolMatchays').append(`<li>Matchday ${i + 1}: ${matchDays[i].startDate}-${matchDays[i].endDate}</li>`);
                    }
                },
                error: function (err) {
                    console.log("err", err);
                }
            });
        },
        error: function (err) {
            console.log("err", err);
        }
    });
}

function checkButtons() {
    $(".genInfo").on("click", "#joinBtn", (event) => {
        event.preventDefault();
        $.ajax({
            url: "/api/getUsers/",
            method: "GET",
            dataType: "JSON",
            success: function (users) {
                for (let i = 0; i < users.length; i++) {
                    if (users[i].username == localStorage.getItem("user")) {
                        let userToAdd = {
                            participant: users[i]._id,
                            pool: localStorage.getItem("poolID"),
                            coveredCost: true
                        }
                        console.log(userToAdd);
                        $.ajax({
                            url: "/api/addParticipant",
                            method: "POST",
                            data: JSON.stringify(userToAdd), // info sent to the API
                            dataType: "JSON", // returned type of the response
                            contentType: "application/json", // type of sent data in the request
                            success: function (newParticipant) {
                                console.log("success", newParticipant);
                                window.location.href = './pool.html';
                            },
                            error: function (err) {
                                console.log("err", err);
                            }
                        });
                    }
                }

            },
            error: function (err) {
                console.log("err", err);
            }
        });
    });
    $(".topPart").on("click", "#deleteBtn", (event) => {
        event.preventDefault();
        $.ajax({
            url: "/api/deletePool/" + localStorage.getItem("poolID"),
            method: "DELETE",
            contentType: "JSON",
            success: function (deleted) {
                window.location.href = './index.html';
            },
            error: function (err) {
                console.log("err", err);
            }
        });
    });
}

redirectUser();
fetchPoolInfo();
checkButtons();