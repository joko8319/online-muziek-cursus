var galleryArray = $('.image-gallery-item');
var galArrayIndex;
var currentGalleryIndex;

if(galleryArray != '') {
    $(document).keydown(function(e) {

        var arrayChecker = $('.image-gallery-item');
        var activeCheck = $(arrayChecker).filter('.active-gallery-img');
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
        checkGalArray('left');
    });

    $('body').on('click','.nav-gal-right', function() {
        checkGalArray('right');
    });
}

function checkGalArray (moveSide) {
    galleryArray = $('.image-gallery-item');
    var currentItem = $(galleryArray).filter('.active-gallery-img');
    currentGalleryIndex = galleryArray.index(currentItem);

    console.log(currentGalleryIndex);

    if(moveSide == 'left') {
        //remove current active
        $('.active-gallery-img').removeClass('active-gallery-img');

        currentGalleryIndex = currentGalleryIndex - 1;
        // If it is smaller than first item
        if(currentGalleryIndex < 0 ) {
            currentGalleryIndex = (galleryArray.length-1);
        }

        $(galleryArray[currentGalleryIndex]).addClass('active-gallery-img');

        var newHTML = galleryArray[currentGalleryIndex];
        var newImage = $(newHTML).find('img').attr('src');

        $('.popup-box-image').find('img').attr('src', newImage);

        console.log(currentGalleryIndex);
    }

    if(moveSide == 'right') {
        //remove current active
        $('.active-gallery-img').removeClass('active-gallery-img');

        currentGalleryIndex = currentGalleryIndex + 1;
        // If it is larger than last item
        if(currentGalleryIndex > (galleryArray.length-1)) {
            currentGalleryIndex = 0;
        }

        $(galleryArray[currentGalleryIndex]).addClass('active-gallery-img');

        var newHTML = galleryArray[currentGalleryIndex];
        var newImage = $(newHTML).find('img').attr('src');

        $('.popup-box-image').find('img').attr('src', newImage);

        console.log(currentGalleryIndex);
    }
}

$('body').on('touchstart click','.gallery-image, .gallery-overlay', function() {

    var currentImage = $(this).parent().find('img');
    galleryArray = $('.image-gallery-item');
    currentImage = currentImage.attr('src');

    console.log($(this));

    $(this).parents('.image-gallery-item').addClass('active-gallery-img');

    var currentItem = $(galleryArray).filter('.active-gallery-img');
    currentGalleryIndex = galleryArray.index(currentItem);

    console.log(galleryArray);
    console.log(currentItem);

    console.log(currentGalleryIndex);

    if($(this).closest('a').length !== 0) {
        let url = $(this).closest('a').attr('href');
        window.location.href = url;
    }

    $(this).parents('.odd-even-row').find('.popup-box-image').find('img').attr('src', currentImage);
    $(this).parents('.odd-even-row').find('.popup-box-image').fadeIn(150);
    $('.gallery-true-img').css('transform', 'scale(1)');
});

// Hide unit select popup if clicked somewhere else
$('body').on('touchstart click','.popup-box-image', function (e) {

    if (!$(e.target).children().hasClass('close-image-box')) {
        //Do Nothing ;)
    }
    else {
        $('.gallery-true-img').css('transform', 'scale(0.1)');
        $('.popup-box-image').fadeOut(100);
        $('.active-gallery-img').removeClass('active-gallery-img');
    }
});