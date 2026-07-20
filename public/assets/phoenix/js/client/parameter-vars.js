/**
 * Created by Douwe on 17/09/2018.
 * Note: replaced changing body innerhtml with specific element targeting because otherwise it will interfere with vue.js
 */

(function($) {
    function getUrlVars()
    {
        var vars = {}, hash;

        if((window.location.href.indexOf('?') + 1) > 0) {
            var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');

            for (var i = 0; i < hashes.length; i++) {
                hash = hashes[i].split('=');
                hash[0] = hash[0].replace(/pages_/g,'');
                vars[hash[0]] = hash[1];
            }
        }
        const optInInput = window.sessionStorage.getItem('phx-oi')
          ? JSON.parse(window.sessionStorage.getItem('phx-oi'))
          : {};

        return {...vars, ...optInInput};
    }

    function replaceText(selector, text, newText, flags) {
        var matcher = new RegExp(text, flags);
        var elems = document.querySelectorAll(selector), i;

        for (i = 0; i < elems.length; i++)
            if (!elems[i].childNodes.length)
                elems[i].innerHTML = elems[i].innerHTML.replace(matcher, newText);
    }

    var url_vars = getUrlVars();
    var current_url = document.URL;
    var non_pages_parameters_matched = false;
    var pages_vars_matched = false;

    // for(var i in url_vars)
    // {
    //     //check if pages var
    //     if(i) {
    //         var replace_string = '{pvar=' + i.replace(/pages_/g,'') + '}';
    //         var regex = new RegExp(replace_string, "g");
    //
    //         $("#wrapper *:contains(" + replace_string + ")").each(function() {
    //             pages_vars_matched = true;
    //             var replaced = $(this).html().replace(regex, url_vars[i]);
    //             replaced = replaced.replace(/%20/g, " ");
    //
    //             $(this).html(replaced);
    //         });
    //     }
    // }

    function findElementByText(text) {
        var node = $("*:contains(" + text + ")").filter(function() {
            return $(this).children().length === 0;
        });

        return node;
    }

    var found_nodes = findElementByText('{pvar');

    $(found_nodes).each(function() {
        var new_html = $(this).html().replace(/{pvar=(.*?)}/g, '<span class="text_to_replace">{pvar=$1}</span>');
        $(this).html(new_html);
    });

    //Split the nodes again in their own wrapper to prevent one node from having multiple pvars
    var split_found_nodes = $('.text_to_replace');

    $(split_found_nodes).each(function() {
        var replace_string = " pvardefault=\'(.*?)\'";
        var regex = new RegExp(replace_string, 'g');

        var contains_default;
        var arr = [];

        while ((contains_default = regex.exec($(this).text())) !== null) {
            arr.push(contains_default);
        }

        let strip_default = $(this).html().replace(regex, '');

        $(this).html(strip_default);

        //new regex and text to replace
        replace_string = '{pvar=(.*?)}';
        regex = new RegExp(replace_string);

        var text_to_replace = $(this).text().match("{pvar=(.*)}");

        if(typeof(url_vars[text_to_replace[1]]) !== 'undefined') {
            //pages_vars_matched = true;
            var replaced = $(this).html().replace(regex, url_vars[text_to_replace[1]]);
            replaced = replaced.replace(/%20/g, " ");
            $(this).html(replaced);
        } else {
            var self = $(this);
            if(arr.length > 1) {
                arr.forEach(function(item) {
                    var replaced = self.html().replace(regex, item[1]);
                    replaced = replaced.replace(/%20/g, " ");
                    self.html(replaced);
                });
            } else if(arr.length === 1) {
                var replaced = $(this).html().replace(regex, arr[0][1]);
                replaced = replaced.replace(/%20/g, " ");
                $(this).html(replaced);
            }
        }
    });


    function cleanUnMatchedParameters(regex) {
        var dom_element = $("#wrapper *:contains({pvar=)").first();
        if(dom_element.length > 0) {
            var replaced = $(dom_element).html().replace(regex, '');
            $(dom_element).html(replaced);

            if($("#wrapper *:contains({pvar=)").first().length > 0) {
                cleanUnMatchedParameters(regex);
            }
        }
    }

    function removePagesParameterFromHistory(current_url, url_vars) {
        var new_url = current_url.split('?')[0] + '?';

        for(var i in url_vars)
        {
            //check if not a pages var
            if(i.substring(0,6) !== 'pages_') {
                var new_url = new_url + '&' + i + '=' + url_vars[i];
            }
        }

        //remove last & or ?
        if(new_url.substring(new_url.length-1) == "?" || new_url.substring(new_url.length-1) == "&")
        {
            new_url = new_url.substring(0, new_url.length-1);
        }

        window.history.pushState({}, document.getElementsByTagName("title")[0].innerHTML, new_url);
    }

    //find all occurrences of our pattern that have not been replaced yet and remove them
    var regex = /{pvar=(.*?)}/g;

    if(url_vars.length > 0) {
        cleanUnMatchedParameters(regex);
    }

    if(pages_vars_matched) {
        removePagesParameterFromHistory(current_url, url_vars);
    }

})(jQuery);