// 0: undecided, 1: line, 2: blank
function SlitherlinkField(problem) {
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
    this.grid = new GridField(this.width, this.height);
}
SlitherlinkField.prototype.getHeight = function () {
    return this.height;
}
SlitherlinkField.prototype.getWidth = function () {
    return this.width;
}
SlitherlinkField.prototype.getEdge = function (x, y) {
    return this.grid.getEdge(x, y);
}
SlitherlinkField.prototype.setEdge = function (x, y, v) {
    this.grid.setEdge(x, y, v);
}
SlitherlinkField.prototype.getClue = function (x, y) {
    return this.clue[y][x];
}
SlitherlinkField.prototype.isFinished = function () {
    var clue = this.clue;
    var height = this.height;
    var width = this.width;

    for (var y = 0; y < height; ++y) {
        for (var x = 0; x < width; ++x) {
            var adjacentLines = 0;
            if (this.grid.getEdge(x * 2 + 1, y * 2 + 0) == GridField.EDGE_LINE)++adjacentLines;
            if (this.grid.getEdge(x * 2 + 0, y * 2 + 1) == GridField.EDGE_LINE)++adjacentLines;
            if (this.grid.getEdge(x * 2 + 1, y * 2 + 2) == GridField.EDGE_LINE)++adjacentLines;
            if (this.grid.getEdge(x * 2 + 2, y * 2 + 1) == GridField.EDGE_LINE)++adjacentLines;
            if (clue[y][x] != -1 && clue[y][x] != adjacentLines) return false;
        }
    }

    return this.grid.hasOneLoop();
}