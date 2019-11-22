document.querySelector("#nav-item-create-pool").classList.add("active");

function redirectUser() {
    if (!checkIfLogged()) {
        window.location.href = './index.html';
    }
}

function checkForm() {
    if ($("#name").val().length > 10 && $("#desc").val() != '' && $("#cost").val() >= 0 && $("#sport").val() != 'Choose...' && $('#teamsInThePool option').length >= 2) 
        return true;

    if ($("#name").val() == '') {
        $("#redName").html('<b>Please write a name for your team</b>')
    }
    else {
        if ($("#name").val().length < 10) {
            $("#redName").html('<b>The name must be at least 10 characters long</b>')
        }
        else {
            $("#redName").html('');
        }
    }

    if ($("#desc").val() == '') 
        $("#redDesc").html('<b>You need a description for your pool</b>')
    else 
        $("#redDesc").html('');

    if ($("#cost").val() == '') {
        $("#redCost").html('<b>Please enter a cost for your pool (It can be 0)</b>')
    }
    else {
        if ($("#cost").val() < 0) {
            $("#redCost").html('<b>Please enter a non negative cost for your pool (It can be 0)</b>')
        }
        else {
            $("#redCost").html('');
        }
    }

    if ($("#sport").val() == 'Choose...') 
        $("#redSport").html('<b>Please select a sport</b>');
    else 
        $("#redSport").html('');

    if ($('#teamsInThePool option').length < 2) 
        $("#redTeam").html('<b>Please add at least 2 teams</b>');
    else 
        $("#redTeam").html('');
    
    return false;
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
        if (checkForm()) {
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
                let teamToAdd = { name: currentTeams[i].textContent }
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
        }
    });
}

redirectUser();
watchButtons();