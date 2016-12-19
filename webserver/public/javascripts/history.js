$(document).ready(function(){
    var history_load = 0;
    $("#history_button").on('click', function(){
        if (history_load === 0 ){
            $.ajax({
                url: "/users/rating_history",
                type: "POST",
                data: {
                    uid: Cookies.get('uid')
                },
                success: ratingUserHistorySuccess,
                error: alertError
            });
            history_load = 1;
        }
    });
});

function ratingUserHistorySuccess(data, textStatus, jqXHR){
    for(i=0; i < data.length; i++){
        var rating = data[i].rating;
        var name = data[i].name;
        var image_url = data[i].image_url;
        var timestamp = data[i].timestamp.split("T0").join(" ").split("Z").join(" ");
        var comments = data[i].comments;
        var html = "<div class=\"row history_item\" style=\"margin-top: 2.5%; padding-bottom: 1.5%\"><div class=\"col-md-12\" style=\"text-align: center; background-color: #80DEEA; margin-bottom: 1.5%\"> <i>" + timestamp
            + "</i> </div> <div class=\"col-md-3\"> <img src=\"" + image_url 
            + "\" style=\"width:70%; height: 100%; border-radius: 5px;\"> </div> <div class=\"col-md-3\"> <canvas id=\"myChart" + i
            + "\" width=\"200\" height=\"200\"></canvas></div> <div class=\"col-md-6\" style=\"text-align: left; font-size: 25px;\"> <h2 style=\" font-weight: bold;\">" + name
            + "</h2>" + comments
            + "</div> </div>";
        $("#history_modal_wrapper").append(html);
        Chart.defaults.global.legend.display = false;
        Chart.defaults.global.tooltips.enabled = false;
        var ctx = document.getElementById("myChart" + i);
        var info = { labels: ["Red", "White"], datasets: [ { data: [rating, 5-rating], backgroundColor: [ "#A5D6A7", "#FFFFFF", ], hoverBackgroundColor: [ "#81C784", "#FFFFFF", ] }] };
        var myChart = new Chart(ctx, { type: 'doughnut', data: info, });
    }
}

function alertError(jqXHR, textStatus, errorThrown){
    alert(jqXHR.responseText);
}
