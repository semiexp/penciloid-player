function SlitherlinkController(problems) {
    this.option = {};
    this.option.outerMargin = 20;
    this.option.lineMargin = 1;
    this.option.lineWidth = 3;

    this.isMouseClicking = false;
    this.isLineAllowed = false;
    this.isBlankAllowed = false;
    this.moveDistance = 0;
    this.lastVertexX = -2;
    this.lastVertexY = -2;
    this.lastCellX = -2;
    this.lastCellY = -2;

    this.isFinished = false;

    this.undoHistory = [];
    this.redoHistory = [];

    this.problems = problems;
    this.setProblemId(0);

    this.setZoom(3);
}
SlitherlinkController.prototype.setView = function (view) {
    this.view = view;
    this.view.setField(this.field);
    this.view.setOption(this.option);

    this.view.adjustCanvasSize();
    this.view.drawAll();
}
SlitherlinkController.prototype.setZoom = function (z) {
    this.zoom = z;
    this.option.dotSize = z * 1;
    this.option.cellSize = z * 10;
    this.option.blankXSize = z * 1.5;
    this.option.edgeMaximumDistanceFromActualEdge = z * 3;
    this.option.edgeMinimumDistanceFromVertex = z;
    this.option.vertexMaximumDistanceFromActualVertex = z * 6;
    this.option.cellMaximumDistanceFromEdge = z * 4;
    this.option.maximumTapDistance = z * 2;
}
SlitherlinkController.prototype.setProblemSet = function (problems) {
    this.problems = problems;
    this.setProblemId(0);
}
SlitherlinkController.prototype.setProblemId = function (idx) {
    this.isFinished = false;
    this.undoHistory = [];
    this.redoHistory = [];

    this.problemId = idx;
    this.field = new SlitherlinkField(this.problems[idx]);

    if (this.view) {
        this.view.setField(this.field);
        this.view.adjustCanvasSize();
        this.view.drawAll();
    }
}
SlitherlinkController.prototype.getProblemId = function () {
    return this.problemId;
}
SlitherlinkController.prototype.getNumberOfProblems = function () {
    return this.problems.length;
}
SlitherlinkController.prototype.updateEdge = function (x, y, v) {
    if (x < 0 || x > 2 * this.field.getWidth() || y < 0 || y > 2 * this.field.getHeight() || this.field.getEdge(x, y) == v) return;
    this.redoHistory = [];
    this.undoHistory.push({ x: x, y: y, state: this.field.getEdge(x, y) });
    this.field.setEdge(x, y, v);
    this.isFinished = this.field.isFinished();
    if (this.view) {
        this.view.drawEdge(x, y);
        this.view.drawIfComplete();
    }
}
SlitherlinkController.prototype.getLocation = function (x, y) {
    // (x, y): position given by Applet
    x -= this.option.outerMargin; y -= this.option.outerMargin;
    var ret = {};
    var dotSize = this.option.dotSize, cellSize = this.option.cellSize;

    var vtx_x = Math.floor(x / (dotSize + cellSize)), vtx_y = Math.floor(y / (dotSize + cellSize));
    var x_ofs = x - vtx_x * (dotSize + cellSize), y_ofs = y - vtx_y * (dotSize + cellSize);

    if (x_ofs < dotSize && y_ofs < dotSize) {
        // on vertex
        ret.edgeX = ret.edgeY = -2;
        ret.cellX = -2; ret.cellY = -2;
        ret.vertexX = vtx_x * 2; ret.vertexY = vtx_y * 2;
    } else if (dotSize <= x_ofs && y_ofs < dotSize) {
        ret.edgeX = vtx_x * 2 + 1; ret.edgeY = vtx_y * 2;
        ret.cellX = -2; ret.cellY = -2;
        if (x_ofs - dotSize <= this.option.vertexMaximumDistanceFromActualVertex) {
            ret.vertexX = vtx_x * 2; ret.vertexY = vtx_y * 2;
        } else if (dotSize + cellSize - x_ofs <= this.option.vertexMaximumDistanceFromActualVertex) {
            ret.vertexX = vtx_x * 2 + 2; ret.vertexY = vtx_y * 2;
        } else {
            ret.vertexX = -2; ret.vertexY = -2;
        }
    } else if (x_ofs < dotSize && dotSize <= y_ofs) {
        ret.edgeX = vtx_x * 2; ret.edgeY = vtx_y * 2 + 1;
        ret.cellX = -2; ret.cellY = -2;
        if (y_ofs - dotSize <= this.option.vertexMaximumDistanceFromActualVertex) {
            ret.vertexX = vtx_x * 2; ret.vertexY = vtx_y * 2;
        } else if (dotSize + cellSize - y_ofs <= this.option.vertexMaximumDistanceFromActualVertex) {
            ret.vertexX = vtx_x * 2; ret.vertexY = vtx_y * 2 + 2;
        } else {
            ret.vertexX = -2; ret.vertexY = -2;
        }
    } else {
        // on cell; find the nearest edge
        var edge_distance = cellSize;
        x_ofs -= dotSize; y_ofs -= dotSize;
        if (x_ofs < edge_distance) {
            edge_distance = x_ofs;
            ret.edgeX = vtx_x * 2;
            ret.edgeY = vtx_y * 2 + 1;
        }
        if (y_ofs < edge_distance) {
            edge_distance = y_ofs;
            ret.edgeX = vtx_x * 2 + 1;
            ret.edgeY = vtx_y * 2;
        }
        if (cellSize - x_ofs < edge_distance) {
            edge_distance = cellSize - x_ofs;
            ret.edgeX = vtx_x * 2 + 2;
            ret.edgeY = vtx_y * 2 + 1;
        }
        if (cellSize - y_ofs < edge_distance) {
            edge_distance = cellSize - y_ofs;
            ret.edgeX = vtx_x * 2 + 1;
            ret.edgeY = vtx_y * 2 + 2;
        }
        if (edge_distance > this.option.edgeMaximumDistanceFromActualEdge) {
            ret.edgeX = ret.edgeY = -2;
        }
        if (edge_distance <= this.option.cellMaximumDistanceFromEdge) {
            ret.cellX = vtx_x * 2 + 1;
            ret.cellY = vtx_y * 2 + 1;
        } else {
            ret.cellX = -2; ret.cellY = -2;
        }

        var vertex_distance;
        if (x_ofs <= cellSize / 2 && y_ofs <= cellSize / 2) {
            vertex_distance = Math.sqrt(x_ofs * x_ofs + y_ofs * y_ofs);
            ret.vertexX = vtx_x * 2;
            ret.vertexY = vtx_y * 2;
        } else if (x_ofs <= cellSize / 2 && y_ofs > cellSize / 2) {
            vertex_distance = Math.sqrt(x_ofs * x_ofs + (cellSize - y_ofs) * (cellSize - y_ofs));
            ret.vertexX = vtx_x * 2;
            ret.vertexY = vtx_y * 2 + 2;
        } else if (x_ofs > cellSize / 2 && y_ofs <= cellSize / 2) {
            vertex_distance = Math.sqrt((cellSize - x_ofs) * (cellSize - x_ofs) + y_ofs * y_ofs);
            ret.vertexX = vtx_x * 2 + 2;
            ret.vertexY = vtx_y * 2;
        } else if (x_ofs > cellSize / 2 && y_ofs > cellSize / 2) {
            vertex_distance = Math.sqrt((cellSize - x_ofs) * (cellSize - x_ofs) + (cellSize - y_ofs) * (cellSize - y_ofs));
            ret.vertexX = vtx_x * 2 + 2;
            ret.vertexY = vtx_y * 2 + 2;
        }
        if (vertex_distance > this.option.vertexMaximumDistanceFromActualVertex) {
            ret.vertexX = -2; ret.vertexY = -2;
        }
    }
    if (ret.edgeX < 0 || ret.edgeY < 0 || ret.edgeX > 2 * this.field.getWidth() || ret.edgeY > 2 * this.field.getHeight()) {
        ret.edgeX = -2; ret.edgeY = -2;
    }
    if (ret.cellX < -1 || ret.cellY < -1 || ret.cellX > 2 * this.field.getWidth() + 1 || ret.cellY > 2 * this.field.getHeight() + 1) {
        ret.cellX = -2; ret.cellY = -2;
    }
    if (ret.vertexX < 0 || ret.vertexY < 0 || ret.vertexX > 2 * this.field.getWidth() || ret.vertexY > 2 * this.field.getHeight()) {
        ret.vertexX = -2; ret.vertexY = -2;
    }
    return ret;
}
SlitherlinkController.prototype.mouseDown = function (x, y) {
    var loc = this.getLocation(x, y);
    this.moveDistance = 0;
    this.isMouseClicking = true;
    this.isLineAllowed = true;
    this.isBlankAllowed = true;
    this.lastMouseX = x;
    this.lastMouseY = y;
    this.lastVertexX = loc.vertexX;
    this.lastVertexY = loc.vertexY;
    this.lastCellX = loc.cellX;
    this.lastCellY = loc.cellY;
}
SlitherlinkController.prototype.mouseUp = function (x, y) {
    if (!this.isMouseClicking) return;
    this.isMouseClicking = false;
    var loc = this.getLocation(x, y);
    if (!this.isFinished && this.moveDistance <= this.option.maximumTapDistance && loc.edgeX != -2) {
        var s = this.field.getEdge(loc.edgeX, loc.edgeY);
        var s2;
        if (s == 0) s2 = 2;
        else s2 = 0;
        this.updateEdge(loc.edgeX, loc.edgeY, s2);
    }
}
SlitherlinkController.prototype.mouseMove = function (x, y) {
    if (!this.isMouseClicking) return;
    this.moveDistance += Math.abs(this.lastMouseX - x) + Math.abs(this.lastMouseY - y);
    this.lastMouseX = x;
    this.lastMouseY = y;

    var loc = this.getLocation(x, y);
    if (loc.cellX == -2 && loc.vertexX == -2) {
        if (loc.edgeX != -2) return;
        this.lastVertexX = -2;
        this.lastVertexY = -2;
        this.lastCellX = -2;
        this.lastCellY = -2;
    }
    if (this.moveDistance > this.option.maximumTapDistance && this.isLineAllowed && this.lastVertexX != -2 && loc.vertexX != -2 && Math.abs(this.lastVertexX - loc.vertexX) + Math.abs(this.lastVertexY - loc.vertexY) == 2) {
        if (!this.isFinished) this.updateEdge((this.lastVertexX + loc.vertexX) / 2, (this.lastVertexY + loc.vertexY) / 2, 1);
        this.isBlankAllowed = false;
    }
    if (false && this.isBlankAllowed && this.lastCellX != -2 && loc.cellX != -2 && Math.abs(this.lastCellX - loc.cellX) + Math.abs(this.lastCellY - loc.cellY) == 2) {
        if (!this.isFinished) this.updateEdge((this.lastCellX + loc.cellX) / 2, (this.lastCellY + loc.cellY) / 2, 2);
        this.isLineAllowed = false;
    }

    if (loc.vertexX != -2) {
        this.lastVertexX = loc.vertexX;
        this.lastVertexY = loc.vertexY;
    }
    if (loc.cellX != -2) {
        this.lastCellX = loc.cellX;
        this.lastCellY = loc.cellY;
    }
}
SlitherlinkController.prototype.performUndo = function () {
    if (this.undoHistory.length == 0) return;
    var undo = this.undoHistory.pop();
    this.redoHistory.push({ x: undo.x, y: undo.y, state: this.field.getEdge(undo.x, undo.y) });
    this.field.setEdge(undo.x, undo.y, undo.state);
    this.isFinished = this.field.isFinished();
    if (this.view) {
        this.view.drawEdge(undo.x, undo.y);
        this.view.drawIfComplete();
    }
}
SlitherlinkController.prototype.performRedo = function () {
    if (this.redoHistory.length == 0) return;
    var undo = this.redoHistory.pop();
    this.undoHistory.push({ x: undo.x, y: undo.y, state: this.field.getEdge(undo.x, undo.y) });
    this.field.setEdge(undo.x, undo.y, undo.state);
    this.isFinished = this.field.isFinished();
    if (this.view) {
        this.view.drawEdge(undo.x, undo.y);
        this.view.drawIfComplete();
    }
}
SlitherlinkController.prototype.performUndoAll = function () {
    while (this.undoHistory.length > 0) this.performUndo();
}
SlitherlinkController.prototype.performRedoAll = function () {
    while (this.undoHistory.length > 0) this.performRedo();
}
SlitherlinkController.prototype.zoomOut = function () {
    if (this.zoom <= 3) return;
    this.setZoom(this.zoom - 1);
    if (this.view) {
        this.view.adjustCanvasSize();
        this.view.drawAll();
    }
}
SlitherlinkController.prototype.zoomIn = function () {
    this.setZoom(this.zoom + 1);
    if (this.view) {
        this.view.adjustCanvasSize();
        this.view.drawAll();
    }
}
SlitherlinkController.prototype.previousProblem = function () {
    if (this.problemId == 0) this.problemId = this.problems.length - 1;
    else this.problemId -= 1;

    this.setProblemId(this.problemId);
}
SlitherlinkController.prototype.nextProblem = function () {
    if (this.problemId == this.problems.length - 1) this.problemId = 0;
    else this.problemId += 1;

    this.setProblemId(this.problemId);
}
