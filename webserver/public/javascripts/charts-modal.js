  // Get the modal
var length_modal = document.getElementById('length_modal');

// Get the button that opens the modal
var length_btn = document.getElementById("length");

// Get the <span> element that closes the modal
var length_span = document.getElementById("length_close")

// When the user clicks the button, open the modal
length_btn.onclick = function() {
    length_modal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
length_span.onclick = function() {
    length_modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if ((event.target != modal) || (event.target != length_modal)) {
        modal.style.display = "none";
    }
}