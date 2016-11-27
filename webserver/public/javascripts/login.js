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
            success: loginSuccess,
            error: loginError
        });
    });

    $("#signup_request_button").on('click',  function(){
        $.ajax({
            url: "users/signup",
            type: "POST",
            data: {
                username: $("#username_textfield").val(),
                password: $("#password_textfield").val(),
            },
            success: loginSuccess,
            error: loginError
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
    }

    // logout
    $("#logout_button").on('click', function(){
        Cookies.remove('uid');
        location.reload();
    });
});

function loginSuccess(data, textStatus, jqXHR){
    // the responseText should contain the uid
    Cookies.set('uid',jqXHR.responseText, {expires: 1});
    location.reload();
}

function loginError(jqXHR, textStatus, errorThrown){
    alert(jqXHR.responseText);
}

function changeLoginToLogout(){
    $("#login_button").text("LOGOUT");
    $("#login_button").attr("href","#");
    $("#login_button").attr("id","logout_button");
}
