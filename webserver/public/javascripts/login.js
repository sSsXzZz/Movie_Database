$(document).ready(function(){
    // on login attempt send ajax request
    $("#login_request_button").on('click',  function(){
        $.ajax({
            url: "/users/login",
            type: "POST",
            data: {
                username: $("#username_textfield").val(),
                password: $("#password_textfield").val(),
            },
            success: loginSuccess,
            error: alertError
        });
    });

    $("#signup_request_button").on('click',  function(){
        $.ajax({
            url: "/users/signup",
            type: "POST",
            data: {
                username: $("#username_textfield").val(),
                password: $("#password_textfield").val(),
            },
            success: loginSuccess,
            error: alertError
        });
    });

    $("#username_textfield,#password_textfield").keypress(function(e){
        if (e.keyCode ===13){
            $("#login_request_button").click();
        }
    });

    // cookie found so logged in
    if (typeof Cookies.get('uid') !== "undefined"){
        changeLoginToLogout();
        var username = Cookies.get('username');
        $("#sidebar_username").text(username);
        if( Cookies.get('super_user') === "0"){
            $('#superuser_button').hide();
        }
    }

    // logout
    $("#logout_button").on('click', function(){
        Cookies.remove('uid');
        Cookies.remove('username');
        Cookies.remove('super_user');
        location.reload();
    });

    $("#password_update_button").on("click", function(){
        var username = $("#change_username").val();
        var old_pass = $("#old_password").val();
        var new_pass = $("#new_password").val();
        $.ajax({
            url: "/users/change_password",
            type: "POST",
            data: {
                username: username,
                old_pass: old_pass,
                new_pass: new_pass,
            },
            success: passwordChangeSuccess,
            error: alertError,
        });
    });
});

function loginSuccess(data, textStatus, jqXHR){
    // the responseText should contain the uid
    var response = JSON.parse(jqXHR.responseText);
    Cookies.set('uid',response.id, {expires: 1});
    Cookies.set('username', response.username, {expires: 1});
    Cookies.set('super_user', response.super_user, {expires: 1});
    location.reload();
}

function passwordChangeSuccess(data, textStatus, jqXHR){
    alert(data);
}

function alertError(jqXHR, textStatus, errorThrown){
    alert(jqXHR.responseText);
}

function changeLoginToLogout(){
    $("#login_button").text("LOGOUT");
    $("#login_button").attr("href","#");
    $("#login_button").attr("id","logout_button");
}
