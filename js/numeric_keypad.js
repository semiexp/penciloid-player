function NumericKeypad() {
    this.cellSize = 30;
    this.selectedKey = -1;
    this.isOpening = false;
    this.centerX = -1;
    this.centerY = -1;
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
        }
    });
    this.keys = [];
    for (var i = 1; i <= 9; ++i) {
        var key = $("<span></span>", {
            height: this.cellSize,
            width: this.cellSize,
            text: i,
            css: {
                fontFamily: "Verdana, Roboto, 'Droid Sans', '���C���I', Meiryo, '�l�r �o�S�V�b�N', '�q���M�m�p�S Pro W3', 'Hiragino Kaku Gothic ProN', sans-serif",
                fontSize: this.cellSize * 0.9,
                lineHeight: 1,
                textAlign: "center",
                verticalAlign: "middle",
                cursor: "default",
                display: "inline-block"
            }
        });
        key.css("-ms-user-select", "none");
        key.css("-moz-user-select", "-moz-none");
        key.css("-khtml-user-select", "none");
        key.css("-webkit-user-select", "none");
        key.css("-user-select", "none");
        this.keypadFrame.append(key);
        this.keys[i] = key;
    }
    this.keypadFrame.hide();
    $("body").append(this.keypadFrame);
    $(window).on({
        mouseup: function () {
            self.finish();
        },
        mousemove: function (e) {
            self.selectKeyByPosition(e.pageX, e.pageY);
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
    this.centerX = cx;
    this.centerY = cy;
    this.selectKeyByPosition(cx, cy);
}
NumericKeypad.prototype.selectKeyByPosition = function (pageX, pageY) {
    if (!this.isOpening) return;

    var dx = pageX - this.centerX;
    var dy = pageY - this.centerY;

    var x_loc, y_loc;
    if (dx < -this.cellSize / 2) x_loc = 0;
    else if (dx < this.cellSize / 2) x_loc = 1;
    else x_loc = 2;
    if (dy < -this.cellSize / 2) y_loc = 0;
    else if (dy < this.cellSize / 2) y_loc = 1;
    else y_loc = 2;

    this.selectKey(1 + x_loc + y_loc * 3);
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
