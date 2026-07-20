/* Lightbox for images gallery */
var portfolioArray = $('.portfolio-item');
var portArrayIndex;

if(portfolioArray != '') {
    $(document).keydown(function(e) {

        var portArrayChecker = $('.portfolio-item');
        var activeCheck = portArrayChecker.filter('.active-gallery-img');
        activeCheck = portArrayChecker.index(activeCheck);

        if(activeCheck != -1) {
            if (e.keyCode == 37) {
                //left key
                checkPortArray('left');
            }

            if (e.keyCode == 39) {
                //right key
                checkPortArray('right');
            }
        }
    });

    $('body').on('click','.nav-port-left', function() {
        checkPortArray('left');
    });

    $('body').on('click','.nav-port-right', function() {
        checkPortArray('right');
    });
}

function checkPortArray (moveSide) {
    portfolioArray = $('.portfolio-item');
    var currentItem = portfolioArray.filter('.active-gallery-img');
    var currentIndex = portfolioArray.index(currentItem);

    for (portArrayIndex = 0; portArrayIndex < portfolioArray.length; ++portArrayIndex) {
        var curVal = $(portfolioArray[portArrayIndex]);
    }

    if (moveSide === 'left') {
        //remove current active
        $('.active-gallery-img').removeClass('active-gallery-img');

        currentIndex = currentIndex - 1;
        // If it is smaller than first item
        if(currentIndex < 0 ) {
            currentIndex = (portfolioArray.length-1);
        }

        $(portfolioArray[currentIndex]).addClass('active-gallery-img');

        var newHTML = portfolioArray[currentIndex];
        var newHiddenHTML = $(newHTML).parent().find('.portfolio-item-content-wrapper');
        var newHiddenHTML = $(newHiddenHTML).html();
        var newImage = $(newHTML).find('img').attr('src');

        $('.portfolio-box-wrapper').find('img').attr('src', newImage);
        $('.final-portfolio-content-switch').html(newHiddenHTML);
    }

    if (moveSide === 'right') {
        //remove current active
        $('.active-gallery-img').removeClass('active-gallery-img');

        currentIndex = currentIndex + 1;
        // If it is larger than last item
        if(currentIndex > (portfolioArray.length-1)) {
            currentIndex = 0;
        }

        $(portfolioArray[currentIndex]).addClass('active-gallery-img');

        var newHTML = portfolioArray[currentIndex];

        var newHiddenHTML = $(newHTML).parent().find('.portfolio-item-content-wrapper');
        var newHiddenHTML = $(newHiddenHTML).html();
        var newImage = $(newHTML).find('img').attr('src');

        $('.portfolio-box-wrapper').find('img').attr('src', newImage);
        $('.final-portfolio-content-switch').html(newHiddenHTML);
    }
}

$('body').on('touchstart click','.portfolio-image, .portfolio-project-title', function() {
    var currentImage = $(this).parent().parent().find('img');
    if($(this).hasClass("portfolio-project-title")) {
        var currentContent = $(this).parent().parent().find('.final-portfolio-content').html();
        $(this).parent().addClass('active-gallery-img');
    }
    else {
        var currentContent = $(this).parent().parent().find('.final-portfolio-content').html();
        $(this).parent().addClass('active-gallery-img');
    }

    currentImage = currentImage.attr('src');

    $('.portfolio-box-wrapper').find('img').attr('src', currentImage);
    $('.final-portfolio-content-switch').html(currentContent);
    $('.portfolio-box-wrapper').fadeIn(100);
    $('.portfolio-item-popup').css('transform', 'scale(1)');
});

// Hide unit select popup if clicked somewhere else
$('body').on('touchstart click','.portfolio-box-wrapper', function (e) {
    if (!$(e.target).children().hasClass('close-portfolio-box')) {
        //Do Nothing ;)
    }
    else {
        $('.portfolio-item-popup').css('transform', 'scale(0.1)');
        $('.portfolio-box-wrapper').fadeOut(100);
        $('.active-gallery-img').removeClass('active-gallery-img');
    }
});

$('body').on('touchstart click','.close-portfolio-box-icon', function (e) {
    $('.portfolio-item-popup').css('transform', 'scale(0.1)');
    $('.portfolio-box-wrapper').fadeOut(100);
    $('.active-gallery-img').removeClass('active-gallery-img');
});



