function NurikabeView() {

}

NurikabeView.prototype.setCanvas = function (c) {
    this.canvas = c;
    this.ctx = c.getContext("2d");
}
NurikabeView.prototype.setOption = function (opt) {
    this.option = opt;
}
NurikabeView.prototype.setField = function (field) {
    this.field = field;
}
NurikabeView.prototype.getHeight = function () {
    return this.option.outerMargin * 2 + this.option.lineWidth + (this.option.lineWidth + this.option.cellSize) * this.field.getHeight();
}
NurikabeView.prototype.getWidth = function () {
    return this.option.outerMargin * 2 + this.option.lineWidth + (this.option.lineWidth + this.option.cellSize) * this.field.getWidth();
}
NurikabeView.prototype.adjustCanvasSize = function () {
    this.canvas.height = this.getHeight();
    this.canvas.width = this.getWidth();
}
NurikabeView.prototype.drawAll = function () {
    var ctx = this.ctx;
    ctx.fillStyle = "#ffffff";
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 1.0;
    ctx.fillRect(0, 0, this.getWidth(), this.getHeight());

    var field_width = this.field.getWidth();
    var field_height = this.field.getHeight();
    var cellSize = this.option.cellSize;
    var lineWidth = this.option.lineWidth;
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
    var field = this.field;
    ctx.font = (cellSize * 0.9) + "px 'Consolas'";
    ctx.textAlign = "center";
    ctx.textBaseline = "bottom";
    for (var y = 0; y < field_height; ++y) {
        for (var x = 0; x < field_width; ++x) {
            var clue = field.getCell(x, y);
            if (1 <= clue) {
                ctx.fillText(clue,
					outerMargin + x * (lineWidth + cellSize) + lineWidth + cellSize / 2,
					outerMargin + (y + 1) * (lineWidth + cellSize),
					cellSize
					);
            }
        }
    }

    for (var x = 0; x < field_width; ++x) {
        for (var y = 0; y < field_height; ++y) {
            this.drawCell(x, y);
        }
    }

    this.drawIfComplete();
}
NurikabeView.prototype.drawCell = function (x, y) {
    var ctx = this.ctx;
    var cellSize = this.option.cellSize;
    var lineWidth = this.option.lineWidth;
    var outerMargin = this.option.outerMargin;
    var dotSize = this.option.dotSize;
    var blockSize = this.option.blockSize;

    var cellState = this.field.getCell(x, y);
    if (cellState >= 1) return;

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(outerMargin + x * (lineWidth + cellSize) + lineWidth, outerMargin + y * (lineWidth + cellSize) + lineWidth, cellSize, cellSize);

    if (cellState == -1) { // decided (white)
        ctx.fillStyle = "#000000";
        ctx.fillRect(outerMargin + x * (lineWidth + cellSize) + (cellSize - dotSize) / 2 + lineWidth, outerMargin + y * (lineWidth + cellSize) + (cellSize - dotSize) / 2 + lineWidth, dotSize, dotSize);
    } else if (cellState == -2) { // decided (black)
        ctx.fillStyle = "#000000";
        ctx.fillRect(outerMargin + x * (lineWidth + cellSize) + (cellSize - blockSize) / 2 + lineWidth, outerMargin + y * (lineWidth + cellSize) + (cellSize - blockSize) / 2 + lineWidth, blockSize, blockSize);
    }
}
NurikabeView.prototype.drawIfComplete = function () {
    this.isFinished = this.field.isFinished();
    var ctx = this.ctx;
    var color = this.isFinished ? "#ff0000" : "#ffffff";

    ctx.strokeStyle = color;
    ctx.lineWidth = 2.0;
    ctx.strokeRect(4, 4, this.getWidth() - 8, this.getHeight() - 8);
}
