function NumericKeypad() {
    this.cellSize = 30;
    this.selectedKey = -1;
    this.isOpening = false;
    var self = this;
    this.keypadFrame = $("<div></div>", {
        height: this.cellSize * 3,
        width: this.cellSize * 3,
        css: {
            borderColor: "#000000",
            borderStyle: "solid",
            borderWidth: "2px",
            backgroundColor: "#ffffff",
            position: "absolute"
        },
        on: {
            mouseup: function () {
                self.finish();
            },
            mousemove: function (e) {
                self.selectKeyByPosition(e.pageX, e.pageY);
            },
            mouseover: function (e) {
                self.selectKeyByPosition(e.pageX, e.pageY);
            },
            touchstart: function (e) {
                self.selectKeyByPosition(
                    e.originalEvent.touches[0].pageX,
                    e.originalEvent.touches[0].pageY
                    );
                e.preventDefault();
            },
            touchend: function () {
                self.finish();
            }
        }
    });
    this.keys = [];
    for (var i = 1; i <= 9; ++i) {
        var key = $("<span></span>", {
            height: this.cellSize,
            width: this.cellSize,
            text: i,
            css: {
                fontSize: this.cellSize,
                textAlign: "center",
                display: "inline-block"
            }
        });
        this.keypadFrame.append(key);
        this.keys[i] = key;
    }
    this.keypadFrame.hide();
    $("body").append(this.keypadFrame);
    $(window).on({
        mouseup: function () {
            self.finish();
        },
        touchmove: function (e) {
            self.selectKeyByPosition(
                e.originalEvent.touches[0].pageX,
                e.originalEvent.touches[0].pageY
                );
        },
        touchend: function () {
            self.finish();
        },
    });
}
NumericKeypad.prototype.setCellSize = function (size) {
    this.cellSize = size;
    this.keypadFrame.height(this.cellSize * 3);
    this.keypadFrame.width(this.cellSize * 3);
    for (var i = 1; i <= 9; ++i) {
        this.keys[i].height(this.cellSize);
        this.keys[i].width(this.cellSize);
        this.keys[i].css({ fontSize: this.cellSize });
    }
}
NumericKeypad.prototype.displayKeypad = function (cx, cy, callback) {
    // cx, cy: position of the center of this keypad
    // callback: procedure after this keypad accepted input
    this.callback = callback;
    var keypad = this.keypadFrame;
    keypad.css({
        left: cx - keypad.outerWidth() / 2,
        top: cy - keypad.outerHeight() / 2
    });
    keypad.show();
    this.isOpening = true;
}
NumericKeypad.prototype.selectKeyByPosition = function (pageX, pageY) {
    if (!this.isOpening) return;

    for (var i = 1; i <= 9; ++i) {
        var keyOfs = this.keys[i].offset();

        var dx = pageX - keyOfs.left;
        var dy = pageY - keyOfs.top;
        if (0 <= dx && dx < this.cellSize && 0 <= dy && dy < this.cellSize) {
            this.selectKey(i);
        }
    }
}
NumericKeypad.prototype.selectKey = function (i) {
    if (!this.isOpening) return;

    if (this.selectedKey != -1) {
        this.keys[this.selectedKey].css("backgroundColor", "#ffffff");
    }
    this.selectedKey = i;
    this.keys[i].css("backgroundColor", "#ffcc99");
}
NumericKeypad.prototype.finish = function () {
    if (!this.isOpening) return;

    this.keypadFrame.hide();

    var selected = this.selectedKey;
    if (selected != -1) {
        this.keys[selected].css("backgroundColor", "#ffffff");
    }
    this.selectedKey = -1;
    this.isOpening = false;
    if (this.callback) {
        this.callback(selected);
    }
}
