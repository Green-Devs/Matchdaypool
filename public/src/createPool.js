document.querySelector("#nav-item-create-pool").classList.add("active");

function redirectUser() {
    if (!checkIfLogged()) {
        window.location.href = './index.html';
    }
}

function watchButtons() {
    $("#teamBtn").on("click", (event) => {
        event.preventDefault();
        let currentTeams = $('#teamsInThePool option');
        let repeatedTeam = false;

        for (let i = 0; i < currentTeams.length; i++) {
            if ($('#team').val() == currentTeams[i].textContent) {
                repeatedTeam = true;
            }
        }
        if (!repeatedTeam) {
            $('#teamsInThePool').append(`<option value='${$('#team').val()}'>${$('#team').val()}</option>`);
            $('#team').val('');
        }
    });
    $("#deleteBtn").on("click", (event) => {
        event.preventDefault();
        let teamToDelete = $('#teamsInThePool').val()[0];
        $("option").filter(`:contains('${teamToDelete}')`).remove();
    });

    $("#submitBtn").on("click", (event) => {
        event.preventDefault();
        let newPool = {
            name: $("#name").val(),
            desc: $("#desc").val(),
            cost: $("#cost").val(),
            private: "",
            owner: "",
            sport: $("#sport").val(),
            teams: new Array()
        }

        if ($('#private:checkbox:checked').length == 0) 
            newPool.private = false;
        else 
            newPool.private = true;

        let currentTeams = $('#teamsInThePool option');
        for (let i = 0; i < currentTeams.length; i++) {
            let teamToAdd = {name: currentTeams[i].textContent}
            newPool.teams.push(teamToAdd);
        }

        $.ajax({
            url: '/api/Users',
            method: "GET",
            dataType: "JSON",
            success: function (users) {
                for (let i = 0; i < users.length; i++) {
                    if (users[i].username == localStorage.getItem("user")) {
                        newPool.owner = users[i]._id;
                        let settings = {
                            url: '/api/createPool',
                            method: "POST",
                            data: JSON.stringify(newPool), // info sent to the API
                            dataType: "JSON", // returned type of the response
                            contentType: "application/json", // type of sent data in the request
                            success: function (responseJSON) {
                                console.log("success", responseJSON);
                                window.location.href = './index.html';
                            },
                            error: function (err) {
                                console.log("err", err);
                            }
                        };

                        $.ajax(settings);

                    }
                }
            },
            error: function (err) {
                console.log("err", err);
            }
        });
    });
}

function createPool() {

}

redirectUser();
watchButtons();