function fakeScroll (scrollLength) {
    $(window).scrollTop($(window).scrollTop()+scrollLength);
    $(window).scrollTop($(window).scrollTop()-scrollLength);
}

//Hotfix for zoomed browsers
var browserZoomLevel = Math.round(window.devicePixelRatio * 100);

function triggerScroll() {
    if(browserZoomLevel !== 100) {
        fakeScroll(10);
    }
    else {
        fakeScroll(20);
    }
}

if (window.attachEvent) {window.attachEvent('onload', triggerScroll);}
else if (window.addEventListener) {window.addEventListener('load', triggerScroll, false);}
else {document.addEventListener('load', triggerScroll, false);}
//Run it when full doc is done
window.attachEvent && window.attachEvent("onload", triggerScroll);

//window.onload = triggerScroll;

//If browser is edge, because it's whacky
if (/Edge/.test(navigator.userAgent)) {
    setTimeout(function() {
        triggerScroll();
    }, 1000);
}



