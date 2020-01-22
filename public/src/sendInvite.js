// import { set } from "mongoose";

let poolParticipants;

$("#inviteBtn").on("click", (event) => {
    event.preventDefault();
    
    let settings = {
        url: '/api/findUser/' + $('#invite').val(),
        method: "GET",
        dataType: "JSON",
        success: function (user) {
            console.log(user)
            console.log(user._id);
            console.log($("#invite"));
            console.log($('#invitesInThePool'));
            if (!checkParticipantIsInPool(user)) {
                $('#invitesInThePool').append(`<option value='${user._id}'>${$('#invite').val()}</option>`);
                
            }
            $('#invite').val('');
        },
        error: function (err) {
            console.log("err", err);
            $('#invite').val('');
        }
    };

    $.ajax(settings); 
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
    for (let i = 0; i < currentInvites.length; i++) {
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
            window.location.href = './pool.html';
        },
        error: function (err) {
            console.log("err", err);
        }
    });
});

function checkParticipantIsInPool(user) {
    for (let i = 0; i < poolParticipants.length; i++) {
        if (poolParticipants[i].participant == user._id) {
            return true;
        }
    }
    return false;
}

function getParticipantsFromPool() {
    let settings = {
        url: `/api/getPoolParticipants/${localStorage.getItem("poolID")}`,
        method: "GET",
        dataType: "JSON",
        success: function (responseJSON) {
            console.log(responseJSON)
            poolParticipants = responseJSON;
        },
        error: function (err) {
            console.log("err", err);
            $('#invite').val('');
        }
    };

    $.ajax(settings); 
}

getParticipantsFromPool();