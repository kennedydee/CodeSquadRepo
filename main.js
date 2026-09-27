var style;
var sheet;
var rule;

var on = addEventListener;

var $ = function (element) {
    return document.querySelector(element);
};

var $$ = function (elements) {
    return document.querySelectorAll(elements);
};

var $body = document.body;
var $inner = $(".inner");

var client = function () {
    var e;
    var t;

    var n = {
        browser: "other",
        browserVersion: 0,
        os: "other",
        osVersion: 0
    };

    var userAgent = navigator.userAgent;

    // Detect browser
    var browsers = [
        ["firefox", /Firefox\/([0-9\.]+)/],
        ["edge", /Edge\/([0-9\.]+)/],
        ["safari", /Version\/([0-9\.]+).+Safari/],
        ["chrome", /Chrome\/([0-9\.]+)/],
        ["ie", /Trident\/.+rv:([0-9]+)/]
    ];

    for (e = browsers, t = 0; t < e.length; t++) {
        if (userAgent.match(e[t][1])) {
            n.browser = e[t][0];
            n.browserVersion = parseFloat(RegExp.$1);
            break;
        }
    }

    // Detect operating system
    var operatingSystems = [
        [
            "ios",
            /([0-9_]+) like Mac OS X/,
            function (version) {
                return version
                    .replace("_", ".")
                    .replace("_", "");
            }
        ],
        [
            "ios",
            /CPU like Mac OS X/,
            function () {
                return 0;
            }
        ],
        [
            "android",
            /Android ([0-9\.]+)/,
            null
        ],
        [
            "mac",
            /Macintosh.+Mac OS X ([0-9_]+)/,
            function (version) {
                return version
                    .replace("_", ".")
                    .replace("_", "");
            }
        ],
        [
            "windows",
            /Windows NT ([0-9\.]+)/,
            null
        ]
    ];

    for (e = operatingSystems, t = 0; t < e.length; t++) {
        if (userAgent.match(e[t][1])) {
            n.os = e[t][0];

            n.osVersion = parseFloat(
                e[t][2]
                    ? e[t][2](RegExp.$1)
                    : RegExp.$1
            );

            break;
        }
    }

    return n;
}();

var trigger = function (eventName) {
    if (client.browser === "ie") {
        var event = document.createEvent("Event");

        event.initEvent(
            eventName,
            false,
            true
        );

        dispatchEvent(event);
    } else {
        dispatchEvent(
            new Event(eventName)
        );
    }
};

// Page loading animation
on("load", function () {
    setTimeout(function () {
        $body.className = $body.className.replace(
            /\bis-loading\b/,
            "is-playing"
        );

        setTimeout(function () {
            $body.className = $body.className.replace(
                /\bis-playing\b/,
                "is-ready"
            );
        }, 1000);

    }, 100);
});


// Create a dynamic stylesheet
style = document.createElement("style");

style.appendChild(
    document.createTextNode("")
);

document.head.appendChild(style);

sheet = style.sheet;


// Android-specific fixes
if (client.os === "android") {

    (function () {

        sheet.insertRule(
            "body::after { }",
            0
        );

        rule = sheet.cssRules[0];

        var updateHeight = function () {
            rule.style.cssText =
                "height: " +
                Math.max(
                    screen.width,
                    screen.height
                ) +
                "px";
        };

        on("load", updateHeight);

        on(
            "orientationchange",
            updateHeight
        );

        on(
            "touchmove",
            updateHeight
        );

    })();


// iOS-specific fixes
} else if (client.os === "ios") {

    sheet.insertRule(
        "body::after { }",
        0
    );

    rule = sheet.cssRules[0];

    rule.style.cssText =
        "-webkit-transform: scale(1.0)";


    sheet.insertRule(
        "body.ios-focus-fix::before { }",
        0
    );

    rule = sheet.cssRules[0];

    rule.style.cssText =
        "height: calc(100% + 60px)";


    on(
        "focus",
        function () {
            $body.classList.add(
                "ios-focus-fix"
            );
        },
        true
    );

    on(
        "blur",
        function () {
            $body.classList.remove(
                "ios-focus-fix"
            );
        },
        true
    );


// Internet Explorer-specific fixes
} else if (client.browser === "ie") {

    (function () {

        var timeout;

        var fixLayout = function () {

            var wrapper = $("#wrapper");

            wrapper.style.height = "auto";

            if (
                wrapper.scrollHeight <=
                innerHeight
            ) {
                wrapper.style.height =
                    "100vh";
            }


            var containers =
                $$(".container.full");

            for (
                var i = 0;
                i < containers.length;
                i++
            ) {

                var container =
                    containers[i];

                var styles =
                    getComputedStyle(
                        container
                    );

                container.style.minHeight =
                    "";

                container.style.height =
                    "";

                var minHeight =
                    styles.minHeight;

                container.style.minHeight =
                    "0";

                container.style.height =
                    "";

                var height =
                    styles.height;

                if (minHeight !== 0) {
                    container.style.height =
                        height > minHeight
                            ? "auto"
                            : minHeight;
                }
            }
        };


        // Run once immediately
        fixLayout();


        // Update on resize
        on(
            "resize",
            function () {

                clearTimeout(timeout);

                timeout = setTimeout(
                    fixLayout,
                    250
                );
            }
        );


        // Run when page loads
        on(
            "load",
            fixLayout
        );

    })();
}
