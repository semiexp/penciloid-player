function GridField(height, width) {
    this.height = height;
    this.width = width;
    this.data = [];
    for (var y = 0; y <= 2 * height; ++y) {
        var line = [];
        for (var x = 0; x <= 2 * width; ++x) {
            if (y % 2 == x % 2) {
                line.push(GridField.EDGE_INVALID);
            } else {
                line.push(GridField.EDGE_UNDECIDED);
            }
        }
        this.data.push(line);
    }
}
GridField.EDGE_INVALID = -1;
GridField.EDGE_UNDECIDED = 0;
GridField.EDGE_LINE = 1;
GridField.EDGE_BLANK = 2;
GridField.prototype.getHeight = function () {
    return this.height;
}
GridField.prototype.getWidth = function () {
    return this.width;
}
GridField.prototype.getEdge = function (x, y) {
    return this.data[y][x];
}
GridField.prototype.setEdge = function (x, y, e) {
    this.data[y][x] = e;
}
GridField.prototype.hasOneLoop = function () {
    var height = this.height;
    var width = this.width;

    var dy = [-1, 0, 1, 0];
    var dx = [0, -1, 0, 1];
    var mates = [];

    for (var y = 0; y <= height; ++y) {
        for (var x = 0; x <= width; ++x) {
            var adjacentDestination = [];
            for (var i = 0; i < 4; ++i) {
                var y2 = y * 2 + dy[i], x2 = x * 2 + dx[i];
                if (0 <= y2 && y2 <= 2 * height && 0 <= x2 && x2 <= 2 * width && this.getEdge(y2, x2) == GridField.EDGE_LINE) {
                    adjacentDestination.push((y + dy[i]) * (width + 1) + (x + dx[i]));
                }
            }
            if (adjacentLines.length == 0) {
                mates.push([]);
            } else if (adjacentLines.length == 2) {
                mates.push(adjacentDestination);
            } else return false;
        }
    }

    var startingPoint = -1;
    var nEdges = 0;
    for (var i = 0; i < (height + 1) * (width + 1) ; ++i) {
        if (mates[i].length > 0) {
            startingPoint = i;
            ++nEdges;
        }
    }
    if (nEdges == 0) return false;

    var currentVertex = startingPoint, previousVertex = -1;
    var nVisitedVertices = 0;
    do {
        ++nVisitedVertices;
        if (mates[currentVertex][0] == previousVertex) {
            previousVertex = currentVertex;
            currentVertex = mates[currentVertex][1];
        } else {
            previousVertex = currentVertex;
            currentVertex = mates[currentVertex][0];
        }
    } while (currentVertex != startingPoint);

    return nVisitedVertices == nEdges;
}
