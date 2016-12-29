function SlitherlinkProblem(width, height) {
    this.height = height;
    this.width = width;
    this.clue = [];
    for (var y = 0; y < height; ++y) {
        var line = [];
        for (var x = 0; x < width; ++x) line.push(-1);
        this.clue.push(line);
    }
}
SlitherlinkProblem.prototype.getHeight = function () {
    return this.height;
}
SlitherlinkProblem.prototype.getWidth = function () {
    return this.width;
}
SlitherlinkProblem.prototype.getClue = function (x, y) {
    return this.clue[y][x];
}
SlitherlinkProblem.prototype.setClue = function (x, y, v) {
    this.clue[y][x] = v;
}
SlitherlinkProblem.parseString = function (str) {
    var charToCode = function (i) {
        if (i >= 48 && i <= 57) return i - 48;
        if (i >= 97 && i <= 122) return i - 87;
        if (i >= 65 && i <= 90) return i - 29;
    }
    if (str.search(",") != -1) {
        var sp = str.split(",");
        var height = sp.length;
        var width = sp[0].length;
        var ret = new SlitherlinkProblem(width, height);
        for (var y = 0; y < height; ++y) {
            for (var x = 0; x < width; ++x) {
                var clue = sp[y].charAt(x);
                if (clue == "0" || clue == "1" || clue == "2" || clue == "3") {
                    ret.setClue(x, y, clue - 0);
                }
            }
        }
        return ret;
    } else {
        var codes = [];
        for (var i = 0; i < str.length; ++i) codes.push(charToCode(str.charCodeAt(i)));

        var height = codes[0];
        var width = codes[1];
        var ret = new SlitherlinkProblem(width, height);
        for (var y = 0; y < height; ++y) {
            for (var x = 0; x < width; ++x) {
                var idx = y * width + x;
                if (idx % 2 == 0) ret.setClue(x, y, codes[2 + idx / 2] % 5 - 1);
                else ret.setClue(x, y, Math.floor(codes[2 + (idx - 1) / 2] / 5) - 1);
            }
        }
        return ret;
    }
}