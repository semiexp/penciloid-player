function MasyuField(problem) {
    this.height = problem.getHeight();
    this.width = problem.getWidth();
    this.clue = [];
    for (var y = 0; y < this.height; ++y) {
        var line = [];
        for (var x = 0; x < this.width; ++x) {
            line.push(problem.getClue(x, y));
        }
        this.clue.push(line);
    }
    this.grid = new GridField(this.width - 1, this.height - 1);
}
MasyuField.CLUE_NONE = 0;
MasyuField.CLUE_BLACK = 1;
MasyuField.CLUE_WHITE = 2;
MasyuField.prototype.getInternalGrid = function () {
    return this.grid;
}
MasyuField.prototype.getHeight = function () {
    return this.height;
}
MasyuField.prototype.getWidth = function () {
    return this.width;
}
MasyuField.prototype.getEdge = function (x, y) {
    return this.grid.getEdge(x, y);
}
MasyuField.prototype.setEdge = function (x, y, v) {
    this.grid.setEdge(x, y, v);
}
MasyuField.prototype.getClue = function (x, y) {
    return this.clue[y][x];
}
MasyuField.prototype.isFinished = function () {
    var clue = this.clue;
    var height = this.height;
    var width = this.width;
    var dx = [-1, 0, 1, 0], dy = [0, -1, 0, 1];

    for (var y = 0; y < height; ++y) {
        for (var x = 0; x < width; ++x) {
            if (this.getClue(x, y) != MasyuField.CLUE_NONE) {
                var straight = [], nonStraight = [], adjacent = [];
                for (var d = 0; d < 4; ++d) {
                    var y2 = y * 2 + dy[d], x2 = x * 2 + dx[d];
                    if (0 <= y2 && y2 <= 2 * (height - 1) && 0 <= x2 && x2 <= 2 * (width - 1)
                        && this.grid.getEdge(x2, y2) == GridField.EDGE_LINE) {
                        adjacent.push(d);
                        var y3 = y * 2 + 3 * dy[d], x3 = x * 2 + 3 * dx[d];
                        if (0 <= y3 && y3 <= 2 * (height - 1) && 0 <= x3 && x3 <= 2 * (width - 1)
                            && this.grid.getEdge(x3, y3) == GridField.EDGE_LINE) {
                            straight.push(d);
                        } else {
                            nonStraight.push(d);
                        }
                    }
                }
                if (this.getClue(x, y) == MasyuField.CLUE_BLACK) {
                    if (!(straight.length == 2 && straight[1] - straight[0] != 2)) return false;
                } else if (this.getClue(x, y) == MasyuField.CLUE_WHITE) {
                    if (!(adjacent.length == 2 && adjacent[1] - adjacent[0] == 2 && straight.length != 2)) return false;
                }
            }
        }
    }

    return this.grid.hasOneLoop();
}