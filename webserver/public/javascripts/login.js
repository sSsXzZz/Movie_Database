$(document).ready(function(){
    // on login attempt send ajax request
    $("#login_request_button").on('click',  function(){
        $.ajax({
            url: "users/login",
            type: "POST",
            data: {
                username: $("#username_textfield").val(),
                password: $("#password_textfield").val(),
            },
            success: login_success,
            error: login_error
        });
    });
    $("#username_textfield,#password_textfield").keypress(function(e){
        if (e.keyCode ===13){
            $("#login_request_button").click();
        }
    });

    if (typeof Cookies.get('uid') !== "undefined"){
        $("#login_button").text("Account");
        $("#login_button").attr("href","account_link");
    }
});

function login_success(data, textStatus, jqXHR){
    // the responseText should contain the uid
    Cookies.set('uid',jqXHR.responseText);
    location.reload();
}

function login_error(jqXHR, textStatus, errorThrown){
    alert(jqXHR.responseText);
}
