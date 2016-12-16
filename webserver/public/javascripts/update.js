function updateSize(){
    //var minHeight = parseInt($('.owl-item').eq(0).css('height'));
    $('.owl-item').each(function () {
        /*var thisHeight = parseInt($(this).find('img').css('height'));
        if (thisHeight < 100)
        {
          return;
        }
        minHeight = (minHeight <= thisHeight ? minHeight:thisHeight);
        */
        
        var pict = $(this).find('img');
        $(this).css('height', 200 + 'px');

        var maxHeight = 200;
        var ratio = 0;
        var width = pict.width();
        var height = pict.height();

        if (height > maxHeight){
            ratio = maxHeight / height;
            pict.css("height", maxHeight);
            pict.css("width", width* ratio);
            width = width * ratio;
            height = height * ratio;
        }

        pict.css('display', 'block');
        pict.css('margin', 'auto');

        //$(this).find('img').css('height', 200 + 'px');
    });
    $('.owl-wrapper-outer').css('height', 220 + 'px');
}