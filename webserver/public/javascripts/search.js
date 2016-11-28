$(document).ready(function(){
    $("#search_query").keypress(function(e){
        var query_content = $("#search_query").val();
        if (e.keyCode ===13 && query_content.length > 0){
            var params = {
                Movies: $("#search_movies_toggle").hasClass("searching"),
                Directors: $("#search_directors_toggle").hasClass("searching"),
                Actors: $("#search_actors_toggle").hasClass("searching"),
                q: query_content,
            };
            var query_string = $.param(params);
            location.href = "/search_results?" + query_string;
        }
    });
});
