var fbCjsAsync = false;

(function ($) {
    $.fn.loadingdots = function (options) {
        var dotTopPos = $('button.submit').height() / 2 + 2;
        var dotBgColor = $('button.submit').css('color');

        var i = 0, settings = $.extend({}, { duration: 250 }, options),

        bucle = function () {
            var $el = $(this), cycle, timing = i * settings.duration, first = true;
            $el.css('top', dotTopPos).css('background', dotBgColor);
            i++;

            cycle = function () {
                // if it's not the first time the cycle is called for a dot then the timing fired is 0
                if (!first)
                    timing = 0;
                else
                    first = false;
                // delay the animation the timing needed, and then make the animation to fadeIn and Out the dot to make the effect
                $el.delay(timing)
                  .fadeTo(1000, 0.4)
                  .fadeTo(1000, 0, cycle);
            };

            cycle(first);
        };
        //does not in use more then one loader for every element where the plugin was called we create the loading dots html and start the animations
        return this.each(function () {
            $(this).append('<span class="dot g_cell"></span><span class="dot g_cell"></span><span class="dot g_cell"></span>');
            $(this).find('.dot').each(bucle);
        });

    };
})(jQuery);

var showProcessingIndication_flag = false;
function showProcessingIndication() {
    if (showProcessingIndication_flag) return;
    showProcessingIndication_flag = true;
    $('button.submit').data('form-submitted', true);
    $('button.submit').css('min-width', '100px');
    $('button.submit').html($('#btn_processing .btn_processing'));
    $('button.submit .btn_processing .loadingdots').height($('button.submit').height());
    $('button.submit .btn_processing .loadingdots').loadingdots();
}

function body_on_mouseover() {
    if (fbCjsAsync) return;
    fbCjsAsync = true;
    (function (d, s, id) {
        var js, fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) return;
        js = d.createElement(s); js.id = id;
        js.src = "//connect.facebook.net/en_US/all.js#xfbml=1&appId=306262559461671";
        fjs.parentNode.insertBefore(js, fjs);
    }
    (document, 'script', 'facebook-jssdk'));
}

$(document).ready(function () {
    if (inIframe()) {
        parent.postMessage($(".main").height(), "*");
    }

    var video_iframe = $(".youtube_full_screen");
    if (video_iframe.length != 0) {
        var screenWidth = $(window).width();
        var screenHeight = screenWidth * 0.6;
        $(video_iframe).css('width', screenWidth).css('height', screenHeight);
    }

    //support for select 2 in edge browser
    if (/Edge\//i.test(navigator.userAgent)) {
        $(".select2-container").show();
    }

    $('button.submit').data('form-submitted', false);

    var isRequired = IsRequiredFieldExist();
    if (isRequired === false) {
        $('button.submit').click(function () {
            var isEmptyFields = IsEmptyFields();
            if (isEmptyFields === true) { return false; }
        });
    }

    $('.CheckboxIsRequired').each(function () {
        var checkBox = $(this);
        $($(this).find('.iCheck-helper')).each(function () {
            $(this).click(function () {
                checkBox.find('.CheckboxIsRequiredErr').hide();
            });
        });
    });

    trimSpacesBeforeValidationEngineCall();
});

function trimSpacesBeforeValidationEngineCall() {
    $('button.submit').click(function () {
        $('form:first input').each(function () {
            var input = $(this);
            input.val(input.val().trim());
        });
    });

    rebindOnclickEvent('button.submit');
}

function rebindOnclickEvent(element) {
    $.each($(element), function (index, value) {
        var clickFunction = $(value).prop('onclick');
        $(value).removeProp('onclick');
        $(value).click(clickFunction);
    });
}


function inIframe() {
    try {
        return window.self !== window.top;
    } catch (e) {
        return true;
    }
}

function setIframeOriginalHeight() {
    if (inIframe()) {
        parent.postMessage($(".main").height(), "*");
    }
}

function validateMainForm(gFormID) {
    if ($('button.submit').data('form-submitted')) {
        return false; // prevent double submit
    }

    IsRequiredMultiCheckboxFieldEmpty(gFormID);
    if ($('form:first').validationEngine('validate', gFormID)) {
        var isRequiredMultiCheckboxEmpty = IsRequiredMultiCheckboxFieldEmpty(gFormID);
        if (isRequiredMultiCheckboxEmpty) { return false; }
        showProcessingIndication();
        if ($("#RedirectToUrl").val() === "thanks") {
            url = window.location.href + (window.location.href.indexOf('?') == -1 ? '?' : '&') + "t=thanks";
            try {
                //WebForm_DoPostBackWithOptions(new WebForm_PostBackOptions('uf_submit', '', false, '', url, false, false));
                $('form').attr("action", url);
            }
            catch (e) { return true; }
        }
        else { return true; }
    }
    else { return false; }
}

function IsRequiredMultiCheckboxFieldEmpty(form_ID) {
    var isEmptyField = false;
    var isEmptyFields = false;
    var field_ID = "";
    $('.CheckboxIsRequired').each(function () {
        isEmptyField = true;
        $($(this).find('input[type=checkbox]')).each(function () {
            if ($(this).attr('id').indexOf(form_ID) >= 0) {
                field_ID = $(this).attr('id');
            }
            if ($(this).prop("checked")) {
                isEmptyField = false;
                return false;
            }
        });
        if (field_ID != "")
        {
            if (isEmptyField) {
                $(this).find('.CheckboxIsRequiredErr').show();
                isEmptyFields = true;
            }
            else {
                $(this).find('.CheckboxIsRequiredErr').hide();
            }
            return false;
        }
    });
    if (isEmptyFields) {
        return true;
    }
    else {
        return false;
    }
}

function IsRequiredFieldExist() {
    var isRequiredField = false;
    try {
        $('input[type=text]').each(function () {
            if ($(this).attr('class').indexOf('required') >= 0) {
                isRequiredField = true;
                return true;
            }
        })
        $('select').each(function () {
            if ($(this).attr('class').indexOf('required') >= 0) {
                isRequiredField = true;
                return true;
            }
        })
    } catch (e) {
        console.log("function IsRequiredFieldExist error: " + e);
    }

    if (isRequiredField === true) {
        return true;
    }
    else {
        return false;
    }
}

function IsEmptyFields() {
    var isEmptyFields = true;
    $('input[type=text]').each(function () {
        if ($(this).val().length != 0) {
            isEmptyFields = false;
            return false;
        }
    })
    $('textarea').each(function () {
        if ($(this).val().length != 0) {
            isEmptyFields = false;
            return false;
        }
    })
    $('.multiple-selection input[type=checkbox]').each(function () {
        if ($(this).prop("checked")) {
            isEmptyFields = false;
            return false;
        }
    })
    $('.uform_list .icheckbox_minimal-atp input[type=checkbox]').each(function () {
        if ($(this).prop("checked")) {
            isEmptyFields = false;
            return false;
        }
    })
    $('select').each(function () {
        if ($(this).val().length != 0) {
            isEmptyFields = false;
            return false;
        }
    })
    if (isEmptyFields === true) {
        return true;
    }
    else {
        return false;
    }
}

function addTDateTimeSeparator(dateTimeString)
{
    return dateTimeString.replace(/^(.*-[0-9][0-9])(\ )([0-9][0-9]\:.*$)/, '$1T$3');
}
