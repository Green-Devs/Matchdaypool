function redirectUser() {
    if (!checkIfLogged()) {
        window.location.href = './index.html';
    }
}

function fetchOptions() {
    $.ajax({
        url: "/api/getPoolTeams/" + localStorage.getItem("poolID"),
        method: "GET",
        dataType: "JSON",
        success: function (teams) {
            for (let i = 0; i < teams.length; i++){
                $('#team1').append(`<option>${teams[i].name}</option>`);
                $('#team2').append(`<option>${teams[i].name}</option>`);
             }
        },
        error: function (err) {
            console.log("err", err);
        }
    });
}

function watchButtons() {
    $("#matchBtn").on("click", (event) => {
        event.preventDefault();
        $('#teamsInTheMatch').append(`<option>${$('#team1').val()} - ${$('#team2').val()}</option>`);
    });
    $("#deleteBtn").on("click", (event) => {
        event.preventDefault();
        let teamToDelete = $('#teamsInTheMatch').val()[0];
        $("option").filter(`:contains('${teamToDelete}')`).remove();
    });

    $("#submitBtn").on("click", (event) => {
        event.preventDefault();
        let newMatchday = {
            startDate: $("#start").val(),
            finishDate: $("#finish").val(),
            pool: localStorage.getItem("poolID")
        }
        
        $.ajax({
            url: '/api/createMatchday',
            method: "POST",
            data: JSON.stringify(newMatchday), // info sent to the API
            dataType: "JSON", // returned type of the response
            contentType: "application/json", // type of sent data in the request
            success: function (createdMatchday) {
                console.log(createdMatchday);
                let currentMatches = $('#teamsInTheMatch option');
                for (let i = 0; i < currentMatches.length; i++) {
                    let matchesToAdd = currentMatches[i].textContent;
                    let splits = matchesToAdd.split(" - ");

                    $.ajax({
                        url: "/api/getPoolTeams/" + localStorage.getItem("poolID"),
                        method: "GET",
                        dataType: "JSON",
                        success: function (teams) {
                            let first = '', second = '';
                            for (let i = 0; i < teams.length; i++) {
                                if (teams[i].name == splits[0]) {
                                    first = teams[i]._id;
                                }
                                if (teams[i].name == splits[1]) {
                                    second = teams[i]._id;
                                }
                            }
                            let newMatch = {
                                teamOne: first,
                                teamTwo: second,
                                matchday: createdMatchday._id,
                                pool: localStorage.getItem("poolID")
                            }

                            console.log(newMatch);
                            $.ajax({
                                url: '/api/createMatch',
                                method: "POST",
                                data: JSON.stringify(newMatch), // info sent to the API
                                dataType: "JSON", // returned type of the response
                                contentType: "application/json", // type of sent data in the request
                                success: function (createdMatchday) {
                                    console.log(createdMatchday);
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
               // window.location.href = './pool.html';
            },
            error: function (err) {
                console.log("err", err);
            }
        });
    });
}

redirectUser();
fetchOptions();
watchButtons();