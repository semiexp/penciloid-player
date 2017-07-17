function KakuroController(problems) {
    this.option = {};
    this.option.outerMargin = 20;
    this.option.lineWidth = 2;

    this.isFinished = false;

    this.undoHistory = [];
    this.redoHistory = [];

    this.selectedX = -1;
    this.selectedY = -1;

    this.problems = problems;
    this.setProblemId(0);

    this.keypad = new NumericKeypad();
    this.setZoom(3);
}
KakuroController.prototype.setView = function (view) {
    this.view = view;
    this.view.setField(this.field);
    this.view.setOption(this.option);

    this.view.adjustCanvasSize();
    this.view.drawAll(this.selectedX, this.selectedY);
}
KakuroController.prototype.setZoom = function (z) {
    this.zoom = z;
    this.option.lineWidth = Math.floor(z / 2);
    this.option.cellSize = z * 10;
    this.option.clueDiagonalLineWidth = this.option.lineWidth;
    this.keypad.setCellSize(this.option.cellSize);
}
KakuroController.prototype.setProblemSet = function (problems) {
    this.problems = problems;
    this.setProblemId(0);
}
KakuroController.prototype.addProblem = function (problem) {
    this.problems.push(problem);
}
KakuroController.prototype.setProblemId = function (idx) {
    this.isFinished = false;
    this.undoHistory = [];
    this.redoHistory = [];

    this.problemId = idx;
    this.field = new KakuroField(this.problems[idx]);

    this.selectedX = -1;
    this.selectedY = -1;

    if (this.view) {
        this.view.setField(this.field);
        this.view.adjustCanvasSize();
        this.view.drawAll();
    }
}
KakuroController.prototype.getProblemId = function () {
    return this.problemId;
}
KakuroController.prototype.getNumberOfProblems = function () {
    return this.problems.length;
}
KakuroController.prototype.selectCell = function (x, y) {
    if (this.selectedX != -1) {
        this.view.drawCell(this.selectedX, this.selectedY, false);
    }
    this.selectedX = x;
    this.selectedY = y;
    this.view.drawCell(x, y, true);
}
KakuroController.prototype.updateCell = function (x, y, v) {
    if (x < 0 || x >= this.field.getWidth() || y < 0 || y >= this.field.getHeight() || this.field.isClue(x, y) || this.field.getValue(x, y) == v) return;
    this.redoHistory = [];
    this.undoHistory.push({ x: x, y: y, value: this.field.getValue(x, y) });
    this.field.setValue(x, y, v);
    this.isFinished = this.field.isFinished();
    if (this.view) {
        this.view.drawCell(x, y, (x == this.selectedX && y == this.selectedY));
        this.view.drawIfComplete();
    }
}
KakuroController.prototype.getLocation = function (x, y) {
    // (x, y): position given by Applet
    x -= this.option.outerMargin; y -= this.option.outerMargin;
    var ret = {};
    var lineWidth = this.option.lineWidth, cellSize = this.option.cellSize;

    var vtx_x = Math.floor(x / (lineWidth + cellSize)), vtx_y = Math.floor(y / (lineWidth + cellSize));
    var x_ofs = x - vtx_x * (lineWidth + cellSize), y_ofs = y - vtx_y * (lineWidth + cellSize);

    ret.x = ret.y = -1;
    if (x_ofs >= lineWidth && y_ofs >= lineWidth) {
        ret.x = vtx_x;
        ret.y = vtx_y;
    }

    if (ret.x < 0 || ret.y < 0 || ret.x >= this.field.getWidth() || ret.y >= this.field.getHeight()) {
        ret.x = ret.y = -1;
    }
    
    return ret;
}
KakuroController.prototype.mouseDown = function (x, y) {
    var loc = this.getLocation(x, y);
    if (loc.x != -1 && loc.y != -1 && !this.isFinished && !this.field.isClue(loc.x, loc.y)) {
        var value = this.field.getValue(loc.x, loc.y);
        if (value == -1) {
            var canvasPos = $(this.view.canvas).offset();
            var self = this;
            this.keypad.displayKeypad(
                x + canvasPos.left,
                y + canvasPos.top,
                function (sel) {
                    if (sel != -1) {
                        self.updateCell(loc.x, loc.y, sel);
                        self.selectCell(loc.x, loc.y);
                    }
                }
                );
        } else {
            this.updateCell(loc.x, loc.y, -1);
        }
    }
}
KakuroController.prototype.mouseUp = function (x, y) {
    // TODO: more user-friendly UI
}
KakuroController.prototype.mouseMove = function (x, y) {
    // TODO: more user-friendly UI
}
KakuroController.prototype.keyDown = function (key) {
    if (this.isFinished) return;
    switch (key) {
        case 37: // left
            if (this.selectedX > 0) {
                this.selectCell(this.selectedX - 1, this.selectedY);
            }
            break;
        case 38: // up
            if (this.selectedY > 0) {
                this.selectCell(this.selectedX, this.selectedY - 1);
            }
            break;
        case 39: // right
            if (this.selectedX >= 0 && this.selectedX < this.field.getWidth() - 1) {
                this.selectCell(this.selectedX + 1, this.selectedY);
            }
            break;
        case 40: // down
            if (this.selectedY >= 0 && this.selectedY < this.field.getHeight() - 1) {
                this.selectCell(this.selectedX, this.selectedY + 1);
            }
            break;
        case 49:
        case 50:
        case 51:
        case 52:
        case 53:
        case 54:
        case 55:
        case 56:
        case 57: // 1-9
            if (this.selectedY >= 0 && !this.field.isClue(this.selectedX, this.selectedY)) {
                this.updateCell(this.selectedX, this.selectedY, key - 48);
            }
            break;
    }
}
KakuroController.prototype.performUndo = function () {
    if (this.undoHistory.length == 0) return;
    var undo = this.undoHistory.pop();
    this.redoHistory.push({ x: undo.x, y: undo.y, value: this.field.getValue(undo.x, undo.y) });
    this.field.setValue(undo.x, undo.y, undo.value);
    this.isFinished = this.field.isFinished();
    if (this.view) {
        this.view.drawCell(undo.x, undo.y, (undo.x == this.selectedX && undo.y == this.selectedY));
        this.view.drawIfComplete();
    }
}
KakuroController.prototype.performRedo = function () {
    if (this.redoHistory.length == 0) return;
    var undo = this.redoHistory.pop();
    this.undoHistory.push({ x: undo.x, y: undo.y, value: this.field.getValue(undo.x, undo.y) });
    this.field.setValue(undo.x, undo.y, undo.value);
    this.isFinished = this.field.isFinished();
    if (this.view) {
        this.view.drawCell(undo.x, undo.y, (undo.x == this.selectedX && undo.y == this.selectedY));
        this.view.drawIfComplete();
    }
}
KakuroController.prototype.performUndoAll = function () {
    while (this.undoHistory.length > 0) this.performUndo();
}
KakuroController.prototype.performRedoAll = function () {
    while (this.redoHistory.length > 0) this.performRedo();
}
KakuroController.prototype.zoomOut = function () {
    if (this.zoom <= 3) return;
    this.setZoom(this.zoom - 1);
    if (this.view) {
        this.view.adjustCanvasSize();
        this.view.drawAll(this.selectedX, this.selectedY);
    }
}
KakuroController.prototype.zoomIn = function () {
    this.setZoom(this.zoom + 1);
    if (this.view) {
        this.view.adjustCanvasSize();
        this.view.drawAll(this.selectedX, this.selectedY);
    }
}
KakuroController.prototype.previousProblem = function () {
    if (this.problemId == 0) this.problemId = this.problems.length - 1;
    else this.problemId -= 1;

    this.setProblemId(this.problemId);
}
KakuroController.prototype.nextProblem = function () {
    if (this.problemId == this.problems.length - 1) this.problemId = 0;
    else this.problemId += 1;

    this.setProblemId(this.problemId);
}
