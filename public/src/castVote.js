let id = localStorage.getItem("poolID");

function redirectUser() {
    if (!checkIfLogged()) {
        window.location.href = './index.html';
    }
}

function fetchOptions() {
    $.ajax({
        url: "/api/getPoolInfo/" + id,
        method: "GET",
        dataType: "JSON",
        success: function (poolInfo) {
            $('#poolName').append(poolInfo[0].name);
            $.ajax({
                url: "/api/getPoolMatchdays/" + poolInfo[0]._id,
                method: "GET",
                dataType: "JSON",
                success: function (matchDays) {
                    for (let i = 0; i < matchDays.length; i++) {
                        $('.votes').append(`
                <legend class="col-form-label">Matchday ${i + 1}: ${matchDays[i].startDate}-${matchDays[i].finishDate}</legend>
                <div class="col-sm-10" id="matchday${i + 1}"></div>`);
                        $.ajax({
                            url: "/api/getMatches/" + matchDays[i]._id,
                            method: "GET",
                            dataType: "JSON",
                            success: function (matches) {
                                for (let j = 0; j < matches.length; j++) {
                                    $.ajax({
                                        url: "/api/getPoolTeams/" + poolInfo[0]._id,
                                        method: "GET",
                                        dataType: "JSON",
                                        success: function (teams) {
                                            let first, second
                                            for (let i = 0; i < teams.length; i++) {
                                                if (teams[i]._id == matches[j].teamOne) {
                                                    first = teams[i].name;
                                                }
                                                if (teams[i]._id == matches[j].teamTwo) {
                                                    second = teams[i].name;
                                                }
                                            }
                                            $(`#matchday${i + 1}`).append(`<div class="row options"><div class="form-check">
                        <input class="form-check-input" type="radio" name="${matches[j]._id}" id="gridRadios1" value="${first}">
                        <label class="form-check-label" for="gridRadios1">
                            ${first}
                        </label>
                    </div>
                    <div class="form-check">
                        <input class="form-check-input" type="radio" name="${matches[j]._id}" id="gridRadios2" value="${second}">
                        <label class="form-check-label" for="gridRadios2">
                            ${second}
                        </label>
                    </div>
                    </div>
                    `);
                    /* DRAW
                         <div class="form-check">
                        <input class="form-check-input" type="radio" name="${matches[j]._id}" id="gridRadios2" value="draw" checked>
                        <label class="form-check-label" for="gridRadios2">
                            draw
                        </label>
                    </div>
                    */
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

function watchButton() {
    $("#votesBtn").on("click", (event) => {
        event.preventDefault();
        $.ajax({
            url: "/api/getPoolInfo/" + id,
            method: "GET",
            dataType: "JSON",
            success: function (poolInfo) {
                $.ajax({
                    url: "/api/getPoolMatchdays/" + poolInfo[0]._id,
                    method: "GET",
                    dataType: "JSON",
                    success: function (matchDays) {
                        for (let i = 0; i < matchDays.length; i++) {
                            $.ajax({
                                url: "/api/getMatches/" + matchDays[i]._id,
                                method: "GET",
                                dataType: "JSON",
                                success: function (matches) {
                                    for (let j = 0; j < matches.length; j++) {
                                        let radioValue = $(`input[name='${matches[j]._id}']:checked`).val();
                                        console.log(radioValue);
                                        $.ajax({
                                            url: "/api/getPoolTeams/" + poolInfo[0]._id,
                                            method: "GET",
                                            dataType: "JSON",
                                            success: function (teams) {
                                                let teamID = "99999999999";
                                                for (let i = 0; i < teams.length; i++) {
                                                    if (teams[i].name == radioValue) {
                                                        teamID = teams[i]._id;
                                                    }
                                                }
                                                let vote = {
                                                    participant: localStorage.getItem("userID"),
                                                    match: matches[j]._id,
                                                    winner: teamID,
                                                    draw: false
                                                }
                                                $.ajax({
                                                    url: "/api/createVote",
                                                    method: "POST",
                                                    data: JSON.stringify(vote), // info sent to the API
                                                    dataType: "JSON", // returned type of the response
                                                    contentType: "application/json", // type of sent data in the request
                                                    success: function (createdVote) {
                                                        console.log("success", createdVote);
                                                        window.location.href = './pool.html';
                                                      //  window.location.href = './index.html';
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
            },
            error: function (err) {
                console.log("err", err);
            }
        });
    });

}

redirectUser();
fetchOptions();
watchButton();