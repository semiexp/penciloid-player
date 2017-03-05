function GridController() {
    this.field = null;
    this.height = -1;
    this.width = -1;

    this.undoHistory = [];
    this.redoHistory = [];

    // UI parameters
    this.offsetX = 10;
    this.offsetY = 10;
    this.cellSize = 30;
    this.lineWidth = 4;
    this.vertexThresholdDistance = 15;
    this.edgeThresholdDistance = 10;
    this.clickThresholdDistance = 5;

    // Internal variables for UI
    this.isClicking = false;
    this.movedDistance = 0;
    this.lastX = -1;
    this.lastY = -1;
    this.lastVertexX = -1;
    this.lastVertexY = -1;
    this.clickStartEdgeX = -1;
    this.clickStartEdgeY = -1;
    this.dragMode = -1;
}
GridController.prototype.setField = function (field) {
    this.field = field;
    this.height = field.getHeight();
    this.width = field.getWidth();
}
GridController.prototype.setEdge = function (x, y, e) {
    this.redoHistory = [];
    this.undoHistory.push({ x: x, y: y, state: this.field.getEdge(x, y) });
    this.field.setEdge(x, y, e);
}
GridController.prototype.performUndo = function () {
    if (this.undoHistory.length == 0) return [];
    var move = this.undoHistory.pop();
    this.redoHistory.push({ x: move.x, y: move.y, state: this.field.getEdge(move.x, move.y) });
    this.field.setEdge(move.x, move.y, move.state);
    return [{ x: move.x, y: move.y }];
}
GridController.prototype.performRedo = function () {
    if (this.redoHistory.length == 0) return [];
    var move = this.redoHistory.pop();
    this.undoHistory.push({ x: move.x, y: move.y, state: this.field.getEdge(move.x, move.y) });
    this.field.setEdge(move.x, move.y, move.state);
    return [{ x: move.x, y: move.y }];
}
GridController.prototype.performUndoAll = function () {
    var ret = [];
    while (this.undoHistory.length > 0) {
        ret.push(this.performUndo()[0]);
    }
    return ret;
}
GridController.prototype.performRedoAll = function () {
    var ret = [];
    while (this.redoHistory.length > 0) {
        ret.push(this.performRedo()[0]);
    }
    return ret;
}
GridController.prototype.mouseDown = function (x, y) {
    if (!this.field) return [];

    this.isClicking = true;
    this.movedDistance = 0;
    this.lastX = x;
    this.lastY = y;
    this.dragMode = -1;

    var location = this.getLocation(x, y);
    this.clickStartEdgeX = location.edgeX;
    this.clickStartEdgeY = location.edgeY;
    this.lastVertexX = location.vertexX;
    this.lastVertexY = location.vertexY;
}
GridController.prototype.mouseMove = function (x, y) {
    if (!this.field) return [];
    if (!this.isClicking) return [];

    this.movedDistance += Math.hypot(x - this.lastX, y - this.lastY);
    this.lastX = x;
    this.lastY = y;

    if (this.movedDistance < this.clickThresholdDistance) return [];

    var location = this.getLocation(x, y);
    if (location.vertexX != -1) {
        if (Math.abs(this.lastVertexX - location.vertexX) + Math.abs(this.lastVertexY - location.vertexY) == 1) {
            var ex = this.lastVertexX + location.vertexX;
            var ey = this.lastVertexY + location.vertexY;
            var currentEdge = this.field.getEdge(ex, ey);
            if (currentEdge == GridField.EDGE_LINE) {
                if (this.dragMode != GridField.EDGE_LINE) {
                    this.setEdge(ex, ey, GridField.EDGE_UNDECIDED);
                    this.dragMode = GridField.EDGE_UNDECIDED;
                }
            } else {
                if (this.dragMode != GridField.EDGE_UNDECIDED) {
                    this.setEdge(ex, ey, GridField.EDGE_LINE);
                    this.dragMode = GridField.EDGE_LINE;
                }
            }
        }
        this.lastVertexX = location.vertexX;
        this.lastVertexY = location.vertexY;
    }
}
GridController.prototype.mouseUp = function (x, y) {
    if (!this.field) return [];

    this.isClicking = false;
    this.movedDistance += Math.hypot(x - this.lastX, y - this.lastY);
    this.lastX = x;
    this.lastY = y;

    if (this.movedDistance < this.clickThresholdDistance) {
        var ex = this.clickStartEdgeX, ey = this.clickStartEdgeY;
        if (ex == -1) return [];
        var currentEdge = this.field.getEdge(ex, ey);
        this.setEdge(ex, ey, (currentEdge + 1) % 3);
        if (currentEdge == GridField.EDGE_UNDECIDED) {
            this.setEdge(ex, ey, GridField.EDGE_BLANK);
        } else {
            this.setEdge(ex, ey, GridField.EDGE_UNDECIDED);
        }
        return [{ x: ex, y: ey }];
    }
    return [];
}
GridController.prototype.getLocation = function (x, y) {
    x -= this.offsetX;
    y -= this.offsetY;

    var ret = {
        vertexX: -1,
        vertexY: -1,
        edgeX: -1,
        edgeY: -1
    };

    var vertexUL = {
        x: Math.floor(x / (this.lineWidth + this.cellSize)),
        y: Math.floor(y / (this.lineWidth + this.cellSize))
    };

    var getDistanceFromRange = function (l, r, x) {
        if (x < l) return l - x;
        if (r < x) return x - r;
        return 0;
    };

    // as a vertex
    {
        var vertexX = -1, vertexY = -1;
        var self = this;
        var getDistance = function (vx, vy) {
            var dx = getDistanceFromRange(0, self.lineWidth, x - vx * (self.lineWidth + self.cellSize));
            var dy = getDistanceFromRange(0, self.lineWidth, y - vy * (self.lineWidth + self.cellSize));
            return Math.sqrt(dx * dx + dy * dy);
        };
        var checkCandidate = function (vx, vy) {
            var d = getDistance(vx, vy);
            if (0 <= vx && vx <= self.width && 0 <= vy && vy <= self.height && d <= self.vertexThresholdDistance) {
                vertexX = vx;
                vertexY = vy;
            }
        };
        checkCandidate(vertexUL.x + 0, vertexUL.y + 0);
        checkCandidate(vertexUL.x + 0, vertexUL.y + 1);
        checkCandidate(vertexUL.x + 1, vertexUL.y + 0);
        checkCandidate(vertexUL.x + 1, vertexUL.y + 1);

        ret.vertexX = vertexX;
        ret.vertexY = vertexY;
    }

    // as an edge
    {
        var edgeX = -1, edgeY = -1;
        var bestDistance;
        var self = this;
        var getDistance = function (ex, ey) {
            if (ex % 2 == 0 && ey % 2 == 1) {
                var dx = getDistanceFromRange(0, self.lineWidth, x - (ex / 2) * (self.lineWidth + self.cellSize));
                var dy = getDistanceFromRange(0, self.cellSize, y - (((ey - 1) / 2) * (self.lineWidth + self.cellSize) + self.lineWidth));
                return Math.sqrt(dx * dx + dy * dy);
            } else if (ex % 2 == 1 && ey % 2 == 0) {
                var dx = getDistanceFromRange(0, self.cellSize, x - (((ex - 1) / 2) * (self.lineWidth + self.cellSize) + self.lineWidth));
                var dy = getDistanceFromRange(0, self.lineWidth, y - (ey / 2) * (self.lineWidth + self.cellSize));
                return Math.sqrt(dx * dx + dy * dy);
            }
        };
        var checkCandidate = function (ex, ey) {
            if (ex < 0 || ey < 0 || ex > self.height * 2 || ey > self.width * 2) return;

            var d = getDistance(ex, ey);
            if (d <= self.edgeThresholdDistance) {
                if (edgeX == -1 || d < bestDistance) {
                    edgeX = ex;
                    edgeY = ey;
                    bestDistance = d;
                }
            }
        }
        checkCandidate(vertexUL.x * 2 + 0, vertexUL.y * 2 + 1);
        checkCandidate(vertexUL.x * 2 + 1, vertexUL.y * 2 + 0);
        checkCandidate(vertexUL.x * 2 + 2, vertexUL.y * 2 + 1);
        checkCandidate(vertexUL.x * 2 + 1, vertexUL.y * 2 + 2);

        ret.edgeX = edgeX;
        ret.edgeY = edgeY;
    }
    return ret;
}
