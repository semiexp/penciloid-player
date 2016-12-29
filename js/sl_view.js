function SlitherlinkView() {

}

SlitherlinkView.prototype.setCanvas = function (c) {
    this.canvas = c;
    this.ctx = c.getContext("2d");
}
SlitherlinkView.prototype.setOption = function (opt) {
    this.option = opt;
}
SlitherlinkView.prototype.setField = function (field) {
    this.field = field;
}
SlitherlinkView.prototype.getHeight = function () {
    return this.option.outerMargin * 2 + this.option.dotSize + (this.option.dotSize + this.option.cellSize) * this.field.getHeight();
}
SlitherlinkView.prototype.getWidth = function () {
    return this.option.outerMargin * 2 + this.option.dotSize + (this.option.dotSize + this.option.cellSize) * this.field.getWidth();
}
SlitherlinkView.prototype.adjustCanvasSize = function () {
    this.canvas.height = this.getHeight();
    this.canvas.width = this.getWidth();
}
SlitherlinkView.prototype.drawAll = function () {
    var ctx = this.ctx;
    ctx.fillStyle = "#ffffff";
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 1.0;
    ctx.fillRect(0, 0, this.getWidth(), this.getHeight());

    var field_width = this.field.getWidth();
    var field_height = this.field.getHeight();
    var cellSize = this.option.cellSize;
    var dotSize = this.option.dotSize;
    var outerMargin = this.option.outerMargin;

    ctx.fillStyle = "#000000";
    for (var x = 0; x <= field_width; ++x) {
        for (var y = 0; y <= field_height; ++y) {
            ctx.fillRect(outerMargin + x * (cellSize + dotSize), outerMargin + y * (cellSize + dotSize), dotSize, dotSize);
        }
    }
    var field = this.field;
    ctx.font = (cellSize * 0.9) + "px 'Consolas'";
    ctx.textAlign = "center";
    ctx.textBaseline = "bottom";
    for (var y = 0; y < field_height; ++y) {
        for (var x = 0; x < field_width; ++x) {
            var clue = field.getClue(y, x);
            if (0 <= clue && clue <= 3) {
                ctx.fillText(clue,
					outerMargin + x * (dotSize + cellSize) + dotSize + cellSize / 2,
					outerMargin + (y + 1) * (dotSize + cellSize),
					cellSize
					);
            }
        }
    }

    for (var x = 0; x <= 2 * field_width; ++x) {
        for (var y = 0; y <= 2 * field_height; ++y) {
            if (x % 2 != y % 2) this.drawEdge(x, y);
        }
    }

    this.drawIfComplete();
}
SlitherlinkView.prototype.drawEdge = function (x, y) {
    var ctx = this.ctx;
    var cellSize = this.option.cellSize;
    var dotSize = this.option.dotSize;
    var outerMargin = this.option.outerMargin;
    var lineMargin = this.option.lineMargin;
    var lineWidth = this.option.lineWidth;
    var blankXSize = this.option.blankXSize;

    ctx.fillStyle = "#ffffff";
    if (x % 2 == 1 && y % 2 == 0) {
        ctx.fillRect(outerMargin + (x - 1) / 2 * (cellSize + dotSize) + lineMargin + dotSize, outerMargin + y / 2 * (cellSize + dotSize) + Math.floor((dotSize - lineWidth) / 2), cellSize - 2 * lineMargin, lineWidth + (dotSize + lineWidth) % 2);
    } else if (x % 2 == 0 && y % 2 == 1) {
        ctx.fillRect(outerMargin + x / 2 * (cellSize + dotSize) + Math.floor((dotSize - lineWidth) / 2), outerMargin + (y - 1) / 2 * (cellSize + dotSize) + lineMargin + dotSize, lineWidth + (dotSize + lineWidth) % 2, cellSize - 2 * lineMargin);
    }

    var center_x, center_y;
    if (x % 2 == 1 && y % 2 == 0) {
        center_x = outerMargin + (x - 1) / 2 * (cellSize + dotSize) + dotSize + cellSize / 2;
        center_y = outerMargin + y / 2 * (cellSize + dotSize) + dotSize / 2;
    } else {
        center_x = outerMargin + x / 2 * (cellSize + dotSize) + dotSize / 2;
        center_y = outerMargin + (y - 1) / 2 * (cellSize + dotSize) + dotSize + cellSize / 2;
    }
    ctx.fillRect(center_x - blankXSize, center_y - blankXSize, 2 * blankXSize + 1, 2 * blankXSize + 1);

    var edge_state = this.field.getEdge(x, y);
    if (edge_state == 1) { // line
        ctx.fillStyle = "#000000";
        if (x % 2 == 1 && y % 2 == 0) {
            ctx.fillRect(outerMargin + (x - 1) / 2 * (cellSize + dotSize) + lineMargin + dotSize, outerMargin + y / 2 * (cellSize + dotSize) + (dotSize - lineWidth) / 2, cellSize - 2 * lineMargin, lineWidth);
        } else if (x % 2 == 0 && y % 2 == 1) {
            ctx.fillRect(outerMargin + x / 2 * (cellSize + dotSize) + (dotSize - lineWidth) / 2, outerMargin + (y - 1) / 2 * (cellSize + dotSize) + lineMargin + dotSize, lineWidth, cellSize - 2 * lineMargin);
        }
    } else if (edge_state == 2) { // blank
        center_x += 0.5;
        center_y += 0.5;
        ctx.strokeStyle = "#000000";
        ctx.lineWidth = 1.0;
        ctx.beginPath();
        ctx.moveTo(center_x - blankXSize, center_y - blankXSize);
        ctx.lineTo(center_x + blankXSize, center_y + blankXSize);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(center_x + blankXSize, center_y - blankXSize);
        ctx.lineTo(center_x - blankXSize, center_y + blankXSize);
        ctx.stroke();
    }
}
SlitherlinkView.prototype.drawIfComplete = function () {
    this.isFinished = this.field.isFinished();
    var ctx = this.ctx;
    var color = this.isFinished ? "#ff0000" : "#ffffff";

    ctx.strokeStyle = color;
    ctx.lineWidth = 2.0;
    ctx.strokeRect(4, 4, this.getWidth() - 8, this.getHeight() - 8);
}
