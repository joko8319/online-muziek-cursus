(function($) {

    // Detect ios 11_0_x affected
    // NEED TO BE UPDATED if new versions are affected
    var ua = navigator.userAgent,
        iOS = /iPad|iPhone|iPod/.test(ua),
        iOS11 = /OS 11_0_1|OS 11_0_2|OS 11_0_3|OS 11_1/.test(ua);

    $('body').on('click touchstart','.two-step-trigger', function(e) {

        //Set to fixed if iOS is 11
        if(iOS) {
            $('body').css('position','fixed');
        }

        var popupToShow = $(this).parents('.optin-unit-form').find('.two-step-hidden-wrapper').find('.two-step-popup');
        var htmlToShow = popupToShow.html();

        $('.two-step-optin-wrapper').find('.two-step-popup').html(htmlToShow);
        $('.two-step-optin-wrapper').fadeIn(100).delay(300).queue(function(next){
            $(this).addClass('can-trigger').dequeue();
        });
    });

    // Hide unit select popup if clicked somewhere else
    $('body').on('click touchstart','.two-step-optin-wrapper', function (e) {
        if($('.two-step-optin-wrapper').hasClass('can-trigger')) {
            if (!$(e.target).children().hasClass('two-step-close')) {
                //Do Nothing ;)
            }
            else {
                $('body').css('position', 'static');
                $('.two-step-optin-wrapper').removeClass('can-trigger');
                $('.two-step-optin-wrapper').fadeOut(100);
            }
        }
    });

})(jQuery);