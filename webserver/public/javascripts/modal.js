$(document).ready(function(){
  // Get the modal
  var modal = document.getElementById('modal1');

  // Get the <span> element that closes the modal
  var span = document.getElementsByClassName("close")[0];

  // When the user clicks the button, open the modal
  $("#login_button").on('click', function() {
      modal.style.display = "block";
  });

  // When the user clicks on <span> (x), close the modal
  span.onclick = function() {
      modal.style.display = "none";
  }

  // When the user clicks anywhere outside of the modal, close it
  window.onclick = function(event) {
      if (event.target == modal) {
          modal.style.display = "none";
      }
  }

  // Get the settings modal
  var set_modal = document.getElementById('settings_modal');

  // Get the button that opens the modal
  var set_btn = document.getElementById("settings_button");

  // Get the <span> element that closes the modal
  var set_span = document.getElementById("settings_close");

  // When the user clicks the button, open the modal
  set_btn.onclick = function() {
      set_modal.style.display = "block";
  }

  // When the user clicks on <span> (x), close the modal
  set_span.onclick = function() {
      set_modal.style.display = "none";
  }

  // When the user clicks anywhere outside of the modal, close it
  window.onclick = function(event) {
      if (event.target == set_modal) {
          set_modal.style.display = "none";
      }
  }

  // Get the history modal
  var hist_modal = document.getElementById('history_modal');

  // Get the button that opens the modal
  var hist_btn = document.getElementById("history_button");

  // Get the <span> element that closes the modal
  var hist_span = document.getElementById("history_close");

  // When the user clicks the button, open the modal
  hist_btn.onclick = function() {
      hist_modal.style.display = "block";
  }

  // When the user clicks on <span> (x), close the modal
  hist_span.onclick = function() {
      hist_modal.style.display = "none";
  }

  // When the user clicks anywhere outside of the modal, close it
  window.onclick = function(event) {
      if ((event.target == hist_modal) || (event.target == set_modal) || (event.target == modal)) {
          hist_modal.style.display = "none";
          set_modal.style.display = "none";
          modal.style.display = "none"
      }
  }
});
