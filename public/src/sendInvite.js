import { set } from "mongoose";

$("#inviteBtn").on("click", (event) => {
    event.preventDefault();
    
    let settings = {
        url: '/api/findUser/' + $('#invite').val(),
        method: "GET",
        dataType: "JSON",
        success: function (users) {
            for (let i = 0; i < users.length; i++) {
                if (users[i].username == $('#invite').val()) {
                    $('#invitesInThePool').append(`<option value='${users[i]._id}'>${$('#invite').val()}</option>`);
                }
            }
        },
        error: function (err) {
            console.log("err", err);
        }
    };

    $.ajax(settings);

    $('#invite').val('');
        
});
$("#deleteBtn").on("click", (event) => {
    event.preventDefault();
    let inviteToDelete = $('#invitesInThePool').val()[0];
    $("option").filter(`:contains('${inviteToDelete}')`).remove();
});

$("#submitBtn").on("click", (event) => {
    event.preventDefault();
    let newInvites = [];

    let currentInvites = $('#invitesInThePool option');
    for (let i = 0; i < currentTeams.length; i++) {
        let inviteToAdd = { 
            invitee: currentInvites[i].value,
            pool: localStorage.getItem("poolID"),
            status: "Pending" 
        }
        newInvites.push(inviteToAdd);
    }

    $.ajax({
        url: '/api/createInvites',
        method: "POST",
        data: JSON.stringify(newInvites), // info sent to the API
        dataType: "JSON", // returned type of the response
        contentType: "application/json", // type of sent data in the request
        success: function (responseJSON) {
            console.log(responseJSON);
        },
        error: function (err) {
            console.log("err", err);
        }
    });
});