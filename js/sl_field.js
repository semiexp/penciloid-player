// 0: undecided, 1: line, 2: blank
function SlitherlinkField(problem) {
    this.height = problem.getHeight();
    this.width = problem.getWidth();
    this.data = [];
    for (var y = 0; y <= 2 * this.height; ++y) {
        var line = [];
        for (var x = 0; x <= 2 * this.width; ++x) {
            line.push((y % 2 == 1 && x % 2 == 1) ? problem.getClue((x - 1) / 2, (y - 1) / 2) : 0);
        }
        this.data.push(line);
    }
}
SlitherlinkField.prototype.getHeight = function () {
    return this.height;
}
SlitherlinkField.prototype.getWidth = function () {
    return this.width;
}
SlitherlinkField.prototype.getEdge = function (x, y) {
    return this.data[y][x];
}
SlitherlinkField.prototype.setEdge = function (x, y, v) {
    this.data[y][x] = v;
}
SlitherlinkField.prototype.getClue = function (x, y) {
    return this.data[y * 2 + 1][x * 2 + 1];
}
SlitherlinkField.prototype.isFinished = function () {
    // check number of edges
    var data = this.data;
    var height = this.height;
    var width = this.width;
    var countNeighboringEdges = function (y, x) {
        var ret = 0;
        if (y > 0 && data[y - 1][x] == 1) ret += 1;
        if (y < height * 2 && data[y + 1][x] == 1) ret += 1;
        if (x > 0 && data[y][x - 1] == 1) ret += 1;
        if (x < width * 2 && data[y][x + 1] == 1) ret += 1;
        return ret;
    };
    for (var y = 0; y <= 2 * height; y++) {
        for (var x = 0; x <= 2 * width; x++) {
            if (y % 2 == 0 && x % 2 == 0) {
                var nb = countNeighboringEdges(y, x);
                if (!(nb == 0 || nb == 2)) return false;
            } else if (y % 2 == 1 && x % 2 == 1) {
                var nb = countNeighboringEdges(y, x);
                if (!(data[y][x] == -1 || data[y][x] == nb)) return false;
            }
        }
    }

    var uf_data = [];
    for (var i = 0; i < (2 * height + 1) * (2 * width + 1) ; ++i) uf_data.push(-1);
    var idx = function (y, x) { return y * (2 * width + 1) + x; }
    var root = function (p) {
        return uf_data[p] < 0 ? p : (uf_data[p] = root(uf_data[p]));
    }
    var join = function (p, q) {
        p = root(p); q = root(q);
        if (p == q) return;
        uf_data[p] += uf_data[q];
        uf_data[q] = p;
    }

    for (var y = 0; y <= 2 * height; y++) {
        for (var x = 0; x <= 2 * width; x++) {
            if (y % 2 == 0 && x % 2 == 1 && data[y][x] == 1) {
                join(idx(y, x), idx(y, x - 1));
                join(idx(y, x), idx(y, x + 1));
            } else if (y % 2 == 1 && x % 2 == 0 && data[y][x] == 1) {
                join(idx(y, x), idx(y - 1, x));
                join(idx(y, x), idx(y + 1, x));
            }
        }
    }

    var root_god = -1;
    for (var y = 0; y <= 2 * height; y++) {
        for (var x = 0; x <= 2 * width; x++) {
            if (y % 2 != x % 2 && data[y][x] == 1) {
                if (root_god == -1) root_god = root(idx(y, x));
                else if (root_god != root(idx(y, x))) return false;
            }
        }
    }
    return true;
}