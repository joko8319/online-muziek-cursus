/**
 * Created by Jelle on 05/01/2017.
 */
(function($) {

    $(window).scroll(function (event) {
        var scroll = $(window).scrollTop();

        if(scroll > 0) {
            $(".simple-navigation-unit").addClass("scrolled");
        }
        else {
            $(".simple-navigation-unit").removeClass("scrolled");
        }
    });

})(jQuery);
