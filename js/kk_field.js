function KakuroField(problem) {
    this.height = problem.getHeight();
    this.width = problem.getWidth();
    this.field = [];
    for (var y = 0; y < this.height; ++y) {
        var line = [];
        for (var x = 0; x < this.width; ++x) {
            if (problem.isClue(x, y)) {
                line.push({
                    cellType: KakuroField.CELL_CLUE,
                    clueHorizontal: problem.getClueHorizontal(x, y),
                    clueVertical: problem.getClueVertical(x, y)
                });
            } else {
                line.push({
                    cellType: KakuroField.CELL_BLANK,
                    value: -1
                });
            }
        }
        this.field.push(line);
    }
}
KakuroField.CELL_CLUE = 0;
KakuroField.CELL_BLANK = 1;
KakuroField.prototype.getHeight = function () {
    return this.height;
}
KakuroField.prototype.getWidth = function () {
    return this.width;
}
KakuroField.prototype.isClue = function (x, y) {
    return this.field[y][x].cellType == KakuroField.CELL_CLUE;
}
KakuroField.prototype.getClueHorizontal = function (x, y) {
    return this.field[y][x].clueHorizontal;
}
KakuroField.prototype.getClueVertical = function (x, y) {
    return this.field[y][x].clueVertical;
}
KakuroField.prototype.setValue = function (x, y, v) {
    this.field[y][x].value = v;
}
KakuroField.prototype.getValue = function (x, y) {
    return this.field[y][x].value;
}
KakuroField.prototype.isFinished = function () {
    var field = this.field;
    var height = this.height;
    var width = this.width;
    for (var y = 0; y < height; ++y) {
        var currentValues = [];
        for (var x = width - 1; x >= 0; --x) {
            if (field[y][x].cellType == KakuroField.CELL_BLANK) {
                currentValues.push(field[y][x].value);
            } else {
                var expectedSum = field[y][x].clueHorizontal;
                var currentSum = 0, used = 0;
                for (var i = 0; i < currentValues.length; ++i) {
                    var v = currentValues[i];
                    if (!(1 <= v && v <= 9)) return false;
                    if ((used & (1 << v)) != 0) return false;
                    used |= 1 << v;
                    currentSum += v;
                }
                console.log(expectedSum + "," + currentSum);
                if (expectedSum != currentSum) return false;
                currentValues = [];
            }
        }
        if (currentValues.length != 0) return false;
    }
    for (var x = 0; x < width; ++x) {
        var currentValues = [];
        for (var y = height - 1; y >= 0; --y) {
            if (field[y][x].cellType == KakuroField.CELL_BLANK) {
                currentValues.push(field[y][x].value);
            } else {
                var expectedSum = field[y][x].clueVertical;
                var currentSum = 0, used = 0;
                for (var i = 0; i < currentValues.length; ++i) {
                    var v = currentValues[i];
                    if (!(1 <= v && v <= 9)) return false;
                    if ((used & (1 << v)) != 0) return false;
                    used |= 1 << v;
                    currentSum += v;
                }
                console.log(expectedSum + "," + currentSum);
                if (expectedSum != currentSum) return false;
                currentValues = [];
            }
        }
        if (currentValues.length != 0) return false;
    }
    return true;
}
