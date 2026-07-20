//Show related articles
$('#postBlockPlaceholder').show();

//Check if certain elements are in view to adjust the menu
function isScrolledIntoViewBlog(elem) {
    if(elem.length != 0) {
        var docViewTop = $(window).scrollTop();
        var docViewBottom = docViewTop + $(window).height();

        var elemTop = $(elem).offset().top;
        var elemBottom = elemTop + $(elem).height();

        return ((elemBottom <= docViewBottom) && (elemTop >= docViewTop));
    }
}

/* Scroll check for blogpost share */
$(window).scroll(function(event) {

    //Check if sidedock sharing has reached end
    var blogpostWrap = $('.blogpost-unit-wrapper');

    // if blogpostWrap does not exist on page return to prevent js errors.
    // Otherwise it will block other scripts such as reading-progress
    if (!blogpostWrap.length) {
        return;
    }

    var offsetBP = blogpostWrap.offset();
    var blogpostBottom  = offsetBP.top + blogpostWrap.height();

    var stickyShares = $('.share-buttons-wrap');
    var offsetSS = stickyShares.offset();
    var stickyBottom  = offsetSS.top + stickyShares.height();

    //Add some to windowScroll
    var windowBottom = $(window).scrollTop() + 700;

    if((stickyBottom > blogpostBottom) && !$('.blogpost-share-wrap-sidedock').hasClass('bottom-stuck')) {
        $('.blogpost-share-wrap-sidedock').addClass('bottom-stuck');
    }
    else if ((stickyBottom > (windowBottom)) && $('.blogpost-share-wrap-sidedock').hasClass('bottom-stuck')) {
        $('.blogpost-share-wrap-sidedock').removeClass('bottom-stuck');
    }

    //Scrolled into view checks
    if (!isScrolledIntoViewBlog($('.blogpost-share-wrap-twostep'))) {
        if($('.blogpost-share-wrap-twostep').is(':visible')) {
            $('.blogpost-share-wrap-twostep').addClass('in-header');
            $('.blogpost-share-wrap-twostep').appendTo('.pages-nav-center');
            $('.pages-nav1, .pages-nav2').addClass('blogpost-exception-sticky');
            //$('.navbar-collapse').hide();
        }
    }
    else if (isScrolledIntoViewBlog($('.blogpost-top-wrap'))) {
        $('.blogpost-share-wrap-twostep').removeClass('in-header');
        $('.blogpost-share-wrap-twostep').insertAfter('.blogpost-info-wrap');
        $('.pages-nav1, .pages-nav2').removeClass('blogpost-exception-sticky');
        //$('.navbar-collapse').show();
    }

    if (!isScrolledIntoViewBlog($('.blogpost-share-wrap-onestep'))) {
        if($('.blogpost-share-wrap-onestep').is(':visible')) {
            //Check if user even scrolled a part of the page
            if (($(window).height() / 15) < $(window).scrollTop()) {
                $('.blogpost-share-wrap-twostep').addClass('in-header');
                $('.menu-bar').addClass('hidden');
                $('.blogpost-share-wrap-twostep').insertAfter('.menu-bar');

                //Old appendation
                $('.navbar-brand').find('img').addClass('tiny-logo');
                $('.blogpost-share-wrap-twostep').appendTo('.pages-nav-center');
                $('.pages-nav1, .pages-nav2').addClass('blogpost-exception-sticky');
                //$('.navbar-collapse').hide();
            }
        }
    }
    else if (isScrolledIntoViewBlog($('.blogpost-top-wrap'))) {
        $('.blogpost-share-wrap-twostep').removeClass('in-header');
        $('.blogpost-share-wrap-twostep').insertAfter('.blogpost-info-wrap');
        $('.menu-bar').removeClass('hidden');

        //Old appendation
        $('.pages-nav1, .pages-nav2').removeClass('blogpost-exception-sticky');
        //$('.navbar-collapse').show();
    }
});

//enable api for videos
if($('.embed-container').length != 0) {
    $('.embed-container').each(function() {
        if($(this).find('iframe').length != 0) {
            $(this).find('iframe')[0].src += "?enablejsapi=1&wmode=opaque&rel=0&ytp-pause-overlay=0";
        }
    });
}