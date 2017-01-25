; (function ($, window, document, undefined) {
    "use strict";

    window = (typeof window != 'undefined' && window.Math == Math)
      ? window
      : (typeof self != 'undefined' && self.Math == Math)
        ? self
        : Function('return this')()
    ;

    $.fn.tssdk = function (parameters) {
        $.fn.tssdk.settings = {
            'name': 'Tensei Shitara Slime datta ken',
            'namespace': 'tssdk',

            'langs': ['jp', 'en', 'tranlated'],

            'types': ['characters', 'species', 'skills', 'jobs', 'others'],

            'classes': {
                'active': 'active',
                'chapter': 'tssdk chapter',
                'characters': 'characters',
                'content': 'content',
                'jobs': 'jobs',
                'lang': 'lang',
                'others': 'others',
                'show': 'show',
                'skills': 'skills',
                'species': 'species',
                'tooltips': 'tooltips',
                'value': 'value'
            },

            'selector': {
                'chapter': '.tssdk.chapter',
                'characters': '.characters',
                'content': '.content',
                'jobs': '.jobs',
                'lang': '.lang',
                'others': '.others',
                'skills': '.skills',
                'species': '.species',
                'tooltips': '.tooltips',
                'value': '.value'
            },

            'attribute': {
                'value': 'value'
            },

            'format': {
                'spanContent': function (value) {
                    return '<span class="content">' + value + '</span>';
                },
                'spanValue': function (value) {
                    return '<span class="value">' + value + '</span>';
                },
                'spanLang': function (value, text) {
                    return '<span class="lang"' +
                        ' value="' + value + '">' +
                        text + '</span>';
                },
                'tooltips': function () {
                    return '<span class="tooltips">' +
                        '<span class="arrow-border"></span><span class="arrow"></span>' +
                        '</span>';
                }
            },

            'langConfig': {
                'characters': 'tranlated',
                'species': 'en',
                'skills': 'tranlated',
                'jobs': 'tranlated',
                'others': 'tranlated'
            }
        };

        var $allModules = $(this);
        var query = arguments[0];
        var methodInvoked = (typeof query === 'string');
        var queryArguments = [].slice.call(arguments, 1);
        var returnedValue;

        $allModules.each(function () {
            var settings = $.extend(true, {}, $.fn.tssdk.settings, parameters);

            var namespace = settings.namespace;

            var langs = settings.langs;
            var types = settings.types;
            var classes = settings.classes;
            var selector = settings.selector;
            var attribute = settings.attribute;
            var format = settings.format;
            var langConfig = settings.langConfig;

            var eventNamespace = '.' + namespace;
            var moduleNamespace = 'module-' + namespace;

            var $module = $(this);

            var instance = $module.data(moduleNamespace);
            var module;
            var util;

            module = {
                initialize: function () {
                    util.initializeLangTooltip();

                    $(types).each(function (index, type) {
                        var lang = langConfig[type];
                        var cookie = $.cookie(namespace + type);

                        if (cookie !== undefined) {
                            lang = cookie;
                        }

                        util.updateLang(type, lang);
                    });

                    return 0;
                },
            };

            util = {
                initializeLangTooltip: function () {
                    $(types).each(function (index, type) {
                        $module.find(selector[this]).each(function () {
                            var element = $(this);
                            var value = element.attr(attribute.value);

                            if (value === undefined) {
                                value = element.text();

                                element.attr(attribute.value, value);
                                element.html(format.spanValue(value));
                            }

                            if (element.find(selector.tooltips).first() !== undefined) {
                                element.append(format.tooltips);

                                var tooltip = element.find(selector.tooltips).first();

                                element.click(function (event) {
                                    event.stopPropagation();

                                    if (!tooltip.hasClass(classes.show)) {
                                        $allModules
                                            .find(selector.tooltips)
                                            .removeClass(classes.show);

                                        tooltip.addClass(classes.show);
                                    }
                                    else {
                                        $allModules
                                            .find(selector.tooltips)
                                            .removeClass(classes.show);
                                    }
                                });

                                $(langs).each(function (index, lang) {
                                    var object = dictionary[type][value];

                                    if (object !== undefined) {
                                        var text = object[lang];

                                        if (text === '') {
                                            text = object['tentativelyTranslated'];
                                        }

                                        tooltip.append(format.spanLang(lang, text));

                                        tooltip.find(selector.lang).last()
                                            .click(function (event) {
                                                event.stopPropagation();

                                                util.updateLang(type, lang);

                                                $allModules
                                                    .find(selector.tooltips)
                                                    .removeClass(classes.show);
                                            });
                                    }
                                    else {
                                        console.log(element);
                                        console.log(value);
                                    }
                                });
                            }
                        });
                    });

                    $(window).click(function () {
                        $allModules.find(selector.tooltips).removeClass(classes.show);
                    });
                },

                updateLang: function (type, lang) {
                    $.cookie(namespace + type, lang, { path: '/' });

                    $allModules.find(selector[type]).each(function () {
                        var element = $(this);
                        var spanValue = element.find(selector.value).first();
                        var tooltip = element.find(selector.tooltips).first();

                        tooltip.find(selector.lang)
                            .removeClass(classes.active)
                            .each(function () {
                                var element = $(this);
                                var value = element.attr(attribute.value);

                                if (value === lang) {
                                    element.addClass(classes.active);

                                    spanValue.html(element.html());
                                }
                            });
                    });
                }
            };

            if (methodInvoked) {
                module.invoke(query);
            }
            else {
                module.initialize();
            }

            return (returnedValue !== undefined) ? returnedValue : this;
        });
    }
})(jQuery, window, document);

$(document).ready(function () {
    $('.tssdk.chapter').tssdk();
});