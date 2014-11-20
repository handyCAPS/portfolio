/* jshint unused: false */


(function(){document.getElementsByTagName('html')[0].classList.remove('no-js');})();

(function($) {

    var start = Date.now();



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

        var allLines = $('.tagline--line'),
            n        = 0,
            done;

        // Preparing the tagline
        allLines.each(function() {
            $(this).css({
                left: '-100%'
            });
        });

        function slideIn() {
            window.setTimeout(function() {
                $(allLines[n]).animate({
                    left: 0
                }, { // options
                    duration: 500,
                    easing: 'easeOutBack',

                    done: function() {
                        Events.publish('/tagline' + n + '/done');
                        n++;
                    }
                });
            }, 300);
        }

        // Slide the first line in
        slideIn();

        // Slide others when previous completes
        [].forEach.call(allLines, function(line, n) {
            Events.subscribe('/tagline' + n + '/done', slideIn);
        });

        function allDone() {

            Events.publish('/tagline/allDone');
            done.remove();

        }

        done = Events.subscribe('/tagline' + parseInt(allLines.length - 1) + '/done', allDone);

    }


    function showTaglineBorder() {
        $('.tagline').css({
            borderLeftColor: '#D33534'
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

        window.setTimeout(function() {
            menu.animate({ // properties
                right: 0
            }, { // options
                duration: 1200,
                easing: 'easeOutBack',

                done: function() {

                    menu.find('.nav--ul__top').css({borderBottomColor: '#DB4342'});

                    showCurrentMenuItem();

                    Events.publish('/menu/shown');
                }
            }); // end animate
        }, 300);

    }


    function showCard() {
        $('.card').css({
            visibility: 'visible',
            transform: 'rotateX(0deg)'
        });
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

        Events.subscribe('/tagline/allDone', showMenu);

        Events.subscribe('/menu/shown', showTaglineBorder);
        Events.subscribe('/menu/shown', showCard);

    });

}(jQuery));