(function($) {

    /* Script for Reading-Progress bar */
    setTimeout(function() {
        var pageHeight = $(document).height();
        var viewHeight = window.innerHeight;

        var lastPercentage = 0;
        pageHeight = pageHeight - viewHeight;

        $('.read-progress').css('width', '0%');

        $(window).scroll(function(event) {

            //Firefox Quirk?
            if(navigator.userAgent.search("Firefox") > -1) {
                var readPercentage = document.documentElement.scrollTop;
            }
            else {
                var readPercentage = window.pageYOffset || document.documentElement.scrollTop;
            }

            if(lastPercentage > readPercentage) {
                $('.read-progress').addClass('flipped');
            }
            else {
                $('.read-progress').removeClass('flipped');
            }

            //Update the last percentage
            lastPercentage = readPercentage;
            readPercentage = (readPercentage/pageHeight)*100;
            readPercentage = readPercentage+'%';

            $('.read-progress').css('width',readPercentage);
        });
    }, 1000);


}(jQuery));

