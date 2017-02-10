function NurikabeProblem(width, height) {
    this.height = height;
    this.width = width;
    this.clue = [];
    for (var y = 0; y < height; ++y) {
        var line = [];
        for (var x = 0; x < width; ++x) line.push(-1);
        this.clue.push(line);
    }
}
NurikabeProblem.prototype.getHeight = function () {
    return this.height;
}
NurikabeProblem.prototype.getWidth = function () {
    return this.width;
}
NurikabeProblem.prototype.getClue = function (x, y) {
    return this.clue[y][x];
}
NurikabeProblem.prototype.setClue = function (x, y, v) {
    this.clue[y][x] = v;
}
