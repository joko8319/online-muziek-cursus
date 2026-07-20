/**
 * Created by Dennis on 04/07/2016.
 */
(function($) {
    //Get all slides
    var slides = $('.slides-wrapper').find('.testimonial-slide');
    //First slide is always 0 in array
    var slideIndex = 0;

    setTimeout(function() {
        //Show first slide
        $(slides[slideIndex]).fadeIn(200);
    }, 500);

    $('body').on('click', function(e) {
       if(e.target.classList.contains('quick-edit')) {
           slides = $('.slides-wrapper').find('.testimonial-slide');
           slideIndex = 0;
           $(slides[slideIndex]).fadeIn(200);
       }
    });

    $('body').on('click','#editor-mode', function() {
        slides = $('.slides-wrapper').find('.testimonial-slide');
        slideIndex = 0;
        $(slides[slideIndex]).fadeIn(200);
    });

    $('body').on('touchstart click', '.control-right', function() {

        //Hide last
        $(slides[slideIndex]).hide();
        //Show next
        slideIndex++;
        if(slideIndex === slides.length) {
            slideIndex = 0;
            $(slides[slideIndex]).fadeIn(200);
        }
        else {
            $(slides[slideIndex]).fadeIn(200);
        }
    });

    $('body').on('touchstart click', '.control-left', function() {

        //Hide last
        $(slides[slideIndex]).hide();
        //Show next
        slideIndex--;
        if(slideIndex < 0) {
            slideIndex = (slides.length-1);
            $(slides[slideIndex]).fadeIn(200);
        }
        else {
            $(slides[slideIndex]).fadeIn(200);
        }
    });

})(jQuery);
