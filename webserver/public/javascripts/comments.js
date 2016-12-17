  // Get the history modal
  var com_modal = document.getElementById('comments_modal');

  // Get the button that opens the modal
  var com_btn = document.getElementById("comments");

  // Get the <span> element that closes the modal
  var com_span = document.getElementById("comments_close");

  // When the user clicks the button, open the modal
  com_btn.onclick = function() {
      com_modal.style.display = "block";
  }

  // When the user clicks on <span> (x), close the modal
  com_span.onclick = function() {
      com_modal.style.display = "none";
  }

  // When the user clicks anywhere outside of the modal, close it
  window.onclick = function(event) {
      if ((event.target == hist_modal) || (event.target == set_modal) || (event.target == modal) || (event.target == sup_modal) || (event.target == com_modal)) {
          hist_modal.style.display = "none";
          set_modal.style.display = "none";
          modal.style.display = "none";
          sup_modal.style.display = "none";
      }
  }