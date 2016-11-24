
$(document).ready(function(){
    $("#login_request_button").on('click',  function(){
        $.ajax({
            url: "users/login",
            type: "POST",
            data: {
                username: "yash",
                password: "notthepassword",
            },
            success: login_success,
            error: login_error
        });
    });
});

function login_success(data, textStatus, jqXHR){
    console.log("WE DO LOGIN SHIT NOW");
}

function login_error(jqXHR, textStatus, errorThrown){
    alert(jqXHR.responseText);
}
