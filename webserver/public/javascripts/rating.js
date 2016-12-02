$(document).ready(function(){
    'use strict';

    // SHOP ELEMENT
    var shop = document.querySelector('#shop');

    // DUMMY DATA
    var data = [
      {
        title: "",
        description: "",
        rating: 0
      },
    ];

    // INITIALIZE
    (function init() {
      for (var i = 0; i < data.length; i++) {
        addRatingWidget(buildShopItem(data[i]), data[i]);
      }
    })();

    // BUILD SHOP ITEM
    function buildShopItem(data) {
      var shopItem = document.createElement('div');

      var html = '<div class="c-shop-item__img"></div>' +
        '<div class="c-shop-item__details">' +
          '<p style="left:10px; font-family: ' + "'Open Sans', sans-serif; font-size:30px;" + '">' + data.title + '</h3>' +
          '<p class="c-shop-item__description">' + data.description + '</p>' +
          '<ul class="c-rating" style="margin:5% 0 0 32.5% "></ul>' +
        '</div>';

      shopItem.classList.add('c-shop-item');
      shopItem.innerHTML = html;
      shop.appendChild(shopItem);

      return shopItem;
    }

    // ADD RATING WIDGET
    function addRatingWidget(shopItem, data) {
      var ratingElement = shopItem.querySelector('.c-rating');
      var currentRating = data.rating;
      var maxRating = 5;
      var callback = function(rating) { alert(rating); };
      var r = rating(ratingElement, currentRating, maxRating, callback);
    }
});
