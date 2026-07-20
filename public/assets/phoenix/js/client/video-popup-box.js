var galleryArray = $('.video-gallery-item');
var galArrayIndex;

if(galleryArray !== '') {
    $(document).keydown(function(e) {

        var arrayChecker = $('.video-gallery-item');
        var activeCheck = arrayChecker.filter('.active-gallery-video');
        activeCheck = arrayChecker.index(activeCheck);

        if(activeCheck != -1) {
            if (e.keyCode == 37) {
                //left key
                checkGalArray('left');
            }

            if (e.keyCode == 39) {
                //right key
                checkGalArray('right');
            }
        }
    });

    $('body').on('click','.nav-gal-left', function() {
        checkVidGalArray('left');
    });

    $('body').on('click','.nav-gal-right', function() {
        checkVidGalArray('right');
    });
}

function checkVidGalArray (moveSide) {
    galleryArray = $('.video-gallery-item');
    var currentItem = galleryArray.filter('.active-gallery-video');
    var currentIndex = galleryArray.index(currentItem);

    for (galArrayIndex = 0; galArrayIndex < galleryArray.length; ++galArrayIndex) {
        var curVal = $(galleryArray[galArrayIndex]);
    }

    if(moveSide == 'left') {
        //remove current active
        $('.active-gallery-video').removeClass('active-gallery-video');

        currentIndex = currentIndex - 1;
        // If it is smaller than first item
        if(currentIndex < 0 ) {
            currentIndex = (galleryArray.length-1);
        }

        $(galleryArray[currentIndex]).addClass('active-gallery-video');

        var newHTML = galleryArray[currentIndex];
        var newVideo = $(newHTML).find('iframe').attr('src');

        $('.popup-box-video').find('iframe').attr('src', newVideo);
    }

    if(moveSide == 'right') {
        //remove current active
        $('.active-gallery-video').removeClass('active-gallery-video');

        currentIndex = currentIndex + 1;
        // If it is larger than last item
        if(currentIndex > (galleryArray.length-1)) {
            currentIndex = 0;
        }

        $(galleryArray[currentIndex]).addClass('active-gallery-video');

        var newHTML = galleryArray[currentIndex];
        var newVideo = $(newHTML).find('iframe').attr('src');

        $('.popup-box-video').find('iframe').attr('src', newVideo);
    }
}

$('body').on('click','.gallery-video, .gallery-overlay', function() {

    var currentVideo = $(this).parent().find('iframe');
    currentVideo = currentVideo.attr('src');

    if(currentVideo != '' && typeof(currentVideo) != 'undefined') {
        if(currentVideo.match('^https://www.youtube.com/') || currentVideo.match('^https://www.youtu.be/')) {
            currentVideo = currentVideo + '?autoplay=1';
        }
        else {
            currentVideo = currentVideo + '?autoplay=1';
        }

        $(this).parent().addClass('active-gallery-video');
        $(this).parents('.odd-even-row').find('.popup-box-video').find('iframe').attr('src', currentVideo);
        $(this).parents('.odd-even-row').find('.popup-box-video').fadeIn(150);
        $('.gallery-true-video').css('transform', 'scale(1)');
    }
});

// Hide unit select popup if clicked somewhere else
$('body').on('touchstart click','.popup-box-video', function (e) {

    if (!$(e.target).children().hasClass('close-video-box')) {
        //Do Nothing ;)
    }
    else {
        $('.gallery-true-video').css('transform', 'scale(0.1)');
        $('.popup-box-video').fadeOut(100);
        $('.true-video').attr('src','');
        $('.active-gallery-video').removeClass('active-gallery-video');
    }
});