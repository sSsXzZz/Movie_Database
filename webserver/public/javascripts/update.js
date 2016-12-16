// function updateSize(){
//     //var minHeight = parseInt($('.owl-item').eq(0).css('height'));
//     $('.owl-item').each(function () {
//         /*var thisHeight = parseInt($(this).find('img').css('height'));
//         if (thisHeight < 100)
//         {
//           return;
//         }
//         minHeight = (minHeight <= thisHeight ? minHeight:thisHeight);
//         */
        
//         var pict = $(this).find('img');
//         $(this).css('height', 200 + 'px');

//         var maxHeight = 200;
//         var ratio = 0;
//         var width = pict.width();
//         var height = pict.height();
//         console.log("Orig Width: " + width + "Orig Height: " + height);
//         if (height > maxHeight){
//             ratio = maxHeight / height;
//             pict.css("height", maxHeight);
//             pict.css("width", width* ratio);
//             width = width * ratio;
//             height = height * ratio;
//         }

//         if (height < maxHeight)
//         {
//             ratio = maxHeight / height;
//             pict.css("height", maxHeight);
//             pict.css("width", width*ratio);
//             width = width*ratio;
//             height = height * ratio;
//         }

//         pict.css('display', 'block');
//         pict.css('margin', 'auto');

//         var nw = pict.width();
//         var nh = pict.height();
//         console.log("New width: " + nw + "New Height: " + nh);

//         //$(this).find('img').css('height', 200 + 'px');
//     });
//     $('.owl-wrapper-outer').css('height', 220 + 'px');
// }

function updateSize(){
    var minHeight = 300;

    var count = 0;

    $('.owl-item').each(function () {
        if ($(this).find('img').hasClass('blank'))
        {
            return;
        }
        var thisHeight = parseInt($(this).find('img').css('height'));
        console.log(count + ',' + thisHeight);
        count += 1;
        if (thisHeight < 100)
        {
          return;
        }
        minHeight = (minHeight <= thisHeight ? minHeight:thisHeight);
    });

    var maxHeight = minHeight;

    $('.owl-item').each(function(){
        
        var pict = $(this).find('img');

        var ratio = 0;
        var width = pict.width();
        var height = pict.height();
        console.log("Orig Width: " + width + "Orig Height: " + height);
        if (height > maxHeight){
            ratio = maxHeight / height;
            pict.css("height", maxHeight);
            pict.css("width", width* ratio);
            width = width * ratio;
            height = height * ratio;
        }

        if (height < maxHeight)
        {
            ratio = maxHeight / height;
            pict.css("height", maxHeight);
            pict.css("width", width*ratio);
            width = width*ratio;
            height = height * ratio;
        }

        var nw = pict.width();
        var nh = pict.height();
        $(this).css('height', minHeight+'px');
        console.log("New width: " + nw + "New Height: " + nh);
    });


    minHeight += 20;
    $('.owl-wrapper-outer').css('height', minHeight+'px');
    console.log(minHeight);
}