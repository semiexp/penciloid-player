function NurikabeController(problems) {
    this.option = {};
    this.option.outerMargin = 20;
    this.option.lineWidth = 2;

    this.isFinished = false;

    this.undoHistory = [];
    this.redoHistory = [];

    this.problems = problems;
    this.setProblemId(0);

    this.setZoom(3);
}
NurikabeController.prototype.setView = function (view) {
    this.view = view;
    this.view.setField(this.field);
    this.view.setOption(this.option);

    this.view.adjustCanvasSize();
    this.view.drawAll();
}
NurikabeController.prototype.setZoom = function (z) {
    this.zoom = z;
    this.option.lineWidth = z * 1;
    this.option.cellSize = z * 10;
    this.option.blockSize = z * 8;
    this.option.dotSize = z * 2;
}
NurikabeController.prototype.setProblemSet = function (problems) {
    this.problems = problems;
    this.setProblemId(0);
}
NurikabeController.prototype.addProblem = function (problem) {
    this.problems.push(problem);
}
NurikabeController.prototype.setProblemId = function (idx) {
    this.isFinished = false;
    this.undoHistory = [];
    this.redoHistory = [];

    this.problemId = idx;
    this.field = new NurikabeField(this.problems[idx]);

    if (this.view) {
        this.view.setField(this.field);
        this.view.adjustCanvasSize();
        this.view.drawAll();
    }
}
NurikabeController.prototype.getProblemId = function () {
    return this.problemId;
}
NurikabeController.prototype.getNumberOfProblems = function () {
    return this.problems.length;
}
NurikabeController.prototype.updateCell = function (x, y, v) {
    if (x < 0 || x >= this.field.getWidth() || y < 0 || y >= this.field.getHeight() || this.field.getCell(x, y) == v || this.field.getCell(x, y) >= 1) return;
    this.redoHistory = [];
    this.undoHistory.push({ x: x, y: y, state: this.field.getCell(x, y) });
    this.field.setCell(x, y, v);
    this.isFinished = this.field.isFinished();
    if (this.view) {
        this.view.drawCell(x, y);
        this.view.drawIfComplete();
    }
}
NurikabeController.prototype.getLocation = function (x, y) {
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
NurikabeController.prototype.mouseDown = function (x, y) {
    var loc = this.getLocation(x, y);
    if (loc.x != -1 && loc.y != -1 && !this.isFinished) {
        var cellValue = this.field.getCell(loc.x, loc.y);
        if (cellValue == 0) this.updateCell(loc.x, loc.y, -2);
        else if (cellValue == -2) this.updateCell(loc.x, loc.y, -1);
        else if (cellValue == -1) this.updateCell(loc.x, loc.y, 0);
    }
}
NurikabeController.prototype.mouseUp = function (x, y) {
    // TODO: more user-friendly UI
}
NurikabeController.prototype.mouseMove = function (x, y) {
    // TODO: more user-friendly UI
}
NurikabeController.prototype.performUndo = function () {
    if (this.undoHistory.length == 0) return;
    var undo = this.undoHistory.pop();
    this.redoHistory.push({ x: undo.x, y: undo.y, state: this.field.getCell(undo.x, undo.y) });
    this.field.setCell(undo.x, undo.y, undo.state);
    this.isFinished = this.field.isFinished();
    if (this.view) {
        this.view.drawCell(undo.x, undo.y);
        this.view.drawIfComplete();
    }
}
NurikabeController.prototype.performRedo = function () {
    if (this.redoHistory.length == 0) return;
    var undo = this.redoHistory.pop();
    this.undoHistory.push({ x: undo.x, y: undo.y, state: this.field.getCell(undo.x, undo.y) });
    this.field.setCell(undo.x, undo.y, undo.state);
    this.isFinished = this.field.isFinished();
    if (this.view) {
        this.view.drawCell(undo.x, undo.y);
        this.view.drawIfComplete();
    }
}
NurikabeController.prototype.performUndoAll = function () {
    while (this.undoHistory.length > 0) this.performUndo();
}
NurikabeController.prototype.performRedoAll = function () {
    while (this.redoHistory.length > 0) this.performRedo();
}
NurikabeController.prototype.zoomOut = function () {
    if (this.zoom <= 3) return;
    this.setZoom(this.zoom - 1);
    if (this.view) {
        this.view.adjustCanvasSize();
        this.view.drawAll();
    }
}
NurikabeController.prototype.zoomIn = function () {
    this.setZoom(this.zoom + 1);
    if (this.view) {
        this.view.adjustCanvasSize();
        this.view.drawAll();
    }
}
NurikabeController.prototype.previousProblem = function () {
    if (this.problemId == 0) this.problemId = this.problems.length - 1;
    else this.problemId -= 1;

    this.setProblemId(this.problemId);
}
NurikabeController.prototype.nextProblem = function () {
    if (this.problemId == this.problems.length - 1) this.problemId = 0;
    else this.problemId += 1;

    this.setProblemId(this.problemId);
}
