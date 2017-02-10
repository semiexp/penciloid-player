// 0: undecided, -1: decided (white), -2: decided (black)
function NurikabeField(problem) {
    this.height = problem.getHeight();
    this.width = problem.getWidth();
    this.data = [];
    for (var y = 0; y < this.height; ++y) {
        var line = [];
        for (var x = 0; x < this.width; ++x) {
            var c = problem.getClue(x, y);
            line.push(c > 0 ? c : 0);
        }
        this.data.push(line);
    }
}
NurikabeField.prototype.getHeight = function () {
    return this.height;
}
NurikabeField.prototype.getWidth = function () {
    return this.width;
}
NurikabeField.prototype.getCell = function (x, y) {
    return this.data[x][y];
}
NurikabeField.prototype.setCell = function (x, y, v) {
    this.data[x][y] = v;
}
NurikabeField.prototype.isFinished = function () {
    var height = this.height;
    var width = this.width;

    for (var y = 0; y < height - 1; ++y) {
        for (var x = 0; x < width - 1; ++x) {
            if (this.getCell(x, y) == -2 && this.getCell(x, y + 1) == -2 && this.getCell(x + 1, y) == -2 && this.getCell(x + 1, y + 1) == -2) {
                return false;
            }
        }
    }

    var visited = [];
    for (var y = 0; y < height; ++y) {
        var l = [];
        for (var x = 0; x < width; ++x) l.push(false);
        visited.push(l);
    }

    for (var y = 0; y < height; ++y) {
        for (var x = 0; x < width; ++x) if (!visited[y][x] && this.getCell(x, y) != -2) {
            var nWhiteCells = 0, nClue = 0;
            var self = this;
            var visit = function (y, x) {
                if (y < 0 || x < 0 || y >= height || x >= width || self.getCell(x, y) == -2 || visited[y][x]) return;
                visited[y][x] = true;
                ++nWhiteCells;
                if (self.getCell(x, y) >= 1) {
                    if (nClue == 0) {
                        nClue = self.getCell(x, y);
                    } else {
                        nClue = -2;
                    }
                }
                visit(y - 1, x);
                visit(y + 1, x);
                visit(y, x - 1);
                visit(y, x + 1);
            };
            visit(y, x);
            if (nWhiteCells != nClue) return false;
        }
    }

    var nBlackUnit = 0;
    for (var y = 0; y < height; ++y) {
        for (var x = 0; x < width; ++x) if (!visited[y][x] && this.getCell(x, y) == -2) {
            ++nBlackUnit;
            var self = this;
            var visit = function (y, x) {
                if (y < 0 || x < 0 || y >= height || x >= width || self.getCell(x, y) != -2 || visited[y][x]) return;
                visited[y][x] = true;
                visit(y - 1, x);
                visit(y + 1, x);
                visit(y, x - 1);
                visit(y, x + 1);
            };
            visit(y, x);
        }
    }

    return nBlackUnit <= 1;
}