/* Set the width of the side navigation to 250px */
function openNav() {
    if(typeof Cookies.get('uid') !== "undefined"){ 
        $(".user_sidebar").css('width', '20%');
        document.body.style.backgroundColor = "rgba(0,0,0,0.8)";
    } else{
        $("#login_button").click();
    }
}

/* Set the width of the side navigation to 0 */
function closeNav() {
    $(".user_sidebar").css('width', '0%');
    document.body.style.backgroundColor = "white";
}

function openSettings() {
	
}

function closeSettings() {
	
}
