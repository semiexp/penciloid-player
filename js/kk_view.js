function KakuroView() {

}

KakuroView.prototype.setCanvas = function (c) {
    this.canvas = c;
    this.ctx = c.getContext("2d");
}
KakuroView.prototype.setOption = function (opt) {
    this.option = opt;
}
KakuroView.prototype.setField = function (field) {
    this.field = field;
}
KakuroView.prototype.getHeight = function () {
    return this.option.outerMargin * 2 + this.option.lineWidth + (this.option.lineWidth + this.option.cellSize) * this.field.getHeight();
}
KakuroView.prototype.getWidth = function () {
    return this.option.outerMargin * 2 + this.option.lineWidth + (this.option.lineWidth + this.option.cellSize) * this.field.getWidth();
}
KakuroView.prototype.adjustCanvasSize = function () {
    this.canvas.height = this.getHeight();
    this.canvas.width = this.getWidth();
}
KakuroView.prototype.drawAll = function (selectedX, selectedY) {
    var ctx = this.ctx;
    ctx.fillStyle = "#ffffff";
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 1.0;
    ctx.fillRect(0, 0, this.getWidth(), this.getHeight());
    var field_width = this.field.getWidth();
    var field_height = this.field.getHeight();
    var cellSize = this.option.cellSize;
    var lineWidth = this.option.lineWidth;
    var clueDiagonalLineWidth = this.option.clueDiagonalLineWidth;
    var outerMargin = this.option.outerMargin;
    ctx.fillStyle = "#000000";
    var verticalLineLength = this.option.lineWidth + (this.option.lineWidth + this.option.cellSize) * this.field.getHeight();
    for (var x = 0; x <= field_width; ++x) {
        ctx.fillRect(outerMargin + x * (lineWidth + cellSize), outerMargin, lineWidth, verticalLineLength);
    }
    var horizontalLineLength = this.option.lineWidth + (this.option.lineWidth + this.option.cellSize) * this.field.getWidth();
    for (var y = 0; y <= field_height; ++y) {
        ctx.fillRect(outerMargin, outerMargin + y * (lineWidth + cellSize), horizontalLineLength, lineWidth);
    }
    for (var y = 0; y < field_height; ++y) {
        for (var x = 0; x < field_width; ++x) {
            this.drawCell(x, y, (x == selectedX && y == selectedY));
        }
    }

    this.drawIfComplete();
}
KakuroView.prototype.drawCell = function (x, y, isSelected) {
    var ctx = this.ctx;
    var cellSize = this.option.cellSize;
    var lineWidth = this.option.lineWidth;
    var outerMargin = this.option.outerMargin;
    var dotSize = this.option.dotSize;
    var blockSize = this.option.blockSize;
    var clueDiagonalLineWidth = this.option.clueDiagonalLineWidth;

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(outerMargin + x * (lineWidth + cellSize) + lineWidth, outerMargin + y * (lineWidth + cellSize) + lineWidth, cellSize, cellSize);

    if (this.field.isClue(x, y)) {
        outerMargin -= 0.5;
        ctx.lineWidth = 1.0;
        ctx.font = Math.floor(cellSize / 2 * 0.9) + "px 'Consolas'";
        ctx.textAlign = "center";
        ctx.textBaseline = "bottom";

        ctx.fillStyle = "#444444";
        ctx.beginPath();
        ctx.moveTo(outerMargin + x * (lineWidth + cellSize) + lineWidth, outerMargin + y * (lineWidth + cellSize) + lineWidth + clueDiagonalLineWidth);
        ctx.lineTo(outerMargin + (x + 1) * (lineWidth + cellSize) - clueDiagonalLineWidth + 1, outerMargin + (y + 1) * (lineWidth + cellSize) + 1);
        ctx.lineTo(outerMargin + x * (lineWidth + cellSize) + lineWidth, outerMargin + (y + 1) * (lineWidth + cellSize) + 1);
        ctx.closePath();
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(outerMargin + x * (lineWidth + cellSize) + lineWidth + clueDiagonalLineWidth, outerMargin + y * (lineWidth + cellSize) + lineWidth);
        ctx.lineTo(outerMargin + (x + 1) * (lineWidth + cellSize) + 1, outerMargin + (y + 1) * (lineWidth + cellSize) - clueDiagonalLineWidth + 1);
        ctx.lineTo(outerMargin + (x + 1) * (lineWidth + cellSize) + 1, outerMargin + y * (lineWidth + cellSize) + lineWidth);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = "#ffffff";
        var clueHorizontal = this.field.getClueHorizontal(x, y);
        if (clueHorizontal >= 1) {
            ctx.fillText(
                clueHorizontal,
                0.5 + outerMargin + x * (lineWidth + cellSize) + lineWidth + cellSize * 0.75,
                outerMargin + y * (lineWidth + cellSize) + lineWidth + cellSize / 2,
                cellSize / 2
                );
        }
        var clueVertical = this.field.getClueVertical(x, y);
        if (clueVertical >= 1) {
            ctx.fillText(
                clueVertical,
                0.5 + outerMargin + x * (lineWidth + cellSize) + lineWidth + cellSize * 0.25,
                outerMargin + y * (lineWidth + cellSize) + lineWidth + cellSize,
                cellSize / 2
                );
        }
        outerMargin += 0.5;
    } else {
        var v = this.field.getValue(x, y);
        if (v != -1) {
            ctx.fillStyle = "#000000";
            ctx.font = Math.floor(cellSize * 0.9) + "px 'Consolas'";
            ctx.fillText(
                v,
                0.5 + outerMargin + x * (lineWidth + cellSize) + lineWidth + cellSize * 0.5,
                outerMargin + y * (lineWidth + cellSize) + lineWidth + cellSize,
                cellSize / 2
                );
        }
    }
    if (isSelected) {
        ctx.strokeStyle = "#ff0000";
        ctx.lineWidth = lineWidth;
        ctx.strokeRect(outerMargin + x * (lineWidth + cellSize) + lineWidth * 2, outerMargin + y * (lineWidth + cellSize) + lineWidth * 2, cellSize - lineWidth * 2, cellSize - lineWidth * 2);
    }
}
KakuroView.prototype.drawIfComplete = function () {
    this.isFinished = this.field.isFinished();
    var ctx = this.ctx;
    var color = this.isFinished ? "#ff0000" : "#ffffff";

    ctx.strokeStyle = color;
    ctx.lineWidth = 2.0;
    ctx.strokeRect(4, 4, this.getWidth() - 8, this.getHeight() - 8);
}
