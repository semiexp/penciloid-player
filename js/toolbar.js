function createButton(content, action, enableLongPress) {
    var timer;
    var timer_func = function () {
        action();
        timer = setTimeout(timer_func, 100);
    }
    var btn = $("<span></span>", {
        class: "hoge",
        css: {
            border: "solid 1px #dddddd",
            padding: "2px",
            marginLeft: "2px",
            marginRight: "2px",
            backgroundColor: "#eeeeee",
            userSelect: "none",
            cursor: "pointer",
            display: "inline-block",
            verticalAlign: "middle"
        },
        on: {
            mouseover: function (event) {
                btn.css({
                    border: "solid 1px #cccccc",
                    backgroundColor: "#dddddd"
                });
            },
            mouseout: function (event) {
                btn.css({
                    border: "solid 1px #dddddd",
                    backgroundColor: "#eeeeee"
                });
                if (timer) {
                    clearTimeout(timer);
                    timer = null;
                }
            },
            mousedown: function (event) {
                btn.css({
                    backgroundColor: "#ffffff"
                });
                if (action) {
                    action();
                    if (enableLongPress) {
                        timer = setTimeout(timer_func, 500);
                    }
                }
            },
            touchstart: function (event) {
                btn.css({
                    border: "solid 1px #cccccc",
                    backgroundColor: "#ffffff"
                });
                if (action) {
                    action();
                    if (enableLongPress) {
                        timer = setTimeout(timer_func, 500);
                    }
                }
                return false;
            },
            mouseup: function (event) {
                btn.css({
                    backgroundColor: "#dddddd"
                });
                if (timer) {
                    clearTimeout(timer);
                    timer = null;
                }
            },
            touchend: function (event) {
                btn.css({
                    border: "solid 1px #dddddd",
                    backgroundColor: "#eeeeee"
                });
                if (timer) {
                    clearTimeout(timer);
                    timer = null;
                }
                return false;
            },
            selectstart: function (event) {
                return false;
            }
        }
    });
    btn.append(content);
    return btn;
}
