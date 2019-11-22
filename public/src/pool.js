let owner = localStorage.getItem("ownerUsername");
let id = localStorage.getItem("poolID");

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
                $(".topPart").append(`<button type="submit" class="btn btn-primary id="editBtn"}">Edit Pool</button><button type="submit" class="btn btn-warning id="sendBtn"}">Send invitations</button><button type="submit" class="btn btn-success id="addBtn"}">Add a Matchday</button><button type="submit" class="btn btn-danger id="deleteBtn"}">Delete Pool</button>`)
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
            checkIfOwner(poolInfo[0].owner)
            console.log(poolInfo);
            $('#poolTitle').append(`${poolInfo[0].name}`);
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
                    for (let i = 0; i < users.length; i++) {
                        $('.usersInThePool').append(`<li>${users[i].username}</li>`);
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

redirectUser();
fetchPoolInfo();