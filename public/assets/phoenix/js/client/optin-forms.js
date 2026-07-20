(function ($) {
  let content_id = false;
  const stamp = new Date().getTime();

  var formSubmitting = false;

  const isChrome = navigator.userAgent.includes('Chrome');

  if (isChrome) {
    let jars = document.getElementsByName('maple_content');

    jars.forEach((jar) => {
      jar.setAttribute('autocomplete', 'none');
    });
  }

  $('body').on('click', '.optin-submit-btn', function (event) {
    let form = $(this).parents('div.pages-optin-form');

    if (formSubmitting == false) {
      formSubmitting = true;

      //Add spinner for feedback
      form.find('.optin-submit-btn').addClass('optin-btn-spinner');
      form.find('.optin-submit-btn').append('<i class="fa fa-spinner"></i>').show();

      attachOptinSubmitEvent(form);
    }
  });

  function attachOptinSubmitEvent(form) {
    formData = {};

    const lang = document.querySelector('meta[property="og:locale"]').getAttribute('content');

    var redirect_url = '';
    var consent_denied_redirect_url = '';

    var gdpr_consent_field = false;
    var consent_accepted = 'false';
    formData['consent_accepted'] = consent_accepted;

    var redirect_parameters_url = '';

    var inputs = $(form).find(':input');
    inputs.each(function (index, input) {
      if (input.name == 'redirect_url') {
        redirect_url = $(input).val();
      } else if (input.name == 'consent_denied_redirect_url') {
        consent_denied_redirect_url = $(input).val();
      } else if (input.name == 'consent_requested') {
        gdpr_consent_field = true;
      } else if (input.name == 'gdpr-check') {
        if ($(input).is(':checked')) {
          consent_accepted = 'true';
          formData['consent_accepted'] = consent_accepted;
        }
      } else if (input.name == 'element_id') {
        formData['submitted_from_element_id'] = $(input).val();
      } else {
        let name = input.name;
        if (name !== '') {
          let params = {
            email: 'email',
            firstname: 'firstname',
            lastname: 'lastname',
            first_name: 'firstname',
            last_name: 'lastname',
            fname: 'firstname',
            lname: 'lastname',
          };

          //add non prefixed params for PP checkout form prefill
          if (params[name.toLowerCase()]) {
            redirect_parameters_url =
              redirect_parameters_url + params[name.toLowerCase()] + '=' + $(input).val() + '&';
          }

          //add pages_ prefixed parameters
          redirect_parameters_url =
            redirect_parameters_url + 'pages_' + input.name + '=' + $(input).val();
          redirect_parameters_url = redirect_parameters_url + '&';
        }
      }
      formData[input.name] = $(input).val();
    });

    formData['submitted_from_url'] = window.location.href;
    formData['submitted_from_type_name'] = 'element';
    formData['submitted_from_page_type_id'] = window.page_type_id;
    formData['submitted_from_page_id'] = window.page_id;
    formData['loaded_at'] = stamp;

    $.ajax({
      type: 'POST',
      url: $(form).attr('action'),
      data: formData,
      dataType: 'json',
      encode: true,
    })
      .done(function (data) {
        if (data.success) {
          pagesOptinSuccess(data.redirect_url, data.input, lang, $(form).data('form-id'), form);
        } else {
          //Remove spinner
          form.find('.optin-submit-btn').removeClass('optin-btn-spinner');
          form.find('.optin-submit-btn').find('.fa-spinner').remove();

          pagesOptinFailed(data, form, lang);
        }
      })
      .fail(function (data) {
        //Remove spinner
        form.find('.optin-submit-btn').removeClass('optin-btn-spinner');
        form.find('.optin-submit-btn').find('.fa-spinner').remove();

        pagesOptinFailed(data, form, lang);
      });
  }

  function pagesOptinSuccess(redirectUrl, formInput, lang, formId = null, form = null) {
    var analyticsMeta = { conversion: 1 };

    if ($(form).data('label-id') && parseInt($(form).data('label-id')) !== 0) {
      analyticsMeta['label'] = parseInt($(form).data('label-id'));
    }

    if (window.phx_track && formId)
      window.phx_track('submitted_optin', 'emform' + formId, null, analyticsMeta);
    if (redirectUrl) {
      if (formInput) {
        // oi meaning opt-in input
        window.sessionStorage.setItem('phx-oi', formInput);
      }

      window.location.href = redirectUrl;
    } else {
      //Clear error message

      const wrapper = form.parent('.optin-form-wrapper').find('.two-step-notify-wrap');
      const twoStepOptinWrapper = form.parent('.two-step-popup').parent('.two-step-optin-wrapper');

      var errorMsgElement = wrapper.find('.error-txt');
      $(errorMsgElement).text('');
      //Edit succes message & other feedback for success
      var successMsgElement = wrapper.find('.success-txt');
      wrapper.find('.progress-text').text('100%');
      wrapper.find('.progress-bar-half').css('width', '100%');

      if (twoStepOptinWrapper.length === 0) {
        $('div').find(`[data-form-id='${formId}']`).hide();
      }

      wrapper.find('.two-step-form').hide();
      wrapper.find('.two-step-cta').hide();
      wrapper.find('.two-step-sub-title').hide();
      wrapper.find('.two-step-bottom-box').hide();

      let successMessage = 'Success! You have been subscribed!';

      if (lang === 'nl_NL') {
        successMessage =
          '<strong>Bedankt!</strong> <div style="margin-top:10px;">Je inschrijving is verstuurd.</div>';
      }

      if (twoStepOptinWrapper.length > 0) {
        twoStepOptinWrapper.find('.progress-text').text('100%');
        twoStepOptinWrapper.find('.progress-bar-half').css('width', '100%');
        form.find('button').hide();

        form
          .find('.two-step-form')
          .html(
            '<div style="color: #333;">' +
              successMessage +
              '<i class="fa fa-check-circle-o"></i></div>'
          );

        setTimeout(() => {
          twoStepOptinWrapper.hide();
        }, 2000);
      } else {
        $(successMsgElement).html(successMessage + '<i class="fa fa-check-circle-o"></i>');
      }
    }
    //Reset submitting
    formSubmitting = false;
  }

  function pagesOptinFailed(response, form, lang) {
    let error_message = response.message || '';
    console.log(!response);

    if (response.status === 422 || response.status === 400) {
      // error bag which is passed back from laravel is nested in responseJSON prop (no idea why, ajax has something to with it)
      let errors = response.responseJSON.errors;

      if (errors) {
        let fields = Object.getOwnPropertyNames(errors);

        // Remove previous error messages
        $("div[id*='error_bag_id_']").remove();

        let id = 0;

        fields.forEach((field) => {
          let form_field = form.find(`input[name='${field.toLowerCase()}']`);

          let error = errors[field][0].charAt(0).toUpperCase() + errors[field][0].slice(1);

          if (form_field) {
            form_field.after(
              `<div id="error_bag_id_${id}" class="form-error-message" style="font-size: 12px; margin-bottom: 20px; color: #ff3308;">${error}</div>`
            );
          }
        });
      }
    }

    //Edit succes message
    var errorMsgElement = $('.two-step-notify-wrap').find('.error-txt');
    $(errorMsgElement).text(error_message);
    //alert(error_message);
    //Reset submitting
    formSubmitting = false;
  }
})(jQuery);
