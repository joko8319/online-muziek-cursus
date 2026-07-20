/* SPECIFIC Start Content Canon Scrolled into view */
function isScrolledIntoViewCC(elem) {
    if(elem.length != 0) {
        var docViewTop = $(window).scrollTop();
        var docViewBottom = docViewTop + $(window).height();

        var elemTop = $(elem).offset().top;
        var elemBottom = elemTop + $(elem).height();

        if($('.cc-index-wrapper').hasClass('sticky-index')) {
            elemTop = elemTop + 300;
        }

        return ((elemBottom <= docViewBottom) && (elemTop >= docViewTop));
    }
}

$(window).scroll(function(event) {
    if (!isScrolledIntoViewCC($('.cc-index-wrapper'))) {
        //Check if it's not a category template because we don't want it to be sticky then
        if(!$('.cc-index-wrapper').hasClass('category-index-wrapper')) {
            var element = $('.content-canon-related-articles');
            if(element.length !== 0) {
                var elemTop = $('.content-canon-related-articles').offset().top;
                var elemBottom = elemTop + ($('.content-canon-related-articles').height() - 40);

                if(elemBottom < $(window).scrollTop()) {
                    $('.cc-index-wrapper').addClass('sticky-index');
                }
            }
        }
    }

    if(isScrolledIntoViewCC($('.content-canon-related-articles'))) {
        $('.cc-index-wrapper').removeClass('sticky-index');
    }

    if( $('.cc-index-wrapper').hasClass('sticky-index')) {
        var articleHeight = $('.inner-content').height();
        var articleTop = $('.inner-content').offset().top;
        var articleBottom = articleHeight + articleTop;

        var indexHeight = $('.cc-index-wrapper').height();
        var indexTop = $('.cc-index-wrapper').offset().top;
        var indexBottom = indexHeight + indexTop;

        if(indexBottom > articleBottom) {
            $('.cc-index-wrapper').removeClass('sticky-index');
        } else {
            $('.cc-index-wrapper').addClass('sticky-index');
        }
    }
});

/* End Content Canon Scrolled into view */

/* Start Sharing script that appends URLs for buttons */
// Open share button links in popup window
if($('.whatsapp-share-btn').length !== 0) {``
    $('.whatsapp-share-btn').attr('href', 'whatsapp://send?text='+window.location.href);
}

$('body').on('click', '.share-post-btn-frame', function(e){
    //prevent normal linking
    e.preventDefault();

    //Get platform and create urls based on platform
    var platform = $(this).data('platform');

    if(platform === 'facebook') {
        var url = 'https://www.facebook.com/sharer/sharer.php?s=100&u='+window.location.href;
    }
    else if(platform === 'twitter') {
        var url = 'https://twitter.com/share?url='+window.location.href;
    }
    else if(platform === 'google') {
        var url = 'https://plus.google.com/share?url='+window.location.href;
    }
    else if(platform === 'pinterest') {
        let image_url = document.querySelector("meta[property='og:image']").getAttribute("content");
        if(image_url === '0') {
            image_url = 'https://app.phoenixsite.nl/pageomatic/assets/images/phoenix_logo_horizontal.png'
        }
        var url = 'https://www.pinterest.com/pin/create/bookmarklet/?url='+window.location.href+'&media='+image_url;
    }
    else if(platform === 'linkedin') {
        var url = 'https://www.linkedin.com/shareArticle?mini=true&url='+window.location.href;
    }

    window.open(url, "_blank", "width=600, height=400");

    return false;
});
/* End Sharing script that appends URLs for buttons */

/* SPECIFIC Start Timed content script */
if($('.timed-content').length !== 0) {
    let time_to_show = $('.timed-content').parents('.odd-even-row').attr('data-timed-content');

    if(typeof(time_to_show) !== 'undefined') {
        let time_array = time_to_show.split('.');
        let minutes = time_array[0] * 60000;
        let seconds = time_array[1] * 1000;
        let total_time = minutes+seconds;

        $('.timed-content').hide();

        // get attribute all following rows
        const all_following_rows = !!$('.timed-content').parents('.odd-even-row').attr('data-all-following-rows');
        // end
        if (all_following_rows) {
          $('[data-timed-content]').nextAll('.odd-even-row').hide();
          // find div and set parent
          $('[data-timed-content]').nextAll().find(".odd-even-row").parent().hide();
        }

        //Script to track is a certain iframe is clicked
        //We use this to start the timed content countdown
        let timed_content_triggered = false;

        if(!timed_content_triggered) {
            var monitor = setInterval(function() {
                var elem = document.activeElement;
                if(elem && elem.tagName == 'IFRAME'){
                    if(!timed_content_triggered) {
                        timed_content_triggered = true;
                        //Start the timeout when to show the content
                        setTimeout(function() {
                            $('.timed-content').fadeIn(150);
                            if (all_following_rows) {
                              $('[data-timed-content]').nextAll('.odd-even-row').fadeIn(150);
                              // find div and set parent
                              $('[data-timed-content]').nextAll().find(".odd-even-row").parent().fadeIn(150);
                            }
                        }, total_time);
                    }
                    clearInterval(monitor);
                }
            }, 100);
        }
    }
}
/* End Timed content script */

/* SPECIFIC Start Script to disable scroll on GoogleMap unless you click it or mouseOut */
$('.full-width-iframe').click(function() {
    $(this).find('iframe').addClass('clicked');
}).mouseleave(function(){
    $(this).find('iframe').removeClass('clicked');
});
/* End Script to disable scroll on GoogleMap unless you click it or mouseOut */

/* GLOBAL Make sure buttons can be aligned to the center */
$('.align-button, .double-btns, .scroll-to-btn').each(function() {
    if($(this).hasClass('align-center')) {
        $(this).parent('.double-btns').css('text-align', 'center');
    }
});

/* GLOBAL Menu repsonsive menus scripts */
$('.mobile-menu-btn-wrapper').click( function(event) {
    $('.mobile-menu-overlay').toggleClass('visible');
    $('.navigation-items-wrapper').toggleClass('visible');
    $(this).parents('.odd-even-row').css('overflow', 'initial');
});

$('.mobile-menu-overlay').click( function(event) {
    $('.mobile-menu-overlay').toggleClass('visible');
    $('.navigation-items-wrapper').toggleClass('visible');
    $(this).parents('.odd-even-row').css('overflow', 'inherit');
});

/* GLOBAL Script to close sub-menu on mobile's (click action) */
$('.menu-item').on('click', function(event) {
    var currentMenuItem = $(this);

    if(!$(this).find('.dropdown-menu').hasClass('open')) {
        $('.dropdown-menu').removeClass('open');
        $('.dropdown-menu').addClass('closed');
        $(currentMenuItem).find('.dropdown-menu').addClass('open');
        $(currentMenuItem).find('.dropdown-menu').removeClass('closed');
    }
    else {
        $(currentMenuItem).find('.dropdown-menu').removeClass('open');
        $(currentMenuItem).find('.dropdown-menu').addClass('closed');
    }
});

/* GLOBAL Check panels for FAQ & remove href links the plugin creates */
var panelExist = $('.panel-group');

if (panelExist != '') {
    var panels = $('.panel-group').find('.panel');
    $(panels).each(function (index) {
        $(this).children("a:first").removeAttr('href');
    });
}

$('body').on('click','.panel-heading',function() {
    var currentPanel = $(this).parents('.panel');
    $(currentPanel).find('.fa').toggleClass('fa-caret-right fa-caret-down');
    $(currentPanel).find('.panel-collapse').toggle();
});

/* SPECIFIC Hide comment box in blogposts when count = 0 */
var commentsExist = $('.comment-js-count');

if (commentsExist != '') {
    var commentBoxes = $('.comment-js-count');
    $(commentBoxes).each(function (index) {
       var commentCount = $(this).text();
        if(commentCount == '0') {
            $(this).parent().hide();
        }
    });
}

// SPECIFIC Check if gravity forms button is clicked, so we lock it for mutilple submits...
$('.gform_button').click(function() {
    //Reset body to be sure
    $('body').css('position', 'static');
    //Submit form just to be sure this is OK
    $(this).parents('.gform_wrapper').find('form').submit();
    $(this).css('pointer-events', 'none');
});

//Check if gravifyforms button is clicked, so we can send the user back to the form when there are errors
var formErrorExists = $('.validation_error').text();

if (formErrorExists != '') {
    //Check if error was in Pop-up so that we open popup, else, scroll to the form error
    if($(".validation_error").parents('.button-custom-popup').length) {
        var popupParent =  $(".validation_error").parents('.popup-trigger');
        popupParent.find('.progress-wrap').hide();
        openCustomPopup(popupParent);
    }
    else {
        $('html,body').animate({
            scrollTop: $(".validation_error").offset().top
        });
    }
}

//Same stuff but for success also
var formSuccessExists = $('.gform_confirmation_message').text();

if (formSuccessExists != '') {
    //Check if success msg was in Pop-up so that we open popup, else, scroll to the form success msg
    if($(".gform_confirmation_message").parents('.button-custom-popup').length) {
        var popupParent =  $(".gform_confirmation_message").parents('.popup-trigger');
        popupParent.find('.progress-wrap').hide();
        openCustomPopup(popupParent);
    }
    else {
        $('html,body').animate({
            scrollTop: $(".gform_confirmation_message").offset().top
        });
    }
}

// GLOBAL?? Hotfix for JS form submitting
$('body').on('touchstart click','input[type="submit"]',function(event) {
    var curForm = $(this).parents('form');
    curForm.submit();
});


/* SPECIFIC if the user uses a pop-up on buttons */
//Popup not open
var popupOpened = false;

//Different way to detect touch events on certain device
var clickEvent = (function() {
    if ('ontouchstart' in document.documentElement === true)
        return 'touchstart';
    else
        return 'click';
})();

// Detect ios 11_0_x affected
// NEED TO BE UPDATED if new versions are affected
var ua = navigator.userAgent,
    iOS = /iPad|iPhone|iPod/.test(ua),
    iOS11 = /OS 11_0_1|OS 11_0_2|OS 11_0_3|OS 11_1/.test(ua);

//Popup buttons
$('body').on('click','.popup-trigger',function(event) {
    //Set to fixed if iOS is 11
    if(iOS) {
        $('body').css('position','fixed');
    }

    $(this).parents('.slide-fade-up-true').css('transform', 'initial');
    $('.full-row').css('z-index', '1');
    $('.read-progress-wrapper').css('z-index', '1');
    $('#site-header').css('position','relative');
    $('#site-header').css('z-index','1');
    $(this).parents('.odd-even-row').css('overflow', 'initial');
    $(this).parents('.full-row').removeClass('overflow-hidden-parent');
    $(this).parents('.full-row').find('.content-unit').css('z-index','auto');
    $(this).parents('.full-row').css('z-index', '2000');
    $(this).parents('.full-hero-row').css('z-index', '400');
    var hasAbsoluteParent = $(this).parents('.full-row-center-absolute').html();

    if(hasAbsoluteParent == undefined) {
        $(this).find('.button-custom-popup-overlay').fadeIn(300);
    }
    else {
        $(this).find('.button-custom-popup-overlay').fadeIn(300);
    }

    if(popupOpened === false) {
        //Script for custom forms progressbar
        var inputFields = $('.popup-content-wrap.animate-form').find('input[type="text"]');
        var textAreas = $('.popup-content-wrap.animate-form').find('textarea');
        var totalFields = 0;
        var currentMovepoint = $(this).find('.end-point');
        var currentEndpoint = $(this).find('.move-point');
        var currentProgressBar = $(this).find('.progress-line-unfilled');
        var progressBarWidth = $(this).find('.progress-line-unfilled').width();
        var visibleFields = [];

        //Push input fields to the array
        $(inputFields).each(function (index) {
            if ($(this).is(':visible')) {
                visibleFields.push($(this));
            }

            var visibleField = $(this).is(":visible");
            if (visibleField == true) {
                totalFields++;
            }
        });

        //Push textareas fields to the array
        $(textAreas).each(function (index) {
            if ($(this).is(':visible')) {
                visibleFields.push($(this));
            }

            var textArea = $(this).is(":visible");
            if (textArea == true) {
                totalFields++;
            }
        });

        //Check how many steps we should have
        var progressStep = progressBarWidth / totalFields;
        var countFields = 0;

        //Run the progress script for ever visible field we have
        $(visibleFields).each(function (index) {

            $(this).change(function () {
                var hasTxt = $(this).val();

                //Check if there is text and if it hasn't been triggered yet
                if ((hasTxt != '') && (!$(this).hasClass('triggered'))) {
                    $(this).addClass('triggered');
                    var progressBarWidthNow = currentProgressBar.width();
                    var trueWidth = (progressBarWidthNow - progressStep);
                    currentProgressBar.width(trueWidth);
                    if (countFields < totalFields) {
                        countFields++;
                    }
                }

                if ((hasTxt == '') && ($(this).hasClass('triggered'))) {
                    $(this).removeClass('triggered');
                    var progressBarWidthNow = currentProgressBar.width();
                    var trueWidth = (progressBarWidthNow + progressStep);
                    currentProgressBar.width(trueWidth);
                    if (countFields < totalFields) {
                        countFields--;
                    }
                }

                //Finish the steps
                if (countFields == totalFields) {
                    currentMovepoint.hide();
                    currentEndpoint.css('background', '#689F38');
                    currentEndpoint.html('<i class="fa fa-check"></i>');
                }
            });
        });

        //Set opened to true for check failsafe
        popupOpened = true;
    }

});

// Hide custom popup if clicked somewhere else
$('body').on('click touchstart','.popup-trigger', function (e) {
    //e.preventDefault();
    if($(e.target).hasClass('close-custom-popup')) {
        e.stopImmediatePropagation();
        //Reset css
        $('body').css('position', 'static');
        $('.full-row').show();
        $('.full-row').css('z-index', 'auto');
        $('.read-progress-wrapper').css('z-index', '1000');
        $(this).parents('.full-row').css('z-index', 'auto');
        $(this).parents('.odd-even-row').css('overflow', 'inherit');
        $(this).parents('.full-row').addClass('overflow-hidden-parent');
        $(this).parents('.full-hero-row').css('z-index', 'auto');
        $(this).parents('.full-row').find('.content-unit').css('z-index','150');
        $('#site-header').css('position','static');
        $('.slide-fade-up-true').css('transform', 'translateY(0%)');
        $('.button-custom-popup-overlay').hide();
        popupOpened = false;
    }
    else if (!$(e.target).children().hasClass('close-custom-button-popup')) {
        //Do Nothing ;)
    }
    else {
        //Reset Css
        $('body').css('position', 'static');
        $('.full-row').show();
        $('.full-row').css('z-index', 'auto');
        $(this).parents('.full-row').css('z-index', 'auto');
        $(this).parents('.odd-even-row').css('overflow', 'inherit');
        $(this).parents('.full-hero-row').css('z-index', 'auto');
        $(this).parents('.full-row').addClass('overflow-hidden-parent');
        $(this).parents('.full-row').find('.content-unit').css('z-index','150');
        $('.read-progress-wrapper').css('z-index', '1000');
        $('#site-header').css('position','static');
        $('.slide-fade-up-true').css('transform', 'translateY(0%)');
        $('.button-custom-popup-overlay').hide();
        popupOpened = false;
    }
});

// Hide custom popup if clicked somewhere else
$('body').on('click touchend','.close-custom-popup', function (e) {
    e.stopImmediatePropagation();
    //Reset Css
    $('body').css('position', 'static');
    $('.full-row').show();
    $('.full-row').css('z-index', 'auto');
    $(this).parents('.full-row').css('z-index', 'auto');
    $(this).parents('.full-hero-row').css('z-index', 'auto');
    $(this).parents('.full-row').find('.content-unit').css('z-index','150');
    $('.read-progress-wrapper').css('z-index', '1000');
    $('#site-header').css('position','static');
    $('.slide-fade-up-true').css('transform', 'translateY(0%)');
    $('.button-custom-popup-overlay').hide();
    popupOpened = false;
});

//Function to open popup on form failure
function openCustomPopup (popup) {
    var currentPopup = $(popup);

    //Hotfixes for absolute heroes
    $(currentPopup).parents('.animation-child').css('transform', 'initial');

    //Set to fixed if iOS is 11
    if(iOS && iOS11 ) {
        $('body').css('position','fixed');
    }

    $('.full-row').css('z-index', '1');
    $('#site-header').css('position','relative');
    $('#site-header').css('z-index','1');
    currentPopup.parents('.full-row').css('z-index', '20');
    currentPopup.parents('.full-hero-row').css('z-index', '20');
    var hasAbsoluteParent = currentPopup.parents('.full-row-center-absolute').html();

    if(hasAbsoluteParent === undefined) {
        setTimeout(function() {
            $(currentPopup).find('.button-custom-popup-overlay').show();
        }, 2000);
    }
    else {
        setTimeout(function() {
            $(currentPopup).find('.button-custom-popup-overlay').show();
        }, 2000);
    }
}

// Open share button links in popup window
$('.share-container').on('click', '.popup', function(e){
    e.preventDefault();

    var url = $(this).attr('href');
    window.open(url, "_blank", "width=600, height=400");

    return false;
});

/* SPECIFIC Fix for empty USP blocks, this is a slight hack for the block-lists unit. Makes sure empty blocks will not be visible. */
var uspBlocksExist = $('.block-lists').find('.usp-list-item');

if (uspBlocksExist != '') {
    $(uspBlocksExist).each(function (index) {
        var hasContent = $(this).text();

        if (!hasContent.match(/[a-z]/i)) {
            $(this).addClass('hidden-block');
        }
    });
}

//SPECIFIC Blogpost share icons trigger
$('.share-trigger').click(function() {
    $('.subscribe-wrap').fadeOut(200);
    $('.share-icons-wrap').fadeIn(200);
});

$('.close-share-modal').click(function() {
    $('.share-icons-wrap').fadeOut(200);
});

$('body').on('touchstart click','.share-icons-wrap', function (e) {
    if (!$(e.target).children().hasClass('share-icons-modal')) {
        //Do Nothing ;)
    }
    else {
        $('.share-icons-wrap').fadeOut(200);
    }
});

$('.subscribe-btn').click(function() {
    $('.share-icons-wrap').fadeOut(200);
    $('.subscribe-wrap').fadeIn(200);
});

$('.close-subscribe-modal').click(function() {
    $('.subscribe-wrap').fadeOut(200);
});

$('body').on('touchstart click','.subscribe-wrap', function (e) {
    if (!$(e.target).children().hasClass('subscribe-modal')) {
        //Do Nothing ;)
    }
    else {
        $('.subscribe-wrap').fadeOut(200);
    }
});

//GLOBAL Check if the current version is a revision, else don't show some stuff
function findGetParameter(parameterName) {
    var result = null,
        tmp = [];
    location.search
        .substr(1)
        .split("&")
        .forEach(function (item) {
            tmp = item.split("=");
            if (tmp[0] === parameterName) result = decodeURIComponent(tmp[1]);
        });
    return result;
}

var isRevision = findGetParameter('isrevision');

if(isRevision == 'true') {
    console.log('This is a revision...');
}

//GLOBAL Remove all editing messages
$('.editing-mode-message').remove();

//SPECIFIC hover for woman theme, maybe make this general
$('.woman-theme .woman-theme-blur-hover').hover(function() {
    var allUnits = $('.woman-theme-blur-hover');
    $(allUnits).css('filter', 'grayscale(100%)') .css('transition', 'all 0.3s') ;
    //$(this).find('div').css('filter', 'grayscale(0%)');
    $(this).css('filter', 'grayscale(0%)');
}, function() {
    var allUnits = $('.woman-theme-blur-hover');
    $(allUnits).css('filter', 'grayscale(0%)');
});

//Open TweetQuote links in popup
$('.tweetquote').on('click', 'a', function (e) {
    e.preventDefault();

    var url = 'https://twitter.com/intent/tweet?url=';
    url += window.location.href;
    window.open(url, "_blank", "width=600, height=439");

    return false;
});

//GLOBAL Optin form tabindexes
var tabIndex = 1;

$('.optin-form-wrapper').find('input').each(function() {
    $(this).attr('tabindex', tabIndex);
    tabIndex = tabIndex+1;
});

//GLOBAL Check if the current version is a revision, else dont show some stuff
function findGetParameter(parameterName) {
    var result = null,
        tmp = [];
    location.search
        .substr(1)
        .split("&")
        .forEach(function (item) {
            tmp = item.split("=");
            if (tmp[0] === parameterName) result = decodeURIComponent(tmp[1]);
        });
    return result;
}

var isRevision = findGetParameter('isrevision');

if(isRevision === 'true') {
    $('.phoenix-admin-menu-wrapper').hide();
}

(function($) {

    // Track clicks on Internal Links in Phx-Analytics
    $(".sc-link").on('click', function(e){
        let internalLinkKeywordId = $(e.target).attr('data-internal-link-keyword-id');
        if(internalLinkKeywordId && window.phx_track_trough_beacon) {
            window.phx_track_trough_beacon('clicked_internal_link', `internal_link${internalLinkKeywordId}`, null, null);
        }
    });

    //Admin magnet thingy
    $('.magnet-admin-hide').click(function () {
        $(this).find('.admin-toggle-fa').toggleClass('fa-caret-up fa-caret-down');
        $(this).parent().find('.page-header-menu').toggle();
    });

    $('.navbar-toggle').click(function () {
        $('.navbar-collapse').toggleClass('showing');
    });

    //this makes sure that the clean_url is always parsed as data-href to facebook plug-ins, such as comments
    //If we do not use this, urls containing parameters will be seen as unique urls
    if(document.getElementById("fb-comment-section") !== null) {

        //Remove everything after # anchor
        var urlString =  window.location.href;
        urlString  = urlString.split("#")[0];
        urlString  = urlString.split("?")[0];

        $(".fb-comments").attr("data-href", urlString );
        $(".fb-like").attr("data-href", urlString );
        $(".fb-send").attr("data-href", urlString );
    }

    //SPECIFIC Timed content script
    function getLaunchItems() {
        $('.launch-item-content-holder').html('');

        var launchItems = $('.launch-item-content');
        var launchItemsCount = 0;

        if(launchItems != '') {

            $('.launch-item-content').each(function() {

                //Add unique class so we can trigger the right content
                launchItemsCount++;
                $(this).find('.launch-item-content-wrapper').attr('id', 'content-launch-item'+launchItemsCount);
                var currentLaunchItem = $(this).parent('.flex-box').find('.launch-item');
                currentLaunchItem.attr('id','launch-item'+launchItemsCount);

                //Get current time and the unlock-time of the current launch item
                var countdown = $(this).parent('.flex-box').find('.launch-item').find('.countdowner');
                var timedate = countdown.data('ct-dt');
                timedate = Date.parse(timedate);
                var todaydate = Date.parse(new Date());

                //if someone sets a # for an item
                var hash = window.location.hash.substr(1);
                //strip parameters, some thridparties tend to place these in the url via email or something
                hash = hash.split('?')[0];

                if(hash != '') {
                    $('.launch-item-content-holder').find('.launch-item-content-wrapper').addClass('inactive-content');
                    $('#launch-'+hash).find('.launch-item-title').addClass('active-title primary-c-bg');
                    $('#content-launch-'+hash).removeClass('inactive-content');
                    $('#content-launch-'+hash).addClass('active-content');
                }
                else if(launchItemsCount == 1) {
                    //$(currentLaunchItem).find('.launch-item-title').addClass('active-title primary-c-bg');
                    $(this).find('.launch-item-content-wrapper').addClass('active-content');
                }
                else {
                    $(this).find('.launch-item-content-wrapper').addClass('inactive-content');
                }

                if(timedate < todaydate) {
                    var currentHTML = $(this).html();
                    var parentRowContentHolder = $(this).parents('.launch-item-flex-parent').parent().find('.launch-item-content-holder');
                    $(parentRowContentHolder).append(currentHTML);
                    //$('.launch-item-content-holder').append(currentHTML);
                    if(launchItemsCount == 1) {
                        $(currentLaunchItem).find('.launch-item-title').addClass('active-title primary-c-bg');
                    }
                    $(this).parent('.flex-box').find('.launch-item-inactive').remove();
                    $(this).parent('.flex-box').find('.launch-item-inactive-title').removeClass('launch-item-inactive-title');
                    $(this).parent('.flex-box').find('.launch-item-content-wrapper').html('');
                }
                else {
                    $(this).html('');
                }

                //Show the clock if the item is still locked
                var isLocked = $(currentLaunchItem).find('.launch-item-inactive').length;

                if(isLocked != 0) {
                    $(currentLaunchItem).find('.launch-unlock').show();
                }

                $('.launch-item-content-holder').find('.launch-item-content-wrapper').addClass('inactive-content');
            });
        }

        //Locked message
        $('.launch-item-inactive, .launch-item-inactive-title, .clockdiv').click(function(e) {
            $('.launch-control-popup').find('.clockdiv').remove();
            //Show current CD in popup
            var thisCD = $(this).parents('.launch-item').find('.countdowner').clone();
            var thisPopupTxt = $(this).parents('.launch-item').find('.launch-item-popup-title').text();
            $('.launch-control-popup').append(thisCD);
            //Change text if it isn't an empty string
            if(thisPopupTxt != '') {
                $('.lauch-popup-msg').html(thisPopupTxt);
            }
            $('.launch-control-overlay').show();
        });

        // Hide unit select popup if clicked somewhere else
        $('body').on('click touchstart','.launch-control-overlay', function (e) {

            if (!$(e.target).children().hasClass('launch-overlay-close')) {
                //Do Nothing ;)
            }
            else {
                $('.launch-control-overlay').fadeOut(100);
            }
        });

        $('body').on('click touchstart','.close-launch-popup', function (e) {
            $('.launch-control-overlay').fadeOut(100);
        });

        //Click on the item with some check if content is locked or not
        $('.launch-item').click(function() {

            //Check if item is locked
            var isLocked = $(this).find('.launch-item-inactive').length;
            if(isLocked == 0) {
                $('.active-title').removeClass('active-title primary-c-bg');
                $('.active-content').addClass('inactive-content');
                $('.active-content').removeClass('active-content');
                var currentID = $(this).attr('id');
                $(this).find('.launch-item-title').addClass('active-title primary-c-bg');
                $('.launch-item-content-holder').find('#content-'+currentID).removeClass('inactive-content').addClass('active-content');
            }
        });
    }

    //Check if there are any launch-items/units and render them with this function
    getLaunchItems();

    //Do NOT ask me why, but this is a weird hotfix for safari on iPhone OS 10+ version...
    //For some reason they didn't append the src to the right iframe
    var framesHolder = $('.launch-item-content-content').find('.embed-container');

    //We're just appending the sources again...
    $(framesHolder).each(function() {
        var firstFrameSrc = $(this).find('iframe').attr('src');
        $(this).find('iframe').attr('src', firstFrameSrc);
    });


    /* SPECIFIC 'type this' script */
    $('.type-this').each(function () {
        var txt = $(this).text();
        var i = 0;
        var speed = 80;
        var elem = $(this);

        if($(this).find('.title-brush-stroke').length !== 0) {
            //Remove from main element
            elem.removeClass('type-this');
            //Set brush as main element
            elem = $(this).find('.title-brush-stroke');
            //Add type class to brush
            elem.addClass('type-this');
        }

        if (elem.children().length === 1) {
            elem.removeClass('type-this');
            elem = elem.children().first();
            elem.addClass('type-this');
        }

        elem.text('');

        if((elem.offset().top < 1000)) {
            if(!elem.hasClass('type-this-done')) {
                if (isScrolledIntoViewTypeThis(elem)) {
                    typeWriter(elem, txt, i, speed);
                }
            }
        } else {
            $(window).scroll(function(event) {
                if(!elem.hasClass('type-this-done')) {
                    if (isScrolledIntoViewTypeThis(elem)) {
                        typeWriter(elem, txt, i, speed);
                    }
                }
            });
        }


    });

    //Check if certain elements are in view to adjust the menu
    function isScrolledIntoViewTypeThis(elem) {
        var $window = $(window);
        var docViewTop = $window.scrollTop();
        var docViewBottom = docViewTop + $window.height();
        var elemTop = elem.offset().top;
        return (elemTop <= (docViewBottom - 60));
    }

    /* Specific for parallex backgrounds */
    window.addEventListener('scroll',  function(e) {
        $('.parallax-background').each(function() {
            if(isScrolledIntoViewParallax($(this))) {
                var $window = $(window);
                var docViewTop = $window.scrollTop();
                var docViewBottom = docViewTop + $window.height();
                var elemTop = $(this).parent().offset().top;
                let scrolled = 0;

                if($window.height() * 2 > 2200) {
                    scrolled = $window.scrollTop();
                } else if($window.scrollTop() < ($window.height() * 2)) {
                    scrolled = $window.scrollTop();
                } else {
                    scrolled = docViewBottom - elemTop;
                }
                $(this).css('top', '-' + (scrolled * 0.2) + 'px');
            }
            //$(this).style.top = - (scrolled * 0.6) + 'px';
        });
    });


    //Check if certain elements are in view to adjust the menu
    function isScrolledIntoViewParallax(elem) {
        var $window = $(window);
        var docViewTop = $window.scrollTop();
        var docViewBottom = docViewTop + $window.height();
        var elemTop = elem.parent().offset().top;
        return (elemTop <= (docViewBottom));
    }


    /* SPECIFIC when using scroll-to-buttons */
    setTimeout(function() {
        if($(".sticky-mobile-scroll-true").length !== 0) {
            var stickyMobileButtonOffset = $(".sticky-mobile-scroll-true").offset().top;

            if(stickyMobileButtonOffset === 0) {
                setTimeout(function() {
                    stickyMobileButtonOffset = $(".sticky-mobile-scroll-true").offset().top;
                }, 500);
            }

            $(window).scroll(function() {
                if(($(window).scrollTop()) > (stickyMobileButtonOffset) && $('.bottom-btn').length === 0) {

                    let aNodeParent = $('.sticky-mobile-scroll-true').closest('a');
                    let popupTriggers = $('.sticky-mobile-scroll-true').closest('.popup-trigger');
                    let scrollToTrigger = $('.sticky-mobile-scroll-true').closest('.scroll-to-btn');
                    let elementToClone;

                    if(aNodeParent.length !== 0){
                        elementToClone = $('.sticky-mobile-scroll-true').closest('a');
                    }
                    else if(popupTriggers.length !== 0) {
                        elementToClone = $('.sticky-mobile-scroll-true').closest('.popup-trigger');
                    }
                    else if(scrollToTrigger.length !== 0) {
                        elementToClone = $('.sticky-mobile-scroll-true').closest('.scroll-to-btn');
                    }
                    else {
                        elementToClone = $('.sticky-mobile-scroll-true');
                    }

                    elementToClone.clone().addClass('bottom-btn stick-to-bottom-mobile').appendTo('#wrapper .odd-even-row:visible:last').hide().fadeIn(150);

                    $('.stick-to-bottom-mobile').wrap('<div class="stick-to-bottom-mobile-wrap"></div>');
                    if($('.bottom-mobile-template').length !== 0) {
                        $('.stick-to-bottom-mobile-wrap').addClass('higher-bottom');
                    }
                }
                else {

                }
            });
        } else if($(".sticky-mobile-true").length !== 0) {
            let aNodeParent = $('.sticky-mobile-true').closest('a');
            let popupTriggers = $('.sticky-mobile-true').closest('.popup-trigger');
            let scrollToTrigger = $('.sticky-mobile-true').closest('.scroll-to-btn');
            let elementToClone;

            if(aNodeParent.length !== 0){
                elementToClone = $('.sticky-mobile-true').closest('a');
            }
            else if(popupTriggers.length !== 0) {
                elementToClone = $('.sticky-mobile-true').closest('.popup-trigger');
            }
            else if(scrollToTrigger.length !== 0) {
                elementToClone = $('.sticky-mobile-true').closest('.scroll-to-btn');
            }
            else {
                elementToClone = $('.sticky-mobile-true');
            }

            elementToClone.clone().addClass('bottom-btn stick-to-bottom-mobile').appendTo('#wrapper .odd-even-row:visible:last').hide().fadeIn(150);

            $('.stick-to-bottom-mobile').wrap('<div class="stick-to-bottom-mobile-wrap"></div>');
            if($('.bottom-mobile-template').length !== 0) {
                $('.stick-to-bottom-mobile-wrap').addClass('higher-bottom');
            }
        }
    }, 300);
}(jQuery));

/* SPECIFIC 'type this' script */
function typeWriter(item, txt, count, speed) {
    item.addClass('type-this-done');

    if (count < txt.length) {
        item.append(txt.charAt(count));
        count++;

        setTimeout(function() {
            typeWriter(item, txt, count, speed);
        }, speed);
    }
}

/* GLOBAL New menu items */
$(document).ready(function() {
    var clickEvent = (function() {
        if ('ontouchstart' in document.documentElement === true)
            return 'touchstart';
        else
            return 'click';
    })();

    $(".burger-menu-icon").on(clickEvent, function () {
        $(".mobile-menu-item-container").toggle();
        if($('.stick-to-bottom-mobile-wrap').length !== 0) {
            $('.stick-to-bottom-mobile-wrap').toggleClass('lower-z-index');
        }
    });

    $('.has-sub-menu').on('click', function(e) {
        if($(e.target).hasClass('top-level-name')) {
            //if(e.target.nodeName != 'A') {
            $(this).find('.mobile-sub-menu-wrapper').toggleClass('show-menu');

            setTimeout(function() {
                if($('.show-menu').length !== 0) {
                    $('.mobile-menu-item-container').addClass('stretch-screen');
                }
                else {
                    $('.mobile-menu-item-container').removeClass('stretch-screen');
                }
            }, 1);
        }
    });
});

//GLOBAL Ghost button hovers
//This is JS because of multiple css issues with custom button colors/borders
$('.general-btn-custom').hover(
    function() {
        var backgroundColor = $(this).css("background-color");

        if(backgroundColor === 'rgba(0, 0, 0, 0)') {
            $(this).addClass('custom-ghost-hover');
            var borderColor = $(this).css("border-color");

            if(borderColor != 'rgba(0, 0, 0, 0)') {
                var textColor = getCorrectTextColor(borderColor);
            }
            $(this).css('color', textColor);
            $(this).css('background-color', borderColor);
        }
    }, function() {
        var originalBorderColor = $(this).css("border-color");

        if($(this).hasClass('custom-ghost-hover')) {
            var backgroundColor = $(this).css("background-color");
            if(originalBorderColor != 'rgba(0, 0, 0, 0)') {
                $(this).css('color', originalBorderColor);
            }
            $(this).css('background-color', 'rgba(0, 0, 0, 0)');
        }
    }
);

/* contrasting color JS */
function getCorrectTextColor(color) {
    var color = color.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);

    var hex = (color && color.length === 4) ? "#" +
        ("0" + parseInt(color[1],10).toString(16)).slice(-2) +
        ("0" + parseInt(color[2],10).toString(16)).slice(-2) +
        ("0" + parseInt(color[3],10).toString(16)).slice(-2) : '';

    var threshold = 130; /* about half of 256. Lower threshold equals more dark text on dark background  */

    var hRed = hexToR(hex);
    var hGreen = hexToG(hex);
    var hBlue = hexToB(hex);

    function hexToR(h) {return parseInt((cutHex(h)).substring(0,2),16)}
    function hexToG(h) {return parseInt((cutHex(h)).substring(2,4),16)}
    function hexToB(h) {return parseInt((cutHex(h)).substring(4,6),16)}
    function cutHex(h) {return (h.charAt(0)=="#") ? h.substring(1,7):h}

    var cBrightness = ((hRed * 299) + (hGreen * 587) + (hBlue * 114)) / 1000;
    if (cBrightness > threshold){return "#000000";} else { return "#ffffff";}
}

// $(document).ready(function() {
//     //Check if there is a showindex shortcode in the content
//     let showindex_node = $('*:contains("[[showindex]]")').parent();
//     let cc_showindex_node = '';
//     let found_titles_content = '';
//
//     if(showindex_node.length > 0) {
//         showindex_node = showindex_node[showindex_node.length-1];
//
//         //Select a different HTML node for content canons
//         if($(showindex_node).attr('class') === 'sidebar-sticky') {
//             cc_showindex_node = '.cc-index-wrapper';
//             showindex_node = '.content-canon-desc';
//
//             if($('.category-content-content').length > 0) {
//                 found_titles_content = $('.category-content-content').find('h2');
//             }
//         }
//
//         let found_titles = $(showindex_node).find('h2');
//
//         if(found_titles_content !== '') {
//             found_titles = $.merge(found_titles, found_titles_content);
//         }
//
//         let index_to_replace = '';
//
//         index_to_replace += '<div class="article-index-wrapper"><ul>';
//         found_titles.each(function() {
//             let text = $(this).text();
//             var stripped_text = text.toLowerCase().replace(/ /g, '_');
//             stripped_text = stripped_text.replace('.', '');
//             stripped_text = stripped_text.replace('!', '');
//             stripped_text = stripped_text.replace('?', '');
//             stripped_text = stripped_text.replace(/\d/g, '');
//             stripped_text = stripped_text.replace(/[^\w]/g, '');
//
//             $(this).attr('id', stripped_text);
//             index_to_replace += '<li><a class="index-link" href="#'+stripped_text+'">'+ text +'</a></li>';
//         });
//         index_to_replace += '</ul></div>';
//
//         if(cc_showindex_node !== '') {
//             if(found_titles.length === 0) {
//                 $('.cc-index-wrapper').hide();
//             }
//
//             let new_index_html = $(cc_showindex_node).html().replace('[[showindex]]', index_to_replace);
//
//             $(cc_showindex_node).html(new_index_html);
//         } else {
//             let new_index_html = $(showindex_node).html().replace('[[showindex]]', index_to_replace);
//
//             new_index_html = new_index_html.replace(/<p>/g, '<div class=\'paragraph-style\'>');
//             new_index_html = new_index_html.replace(/<\/p>/g, '</div>');
//
//             $(showindex_node).html(new_index_html);
//         }
//
//         setTimeout(function() {
//             //Check for mobile view, css if different there so this will execute
//             if($('.cc-index-title').css('display') == 'none' || $('.article-index-wrapper').hasClass("mobile-toggle")) {
//                 //Insert these after different nodes on mobile
//                 if($('.blogpost-top-wrap').length !== 0) {
//                     $('.cc-index-wrapper').insertAfter('.blogpost-top-wrap');
//                 } else if($('.content-canon-title').length !== 0) {
//                     $('.cc-index-wrapper').insertAfter('.content-canon-title');
//                 } else {
//                     $('.cc-index-wrapper').insertAfter('.category-title');
//                 }
//
//                 if($('.content-canon-sidebar').length !== 0) {
//                     $('.content-canon-sidebar').insertAfter('.content-canon-desc');
//                 } else if($('.category-sidebar').length !== 0) {
//                     $('.category-sidebar').insertAfter('.content-canon-desc');
//                 }
//                 //$('.article-index-wrapper').show();
//                 $('.article-index-wrapper').addClass('mobile-toggle');
//                 $('.mobile-index').click(function() {
//                     $('.article-index-wrapper').toggle();
//                 });
//             }
//         }, 500);
//     }
// });

$(document).ready(function() {
        //Check for mobile view, css if different there so this will execute
        if($('.cc-index-title').css('display') == 'none' || $('.article-index-wrapper').hasClass("mobile-toggle")) {
            //Insert these after different nodes on mobile
            if($('.blogpost-top-wrap').length !== 0) {
                $('.cc-index-wrapper').insertAfter('.blogpost-top-wrap');
            } else if($('.content-canon-title').length !== 0) {
                $('.cc-index-wrapper').insertAfter('.content-canon-title');
            } else {
                $('.cc-index-wrapper').insertAfter('.category-title');
            }

            if($('.content-canon-sidebar').length !== 0) {
                $('.content-canon-sidebar').insertAfter('.content-canon-desc');
            } else if($('.category-sidebar').length !== 0) {
                $('.category-sidebar').insertAfter('.content-canon-desc');
            }
            //$('.article-index-wrapper').show();
            $('.article-index-wrapper').addClass('mobile-toggle');
            $('.mobile-index').click(function() {
                $('.article-index-wrapper').toggle();
            });
        }
});

$('body').on('click','.index-link', function(event) {
    event.preventDefault();
    let scrollToUnit = $(this).attr('href');

    //This is a fix to check what type of DOM element (body or html) the browser kit uses to determine the viewport and thus the scrolling element
    var nativeScrollElement = document.scrollingElement;

    if(navigator.userAgent.indexOf('MSIE')!==-1 || navigator.appVersion.indexOf('Trident/') > 0){
        $('body, html').animate({ scrollTop: ($(scrollToUnit).offset().top - 120)},  700, 'swing');
    }
    else {
        $(nativeScrollElement).animate({scrollTop: ($(scrollToUnit).offset().top - 120)}, 700, 'swing').promise().then(function() {
            //console.log("runs once!")
        });
    }
});

//Hotfix for links from Google with anchor
$(document).ready(function () {
    var isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);

    if (window.location.hash && isChrome) {
        setTimeout(function () {
            var hash = window.location.hash;

            var target = $(hash).offset().top - 120,
                scrollelement = $('html, body').scrollTop();

            $('html, body').scrollTop(scrollelement).animate({ scrollTop: target}, 500, function () {
                // nothing here
            });
        }, 500);
    }
});

$('.sub-menu-triangle, .sub-menu-container').hover(
    function() {
        $('.read-progress-wrapper').css('z-index','300');
    }, function() {
        $('.read-progress-wrapper').css('z-index','306');
    }
);

$('.sub-menu-container').mouseout(function() {

});
