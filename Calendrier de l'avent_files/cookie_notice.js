/**
 * Cookie Notice JS
 * @author Alessandro Benoit
 * https://github.com/micc83/cookie-notice-js/
 * MIT License
 */
;
(function () {

    "use strict";

    /**
     * Store current instance
     */
    var instance;

    /**
     * Defaults values
     * @type object
     */
    var defaults = {
        'messageLocales': {
            'it': 'Utilizziamo i cookie per essere sicuri che tu possa avere la migliore esperienza sul nostro sito. Se continui ad utilizzare questo sito assumiamo che tu ne sia felice.',
            'en': 'We use cookies to make sure you can have the best experience on our website. If you continue to use this site we assume that you will be happy with it.',
            'de': 'Wir verwenden Cookies um sicherzustellen dass Sie das beste Erlebnis auf unserer Website haben.',
            'oc': 'Utilizam de cookies per vos provesir la melhora experiéncia possibla sus nòstre site web. Se contunhatz d\'utilizar aqueste site web considerarem que sètz d\'acòrdi amb aquò.',
            'fr': 'Nous utilisons des cookies afin d\'être sûr que vous pouvez avoir la meilleure expérience sur notre site. Si vous continuez à utiliser ce site, nous supposons que vous acceptez.'
        },

        'cookieNoticePosition': 'bottom',

        'learnMoreLinkEnabled': false,

        'learnMoreLinkHref': '/cookie-banner-information.html',

        'learnMoreLinkText': {
            'it': 'Saperne di più',
            'en': 'Learn more',
            'de': 'Mehr erfahren',
            'oc': 'Ne saber mai',
            'fr': 'En savoir plus'
        },

        'denyButtonText': {
            'it': 'Solo i cookie necessari',
            'en': 'Only required cookies',
            'de': 'Nur erforderliche Cookies',
            'oc': 'Sólo las cookies necesarias',
            'fr': 'Seulement les nécessaires'
        },

        'buttonLocales': {
            'it': 'Consenti tutti i cookies',
            'en': 'Accept all cookies',
            'de': 'Alle Cookies zulassen',
            'oc': 'Permitir todas las cookies',
            'fr': 'Accepter tous les cookies'
        },

        'expiresIn': 30,
        'buttonBgColor': '#07e',
        'denyButtonBgColor': '#596c71',
        'buttonTextColor': '#fff',
        'noticeBgColor': '#364245',
        'noticeTextColor': '#fff',
        'linkColor': '#009fdd'
    };

    /**
     * Initialize cookie notice on DOMContentLoaded
     * if not already initialized with alt params
     */
    document.addEventListener('DOMContentLoaded', function () {
        if (!instance) {
            new cookieNoticeJS();
        }
    });

    /**
     * Constructor
     */
    window.cookieNoticeJS = function () {

        // If an instance is already set stop here
        if (instance !== undefined) {
            return;
        }

        // Set current instance
        instance = this;

        // If cookies are not supported or notice cookie is already set
        if (!testCookie() || getNoticeCookie()) {
            return;
        }

        // Extend default params
        var params = extendDefaults(defaults, arguments[0] || {});

        // Get current locale for notice text
        var noticeText = getStringForCurrentLocale(params.messageLocales);

        // Create notice
        var notice = createNotice(noticeText, params.noticeBgColor, params.noticeTextColor, params.cookieNoticePosition);

        var learnMoreLink;

        if (params.learnMoreLinkEnabled) {
            var learnMoreLinkText = getStringForCurrentLocale(params.learnMoreLinkText) + '...';

            learnMoreLink = createLearnMoreLink(learnMoreLinkText, params.learnMoreLinkHref, params.linkColor);
        }

        // Create buttons
        var okButton = createButton(getStringForCurrentLocale(params.buttonLocales), params.buttonBgColor, params.buttonTextColor),
            denyButton = createButton(getStringForCurrentLocale(params.denyButtonText), params.denyButtonBgColor, params.buttonTextColor);

        // OK button click event
        okButton.addEventListener('click', function (e) {
            e.preventDefault();
            setOkNoticeCookie(parseInt(params.expiresIn + "", 10) * 60 * 1000 * 60 * 24);
            fadeElementOut(notice);
        });

        // Deny button click event
        denyButton.addEventListener('click', function (e) {
            e.preventDefault();
            setDenyNoticeCookie(parseInt(params.expiresIn + "", 10) * 60 * 1000 * 60 * 24);
            fadeElementOut(notice);
        });

        // Append notice to DOM
        var noticeDomElement = document.body.appendChild(notice);

        if (!!learnMoreLink) {
            noticeDomElement.appendChild(learnMoreLink);
        }

        var br_el = document.createElement('br')
        noticeDomElement.appendChild(br_el);

        noticeDomElement.appendChild(denyButton);
        noticeDomElement.appendChild(okButton);
    };

    /**
     * Get the string for the current locale
     * and fallback to "en" if none provided
     * @param locales
     * @returns {*}
     */
    function getStringForCurrentLocale(locales) {
        var locale = (
            document.documentElement.lang ||
            navigator.language||
            navigator.userLanguage
        ).substr(0, 2);

        return (locales[locale]) ? locales[locale] : locales['en'];
    }

    /**
     * Test if cookies are enabled
     * @returns {boolean}
     */
    function testCookie() {
        document.cookie = 'testCookie=1';
        return document.cookie.indexOf('testCookie') != -1;
    }

    /**
     * Test if notice cookie is there
     * @returns {boolean}
     */
    function getNoticeCookie() {
        return document.cookie.indexOf('cookie_notice') != -1;
    }

    /**
     * Create notice
     * @param message
     * @param bgColor
     * @param textColor
     * @param position
     * @returns {HTMLElement}
     */
    function createNotice(message, bgColor, textColor, position) {

        var notice = document.createElement('div'),
            noticeStyle = notice.style;

        notice.innerHTML = message + '&nbsp;';
        notice.setAttribute('id', 'cookieNotice');

        noticeStyle.position = 'fixed';

        if (position === 'top') {
            noticeStyle.top = '0';
        } else {
            noticeStyle.bottom = '0';
        }

        noticeStyle.left = '0';
        noticeStyle.right = '0';
        noticeStyle.background = bgColor;
        noticeStyle.color = textColor;
        noticeStyle["z-index"] = '999';
        noticeStyle.padding = '10px 5px';
        noticeStyle["text-align"] = 'center';
        noticeStyle["font-size"] = "12px";
        noticeStyle["line-height"] = "28px";
        noticeStyle.fontFamily = 'Helvetica neue, Helvetica, sans-serif';

        return notice;
    }

    /**
     * Create OK button
     * @param message
     * @param buttonColor
     * @param buttonTextColor
     * @returns {HTMLElement}
     */
    function createButton(message, buttonColor, buttonTextColor) {

        var okButton = document.createElement('a'),
            okButtonStyle = okButton.style;

        // OK button
        okButton.href = '#';
        okButton.innerHTML = message;

        okButton.className = 'confirm';

        // OK button style
        okButtonStyle.background = buttonColor;
        okButtonStyle.color = buttonTextColor;
        okButtonStyle['text-decoration'] = 'none';
        okButtonStyle.display = 'inline-block';
        okButtonStyle.padding = '0 15px';
        okButtonStyle.margin = '0 0 0 10px';

        return okButton;

    }

    /**
     * Create OK button
     * @param learnMoreLinkText
     * @param learnMoreLinkHref
     * @param linkColor
     * @returns {HTMLElement}
     */
    function createLearnMoreLink(learnMoreLinkText, learnMoreLinkHref, linkColor) {

        var learnMoreLink = document.createElement('a'),
            learnMoreLinkStyle = learnMoreLink.style;

        // OK button
        learnMoreLink.href = learnMoreLinkHref;
        learnMoreLink.textContent = learnMoreLinkText;
        learnMoreLink.target = '_blank';
        learnMoreLink.className = 'learn-more';

        // OK button style
        learnMoreLinkStyle.color = linkColor;
        learnMoreLinkStyle['text-decoration'] = 'none';
        learnMoreLinkStyle.display = 'inline';

        return learnMoreLink;

    }

    /**
     * Set OK cookie
     * @param expireIn
     */
    function setOkNoticeCookie(expireIn) {
        var now = new Date(),
            cookieExpire = new Date();

        cookieExpire.setTime(now.getTime() + expireIn);
        document.cookie = "cookie_notice=1; expires=" + cookieExpire.toUTCString() + "; path=/;";
    }

    /**
     * Set Deny cookie
     * @param expireIn
     */
    function setDenyNoticeCookie(expireIn) {
        var now = new Date(),
            cookieExpire = new Date();

        cookieExpire.setTime(now.getTime() + expireIn);
        document.cookie = "cookie_notice=1; expires=" + cookieExpire.toUTCString() + "; path=/;";
        document.cookie = "deny_personal_cookies=1; expires=" + cookieExpire.toUTCString() + "; path=/;";
    }

    /**
     * Fade a given element out
     * @param element
     */
    function fadeElementOut(element) {
        element.style.opacity = 1;
        (function fade() {
            (element.style.opacity -= .1) < 0.01 ? element.parentNode.removeChild(element) : setTimeout(fade, 40)
        })();
    }

    /**
     * Utility method to extend defaults with user options
     * @param source
     * @param properties
     * @returns {*}
     */
    function extendDefaults(source, properties) {
        var property;
        for (property in properties) {
            if (properties.hasOwnProperty(property)) {
                if (typeof source[property] === 'object') {
                    source[property] = extendDefaults(source[property], properties[property]);
                } else {
                    source[property] = properties[property];
                }
            }
        }
        return source;
    }

    /* test-code */
    cookieNoticeJS.extendDefaults = extendDefaults;
    cookieNoticeJS.clearInstance = function () {
        instance = undefined;
    };
    /* end-test-code */

}());
