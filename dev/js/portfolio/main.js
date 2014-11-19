/* jshint unused: false */


(function(){document.getElementsByTagName('html')[0].classList.remove('no-js');})();

(function($) {


    var Events = (function() {

        var topics = {};

        return {

            subscribe: function(topic, callback) {
                if (!topics[topic]) {
                    topics[topic] = { queue: [] };
                }

                var index = topics[topic].queue.push(callback) - 1;

                return {
                    remove: function() {
                        delete topics[topic].queue[index];
                    }
                };
            }, // end subscribe

            publish: function(topic, info) {

                if (!topics[topic] || !topics[topic].queue.length) { return; }

                var callbacks = topics[topic].queue;

                callbacks.forEach(function(callback) {
                    callback(info || {});
                });

            }  // end publish

        };
    }());

    var Subs = {};

    var Topics = {
        load: '/page/load',
        effectStart: '/effect/start',
        effectDone: '/effect/done'
    };


    var ELS = {};


    function initELS() {
        ELS = {
                menu: $('.nav--top')
            };
    }



    function slideInTagline() {

        var tagline = $('.tagline'),
            lines = $('.tagline--line'),
            i = 0;

        lines.each(function() {
            switch (i) {
                case 0:
                    $(this).addClass('one');
                    i++;
                    break;
                case 1:
                    $(this).addClass('two');
                    i++;
                    break;
                case 2:
                    $(this).addClass('three');
                    i++;
                    break;
            }
        });

    }



    function prepareMenu(menu) {

        menu.css({
            right: '-100%'
        }); // end css

        menu.find('.nav--ul__top').css({borderBottomColor: '#CCC2C2'});

    }


    function showMenu() {

        var menu = ELS.menu;

        menu.animate({ // properties
            right: 0
        }, { // options
            duration: 1200,
            easing: 'easeOutBack',

            done: function() {

                menu.find('.nav--ul__top').css({borderBottomColor: '#DB4342'});

                showCurrentMenuItem();
            }
        }); // end animate

    }


    function showCurrentMenuItem() {

        var page = window.location.href.toLowerCase();

        ELS.menu.find('li').each(function(i, el) {

            if ($(el).find('a')[0].href.toLowerCase() === page) {
                el.classList.add('active');
            }

        });

    }



    $(document).ready(function() {


        initELS();

        slideInTagline();

        prepareMenu(ELS.menu);

        showMenu();

    });

}(jQuery));