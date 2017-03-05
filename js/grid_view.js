function GridView() {
    this.cellSize = 30;
    this.lineWidth = 4;
    this.blankXSize = 5;
    this.margin = 10;
}
GridView.prototype.setCanvas = function (canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
}
GridView.prototype.setField = function (field) {
    this.field = field;
}
GridView.prototype.getCanvasHeight = function () {
    if (!this.field) return 0;
    return 2 * this.margin + this.lineWidth + (this.cellSize + this.lineWidth) * this.field.getHeight();
}
GridView.prototype.getCanvasWidth = function () {
    if (!this.field) return 0;
    return 2 * this.margin + this.lineWidth + (this.cellSize + this.lineWidth) * this.field.getWidth();
}
GridView.prototype.drawAll = function () {
    if (!this.canvas) return;

    var height = this.field.getHeight();
    var width = this.field.getWidth();
    var ctx = this.ctx;

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, this.getCanvasWidth(), this.getCanvasHeight());

    ctx.fillStyle = "#000000";
    for (var y = 0; y <= 2 * height; ++y) {
        for (var x = 0; x <= 2 * width; ++x) {
            if (y % 2 == 0 && x % 2 == 0) {
                ctx.fillRect(
                    this.margin + (x / 2) * (this.cellSize + this.lineWidth),
                    this.margin + (y / 2) * (this.cellSize + this.lineWidth),
                    this.lineWidth,
                    this.lineWidth
                );
            } else if (y % 2 == 0 && x % 2 == 1) {
                if (this.field.getEdge(x, y) == GridField.EDGE_LINE) {
                    ctx.fillRect(
                        this.margin + ((x - 1) / 2) * (this.cellSize + this.lineWidth) + this.lineWidth + 1,
                        this.margin + (y / 2) * (this.cellSize + this.lineWidth),
                        this.cellSize - 2,
                        this.lineWidth
                    );
                } else if (this.field.getEdge(x, y) == GridField.EDGE_BLANK) {
                    ctx.fillRect(
                        this.margin + ((x - 1) / 2) * (this.cellSize + this.lineWidth) + this.lineWidth + (this.cellSize - this.lineWidth) / 2,
                        this.margin + (y / 2) * (this.cellSize + this.lineWidth),
                        this.lineWidth,
                        this.lineWidth
                    );
                }
            } else if (y % 2 == 1 && x % 2 == 0) {
                if (this.field.getEdge(x, y) == GridField.EDGE_LINE) {
                    ctx.fillRect(
                        this.margin + (x / 2) * (this.cellSize + this.lineWidth),
                        this.margin + ((y - 1) / 2) * (this.cellSize + this.lineWidth) + this.lineWidth + 1,
                        this.lineWidth,
                        this.cellSize - 2
                    );
                } else if (this.field.getEdge(x, y) == GridField.EDGE_BLANK) {
                    ctx.fillRect(
                        this.margin + (x / 2) * (this.cellSize + this.lineWidth),
                        this.margin + ((y - 1) / 2) * (this.cellSize + this.lineWidth) + this.lineWidth + (this.cellSize - this.lineWidth) / 2,
                        this.lineWidth,
                        this.lineWidth
                    );
                }
            }
        }
    }
}
