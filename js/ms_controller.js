function MasyuController(problems) {
    this.option = {};
    this.option.outerMargin = 20;

    this.gridController = new GridController();

    this.isFinished = false;

    this.problems = problems;
    this.setProblemId(0);

    this.setZoom(3);
}
MasyuController.prototype.setView = function (view) {
    this.view = view;
    this.view.setField(this.field);
    this.view.setOption(this.option);

    this.view.adjustCanvasSize();
    this.view.drawAll();
}
MasyuController.prototype.setZoom = function (z) {
    this.zoom = z;

    // parameters for SlitherlinkView
    this.option.gridLineWidth = z * 1;
    this.option.loopLineWidth = z * 1;
    this.option.cellSize = z * 10;
    this.option.blankXSize = z * 1.5;

    // parameters for GridController
    this.gridController.offsetX = this.option.outerMargin + this.option.gridLineWidth + this.option.cellSize / 2;
    this.gridController.offsetY = this.option.outerMargin + this.option.gridLineWidth + this.option.cellSize / 2;
    this.gridController.lineWidth = this.option.loopLineWidth;
    this.gridController.cellSize = this.option.cellSize;
    this.gridController.vertexThresholdDistance = z * 5;
    this.gridController.edgeThresholdDistance = z * 3;
    this.gridController.clickThresholdDistance = z * 2;
}
MasyuController.prototype.setProblemSet = function (problems) {
    this.problems = problems;
    this.setProblemId(0);
}
MasyuController.prototype.setProblemId = function (idx) {
    this.isFinished = false;
    this.undoHistory = [];
    this.redoHistory = [];

    this.problemId = idx;
    this.field = new MasyuField(this.problems[idx]);
    this.gridController.setField(this.field.getInternalGrid());

    if (this.view) {
        this.view.setField(this.field);
        this.view.adjustCanvasSize();
        this.view.drawAll();
    }
}
MasyuController.prototype.getProblemId = function () {
    return this.problemId;
}
MasyuController.prototype.getNumberOfProblems = function () {
    return this.problems.length;
}
MasyuController.prototype.performUpdate = function (edges) {
    this.isFinished = this.field.isFinished();
    if (this.view) {
        for (var i = 0; i < edges.length; ++i) {
            this.view.drawEdge(edges[i].x, edges[i].y);
        }
        this.view.drawIfComplete();
    }
}
MasyuController.prototype.mouseDown = function (x, y) {
    this.performUpdate(this.gridController.mouseDown(x, y, this.isFinished));
}
MasyuController.prototype.mouseMove = function (x, y) {
    this.performUpdate(this.gridController.mouseMove(x, y, this.isFinished));
}
MasyuController.prototype.mouseUp = function (x, y) {
    this.performUpdate(this.gridController.mouseUp(x, y, this.isFinished));
}
MasyuController.prototype.performUndo = function () {
    this.performUpdate(this.gridController.performUndo());
}
MasyuController.prototype.performUndoAll = function () {
    this.performUpdate(this.gridController.performUndoAll());
}
MasyuController.prototype.performRedo = function () {
    this.performUpdate(this.gridController.performRedo());
}
MasyuController.prototype.performRedoAll = function () {
    this.performUpdate(this.gridController.performRedoAll());
}
MasyuController.prototype.zoomOut = function () {
    if (this.zoom <= 3) return;
    this.setZoom(this.zoom - 1);
    if (this.view) {
        this.view.adjustCanvasSize();
        this.view.drawAll();
    }
}
MasyuController.prototype.zoomIn = function () {
    this.setZoom(this.zoom + 1);
    if (this.view) {
        this.view.adjustCanvasSize();
        this.view.drawAll();
    }
}
MasyuController.prototype.previousProblem = function () {
    if (this.problemId == 0) this.problemId = this.problems.length - 1;
    else this.problemId -= 1;

    this.setProblemId(this.problemId);
}
MasyuController.prototype.nextProblem = function () {
    if (this.problemId == this.problems.length - 1) this.problemId = 0;
    else this.problemId += 1;

    this.setProblemId(this.problemId);
}
