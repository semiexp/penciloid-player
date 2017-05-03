function KakuroProblem(width, height) {
    this.height = height;
    this.width = width;
    this.clue = [];
    for (var y = 0; y < height; ++y) {
        var line = [];
        for (var x = 0; x < width; ++x) {
            line.push({
                cellType: KakuroProblem.CELL_BLANK,
                clueHorizontal: 0,
                clueVertical: 0
            });
        }
        this.clue.push(line);
    }
}
KakuroProblem.CELL_CLUE = 0;
KakuroProblem.CELL_BLANK = 1;
KakuroProblem.prototype.getHeight = function () {
    return this.height;
}
KakuroProblem.prototype.getWidth = function () {
    return this.width;
}
KakuroProblem.prototype.isClue = function (x, y) {
    return this.clue[y][x].cellType == KakuroProblem.CELL_CLUE;
}
KakuroProblem.prototype.getClueHorizontal = function (x, y) {
    return this.clue[y][x].clueHorizontal;
}
KakuroProblem.prototype.getClueVertical = function (x, y) {
    return this.clue[y][x].clueVertical;
}
KakuroProblem.prototype.setClueHorizontal = function (x, y, v) {
    if (this.clue[y][x].cellType == KakuroProblem.CELL_BLANK) {
        this.clue[y][x] = {
            cellType: KakuroProblem.CELL_CLUE,
            clueHorizontal: 0,
            clueVertical: 0
        };
    }
    this.clue[y][x].clueHorizontal = v;
}
KakuroProblem.prototype.setClueVertical = function (x, y, v) {
    if (this.clue[y][x].cellType == KakuroProblem.CELL_BLANK) {
        this.clue[y][x] = {
            cellType: KakuroProblem.CELL_CLUE,
            clueHorizontal: 0,
            clueVertical: 0
        };
    }
    this.clue[y][x].clueVertical = v;
}
