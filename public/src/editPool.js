document.querySelector("#nav-item-create-pool").classList.add("active");

function redirectUser() {
    if (!checkIfLogged()) {
        window.location.href = './index.html';
    }
}

function retreivePoolInfo() {
    console.log("retreiving info");
    let settings = {
        url: "/api/getPoolInfo/" + localStorage.getItem("poolID"),
        method: "GET",
        dataType: "JSON",
        success: function (responseJSON) {
            console.log(responseJSON);
            $("#name").val(responseJSON[0].name);
            $("#desc").val(responseJSON[0].desc); 
            $("#cost").val(responseJSON[0].cost);
            $("#sport").val(responseJSON[0].sport);

        },
        error: function (err) {
            console.log("err", err);
        }
    }
    $.ajax(settings);
}

function checkForm() {
    if ($("#name").val().length > 10 && $("#desc").val() != '' && $("#cost").val() >= 0 && $("#sport").val() != 'Choose...') 
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
    
    return false;
}


function watchButtons() {

    $("#submitBtn").on("click", (event) => {
        event.preventDefault();
        if (checkForm()) {
            let updatedPool = {
                name: $("#name").val(),
                desc: $("#desc").val(),
                cost: $("#cost").val(),
                private: "",
                owner: localStorage.getItem("userID"),
                sport: $("#sport").val(),
                id: localStorage.getItem("poolID")
            }

            if ($('#private:checkbox:checked').length == 0)
                updatedPool.private = false;
            else
                updatedPool.private = true;

            $.ajax({
                url: '/api/getUsers',
                method: "GET",
                dataType: "JSON",
                success: function (users) {
                    for (let i = 0; i < users.length; i++) {
                        if (users[i].username == localStorage.getItem("user")) {
                            updatedPool.owner = users[i]._id;
                            let settings = {
                                url: '/api/updatePoolInfo',
                                method: "PUT",
                                data: JSON.stringify(updatedPool), // info sent to the API
                                dataType: "JSON", // returned type of the response
                                contentType: "application/json", // type of sent data in the request
                                success: function (responseJSON) {
                                    console.log("success", responseJSON);
                                    window.location.href = './pool.html';
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
retreivePoolInfo();
watchButtons();