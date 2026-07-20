/**
 * Created by Dennis on 04/07/2016.
 */
(function($) {

    //This is a fix to check what type of DOM element (body or html) the browser kit uses to determine the viewport and thus the scrolling element
    var nativeScrollElement = document.scrollingElement;

    $('body').on('click','.scroll-to-btn', function(event) {
        event.preventDefault();
        let scrollToUnit = $(this).data('scroll-to');

        scrollToUnit = $('[data-rowuuid="' +  scrollToUnit + '"]');

        if(scrollToUnit.length === 0) {
            scrollToUnit = $(this).data('scroll-to');
            scrollToUnit = '#'+scrollToUnit;
        }

        if(navigator.userAgent.indexOf('MSIE')!==-1 || navigator.appVersion.indexOf('Trident/') > 0){
            $('body, html').animate({ scrollTop: ($(scrollToUnit).offset().top - 70)},  700, 'swing');
        }
        else {
            $(nativeScrollElement).animate({scrollTop: ($(scrollToUnit).offset().top - 70)}, 700, 'swing').promise().then(function() {
                //console.log("runs once!")
            });
        }

        $('.mobile-menu-overlay').removeClass('visible');
        $('.navigation-items-wrapper').removeClass('visible');
    });

    /* Scroll mat for full screen units */
    $('body').on('click','.scroll-mat', function () {
        var windowHeight = $(window).height();

        var parentRow = $(this).parents('.odd-even-row');

        var nextRow = $(parentRow).nextAll('.odd-even-row').not(':hidden');

        if(nextRow.length !== 0) {
            var rowY = nextRow.offset();

            $('html, body').animate({ scrollTop: rowY.top-100}, 900);
        }
    });

})(jQuery);
