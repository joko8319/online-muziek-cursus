/**
 * Created by Dennis on 04/07/2016.
 */
(function($) {

    var animationParents = $('.animation-parent');
    var animationElements;
    var i = 0;

    animationElements = $(animationParents).find('.animation-child');

    $(animationParents).each(function( index ) {
        if(!$(this).parents('.effect-off').length) {
            var parentAnimation = $(this).data('animation');
            parentAnimation = parentAnimation + '-false';
            $(this).find('.animation-child').addClass(parentAnimation);
        }
    });

    /* Reset classes on certain actions */
    $('body').on('click','#preview-mode', function() {
        resetAnimations();
    });

    //Deprecated
    $('body').on('click','.animation-parent-trigger', function() {
        resetAnimations();
    });

    //When clicked on a placeholder in the builder
    $('body').on('click','.wireframe-ph', function() {
        resetAnimations();
    });

    function resetAnimations () {
        animationParents = $('.animation-parent');

        $(animationParents).each(function( index ) {
            if(!$(this).parents('.effect-off').length) {
                animationElements = $(animationParents).find('.animation-child');
                var parentAnimation = $(this).data('animation');
                parentAnimation = parentAnimation + '-false';
                var prevAnimationState = $(this).data('animation');
                prevAnimationState = prevAnimationState + '-true';
                $(this).find('.animation-child').removeClass(prevAnimationState);
                $(this).find('.animation-child').addClass(parentAnimation);
            }

            //Hotfix for zoomed browsers
            var browserZoomLevel = Math.round(window.devicePixelRatio * 100);

            if(browserZoomLevel != 100) {
                fakeScroll(10);
            }
            else {
                fakeScroll(1);
            }
        });
    }

    if (animationParents != null) {
        $(animationElements).each(function( index ) {
            if(($(this).offset().top + 200) < $(window).height()) {
                var animationType = $(this).parents('.animation-parent').data('animation');

                if(animationType == 'slide-in') {
                    $(this).removeClass('slide-in-false');
                    $(this).addClass('slide-in-true');
                }
                else if (animationType == 'fade-in') {
                    $(this).removeClass('fade-in-false');
                    $(this).addClass('fade-in-true');
                }
                else if (animationType == 'slide-in-ltr') {
                    $(this).removeClass('slide-in-ltr-false');
                    $(this).addClass('slide-in-ltr-true');
                }
                else if (animationType == 'slide-fade-up') {
                    $(this).removeClass('slide-fade-up-false');
                    $(this).addClass('slide-fade-up-true');
                }
            }
        });

        $(window).scroll(function(event) {
            $(animationElements).each(function( index ) {
                if(isScrolledIntoView($(this)) && !$(this).parents('.effect-off').length) {
                    var animationType = $(this).parents('.animation-parent').data('animation');

                    if(animationType == 'slide-in') {
                        $(this).removeClass('slide-in-false');
                        $(this).addClass('slide-in-true');
                    }
                    else if (animationType == 'fade-in') {
                        $(this).removeClass('fade-in-false');
                        $(this).addClass('fade-in-true');
                    }
                    else if (animationType == 'slide-in-ltr') {
                        $(this).removeClass('slide-in-ltr-false');
                        $(this).addClass('slide-in-ltr-true');
                    }
                    else if (animationType == 'slide-fade-up') {
                        $(this).removeClass('slide-fade-up-false');
                        $(this).addClass('slide-fade-up-true');
                    }
                };
            });

            i = 0;
        });

        // if (window.innerWidth <= document.body.clientWidth) {
        //     $(animationElements).each(function( index ) {
        //         var animationType = $(this).parents('.animation-parent').data('animation');
        //         if (animationType == 'slide-in') {
        //             $(this).removeClass('slide-in-false');
        //             $(this).addClass('slide-in-true');
        //         } else if (animationType == 'fade-in') {
        //             $(this).removeClass('fade-in-false');
        //             $(this).addClass('fade-in-true');
        //         } else if (animationType == 'slide-in-ltr') {
        //             $(this).removeClass('slide-in-ltr-false');
        //             $(this).addClass('slide-in-ltr-true');
        //         } else if (animationType == 'slide-fade-up') {
        //             $(this).removeClass('slide-fade-up-false');
        //             $(this).addClass('slide-fade-up-true');
        //         }
        //     });
        // }
    }

    // Script for fancy number increase
    var uspNumbersExist = $('.animation-number');

    if (uspNumbersExist !== '') {
        $(window).scroll(function(event) {
            var numberEl = $('.animation-number');
            $(numberEl).each(function (index) {
                if (isScrolledIntoView($(this)) && !$(this).hasClass('effect-initiated') && !$(this).parents('.effect-off').length) {
                    $(this).addClass('effect-initiated');

                    var singleNum = $(this).text();
                    var countNum = '';
                    var allLetters = $(this).text();

                    checkFontStyle($(this));

                    allLetters = allLetters.replace(/[0-9]*/g, '');
                    allLetters = allLetters.replace(/,/g, '.');
                    allLetters = allLetters.replace(/./g, '');

                    var onlyLetters = false;

                    countNum = singleNum.replace(/\./g, '');
                    countNum = countNum.replace(/,/g, '.');

                    var trueNum = parseFloat(countNum.replace(/[^\d\.]*/g, ''));

                    var regex = /^[a-zA-Z\s]+$/;
                    if ((regex.test(allLetters)) && (isNaN(trueNum))) {
                        onlyLetters = true;
                    }

                    //If we found a number / float
                    if (!isNaN(trueNum) && trueNum != '' && !onlyLetters) {
                        var currentEl = $(this);
                        var startNum = trueNum / 100;
                        startNum = Math.round(startNum);

                        $({countNum: startNum}).animate({countNum: trueNum}, {
                            duration: 1500,
                            easing: 'swing',
                            step: function () {
                                $(currentEl).text((this.countNum.toFixed(0))+' '+allLetters);
                            },
                            complete: function () {
                                $(currentEl).text(singleNum);
                            },
                        })

                    }
                }
            });
        });
    }

    // checks if the text contains a fontstyle
    function checkFontStyle(element) {
        var hasStrong = element.has('strong');
        var hasItalic = element.has('em');
        var hasUnderline = element.has('u');

        if(hasStrong.length !== 0) {
            element.wrap('<strong></strong>');
        }
        if(hasItalic.length !== 0) {
            element.wrap('<em></em>');
        }
        if(hasUnderline.length !== 0) {
            element.wrap('<u></u>');
        }
    }

    //Check if an element comes into view
    function isScrolledIntoView(elem) {
        var $elem = $(elem);
        var $window = $(window);
        var docViewTop = $window.scrollTop();
        var docViewBottom = docViewTop + $window.height();
        var elemTop = $elem.offset().top;
        return (elemTop <= (docViewBottom - 60));
    }

    function fakeScroll (scrollLength) {
        $(window).scrollTop($(window).scrollTop()+scrollLength);
        $(window).scrollTop($(window).scrollTop()-scrollLength);
    }

    //Hotfix for zoomed browsers
    var browserZoomLevel = Math.round(window.devicePixelRatio * 100);

    if(browserZoomLevel != 100) {
        fakeScroll(10);
    }
    else {
        fakeScroll(1);
    }

})(jQuery);
