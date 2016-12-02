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
    if ((event.target == length_modal)) {
        length_modal.style.display = "none";
    }
}


// DOM element where the Timeline will be attached
var container = document.getElementById('visualization');

// Create a DataSet (allows two way data-binding)
var items = new vis.DataSet([
{id: 1, content: 'Your Movie', start: '2013-04-20'},
{id: 2, content: 'Average Movie', start: '1999-04-14'},
]);

// Configuration for the Timeline
var options = {};

// Create a Timeline
var timeline = new vis.Timeline(container, items, options);