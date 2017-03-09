function MasyuProblem(width, height) {
    this.height = height;
    this.width = width;
    this.clue = [];
    for (var y = 0; y < height; ++y) {
        var line = [];
        for (var x = 0; x < width; ++x) line.push(0);
        this.clue.push(line);
    }
}
MasyuProblem.prototype.getHeight = function () {
    return this.height;
}
MasyuProblem.prototype.getWidth = function () {
    return this.width;
}
MasyuProblem.prototype.getClue = function (x, y) {
    return this.clue[y][x];
}
MasyuProblem.prototype.setClue = function (x, y, v) {
    this.clue[y][x] = v;
}
