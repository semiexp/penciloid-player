function MasyuView() {

}

MasyuView.prototype.setCanvas = function (c) {
    this.canvas = c;
    this.ctx = c.getContext("2d");
}
MasyuView.prototype.setOption = function (opt) {
    this.option = opt;
}
MasyuView.prototype.setField = function (field) {
    this.field = field;
}
MasyuView.prototype.getHeight = function () {
    return this.option.outerMargin * 2 + this.option.gridLineWidth + (this.option.gridLineWidth + this.option.cellSize) * this.field.getHeight();
}
MasyuView.prototype.getWidth = function () {
    return this.option.outerMargin * 2 + this.option.gridLineWidth + (this.option.gridLineWidth + this.option.cellSize) * this.field.getWidth();
}
MasyuView.prototype.adjustCanvasSize = function () {
    this.canvas.height = this.getHeight();
    this.canvas.width = this.getWidth();
}
MasyuView.prototype.drawAll = function () {
    var ctx = this.ctx;
    ctx.fillStyle = "#ffffff";
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 1.0;
    ctx.fillRect(0, 0, this.getWidth(), this.getHeight());

    var field_width = this.field.getWidth();
    var field_height = this.field.getHeight();
    var cellSize = this.option.cellSize;
    var gridLineWidth = this.option.gridLineWidth;
    var outerMargin = this.option.outerMargin;

    ctx.fillStyle = "#000000";
    for (var x = 0; x <= field_width; ++x) {
        ctx.fillRect(outerMargin + x * (cellSize + gridLineWidth), outerMargin, gridLineWidth, gridLineWidth + (cellSize + gridLineWidth) * field_height);
    }
    for (var y = 0; y <= field_height; ++y) {
        ctx.fillRect(outerMargin, outerMargin + y * (cellSize + gridLineWidth), gridLineWidth + (cellSize + gridLineWidth) * field_width, gridLineWidth);
    }
    for (var y = 0; y < field_height; ++y) {
        for (var x = 0; x < field_width; ++x) {
            this.drawClue(x, y);
        }
    }
    for (var x = 0; x <= 2 * (field_width - 1); ++x) {
        for (var y = 0; y <= 2 * (field_height - 1); ++y) {
            if (x % 2 != y % 2) this.drawEdgeWithoutClear(x, y);
        }
    }

    this.drawIfComplete();
}
MasyuView.prototype.drawClue = function (x, y) {
    if (this.field.getClue(x, y) == MasyuField.CLUE_NONE) return;
    var ctx = this.ctx;
    ctx.fillStyle = "#000000";
    ctx.strokeStyle = "#000000";
    ctx.lineWidth = 1.0;
    ctx.beginPath();
    ctx.arc(
        this.option.outerMargin + this.option.gridLineWidth + (this.option.cellSize + this.option.gridLineWidth) * x + this.option.cellSize / 2,
        this.option.outerMargin + this.option.gridLineWidth + (this.option.cellSize + this.option.gridLineWidth) * y + this.option.cellSize / 2,
        this.option.cellSize / 2 * 0.8,
        0,
        2 * Math.PI,
        false
    );
    if (this.field.getClue(x, y) == MasyuField.CLUE_BLACK) ctx.fill();
    else if (this.field.getClue(x, y) == MasyuField.CLUE_WHITE) ctx.stroke();
}
MasyuView.prototype.drawEdge = function (x, y) {
    this.clearAroundEdge(x, y);
    this.drawEdgeWithoutClear(x, y);
    this.drawEdgeWithoutClear(x - 1, y - 1);
    this.drawEdgeWithoutClear(x - 1, y + 1);
    this.drawEdgeWithoutClear(x + 1, y - 1);
    this.drawEdgeWithoutClear(x + 1, y + 1);
    if (x % 2 == 1 && y % 2 == 0) {
        this.drawEdgeWithoutClear(x - 2, y);
        this.drawEdgeWithoutClear(x + 2, y);
    } else if (x % 2 == 0 && y % 2 == 1) {
        this.drawEdgeWithoutClear(x, y - 2);
        this.drawEdgeWithoutClear(x, y + 2);
    }
}
MasyuView.prototype.clearAroundEdge = function (x, y) {
    var ctx = this.ctx;
    var cellSize = this.option.cellSize;
    var gridLineWidth = this.option.gridLineWidth;
    var outerMargin = this.option.outerMargin;
    var loopLineWidth = this.option.loopLineWidth;

    if (x % 2 == 1 && y % 2 == 0) {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(
            outerMargin + gridLineWidth + (x - 1) / 2 * (cellSize + gridLineWidth),
            outerMargin + gridLineWidth + y / 2 * (cellSize + gridLineWidth),
            2 * cellSize + gridLineWidth,
            cellSize
        );
        ctx.fillStyle = "#000000";
        ctx.fillRect(
            outerMargin + gridLineWidth + (x - 1) / 2 * (cellSize + gridLineWidth) + cellSize,
            outerMargin + gridLineWidth + y / 2 * (cellSize + gridLineWidth),
            gridLineWidth,
            cellSize
        );
        this.drawClue((x - 1) / 2, y / 2);
        this.drawClue((x + 1) / 2, y / 2);
    } else if (x % 2 == 0 && y % 2 == 1) {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(
            outerMargin + gridLineWidth + x / 2 * (cellSize + gridLineWidth),
            outerMargin + gridLineWidth + (y - 1) / 2 * (cellSize + gridLineWidth),
            cellSize,
            2 * cellSize + gridLineWidth
        );
        ctx.fillStyle = "#000000";
        ctx.fillRect(
            outerMargin + gridLineWidth + x / 2 * (cellSize + gridLineWidth),
            outerMargin + gridLineWidth + (y - 1) / 2 * (cellSize + gridLineWidth) + cellSize,
            cellSize,
            gridLineWidth
        );
        this.drawClue(x / 2, (y - 1) / 2);
        this.drawClue(x / 2, (y + 1) / 2);
    }
}
MasyuView.prototype.drawEdgeWithoutClear = function (x, y) {
    var ctx = this.ctx;
    var cellSize = this.option.cellSize;
    var gridLineWidth = this.option.gridLineWidth;
    var outerMargin = this.option.outerMargin;
    var loopLineWidth = this.option.loopLineWidth;
    var blankXSize = this.option.blankXSize;

    if (x < 0 || y < 0 || x > 2 * (this.field.getWidth() - 1) || y > 2 * (this.field.getHeight() - 1)) return;

    var center_x, center_y;
    if (x % 2 == 1 && y % 2 == 0) {
        center_x = outerMargin + gridLineWidth + cellSize + (x - 1) / 2 * (cellSize + gridLineWidth) + gridLineWidth / 2;
        center_y = outerMargin + gridLineWidth + y / 2 * (cellSize + gridLineWidth) + cellSize / 2;
    } else if (x % 2 == 0 && y % 2 == 1) {
        center_x = outerMargin + gridLineWidth + x / 2 * (cellSize + gridLineWidth) + cellSize / 2;
        center_y = outerMargin + gridLineWidth + cellSize + (y - 1) / 2 * (cellSize + gridLineWidth) + gridLineWidth / 2;
    }

    var edge_state = this.field.getEdge(x, y);
    if (edge_state == 1) { // line
        ctx.fillStyle = "#000000";
        if (x % 2 == 1 && y % 2 == 0) {
            ctx.fillRect(
                outerMargin + gridLineWidth + (x - 1) / 2 * (cellSize + gridLineWidth) + (cellSize - loopLineWidth) / 2,
                outerMargin + gridLineWidth + y / 2 * (cellSize + gridLineWidth) + (cellSize - loopLineWidth) / 2,
                cellSize + loopLineWidth + gridLineWidth,
                loopLineWidth
            );
        } else if (x % 2 == 0 && y % 2 == 1) {
            ctx.fillRect(
                outerMargin + gridLineWidth + x / 2 * (cellSize + gridLineWidth) + (cellSize - loopLineWidth) / 2,
                outerMargin + gridLineWidth + (y - 1) / 2 * (cellSize + gridLineWidth) + (cellSize - loopLineWidth) / 2,
                loopLineWidth,
                cellSize + loopLineWidth + gridLineWidth
            );
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
MasyuView.prototype.drawIfComplete = function () {
    this.isFinished = this.field.isFinished();
    var ctx = this.ctx;
    var color = this.isFinished ? "#ff0000" : "#ffffff";

    ctx.strokeStyle = color;
    ctx.lineWidth = 2.0;
    ctx.strokeRect(4, 4, this.getWidth() - 8, this.getHeight() - 8);
}
