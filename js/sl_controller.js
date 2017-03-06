function SlitherlinkController(problems) {
    this.option = {};
    this.option.outerMargin = 20;
    this.option.lineMargin = 1;
    this.option.lineWidth = 3;

    this.gridController = new GridController();
    this.gridController.offsetX = 20;
    this.gridController.offsetY = 20;

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

    // parameters for SlitherlinkView
    this.option.dotSize = z * 1;
    this.option.cellSize = z * 10;
    this.option.blankXSize = z * 1.5;

    // parameters for GridController
    this.gridController.lineWidth = z * 1;
    this.gridController.cellSize = z * 10;
    this.gridController.vertexThresholdDistance = z * 5;
    this.gridController.edgeThresholdDistance = z * 3;
    this.gridController.clickThresholdDistance = z * 2;
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
    this.gridController.setField(this.field);

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
SlitherlinkController.prototype.performUpdate = function (edges) {
    this.isFinished = this.field.isFinished();
    if (this.view) {
        for (var i = 0; i < edges.length; ++i) {
            this.view.drawEdge(edges[i].x, edges[i].y);
        }
        this.view.drawIfComplete();
    }
}
SlitherlinkController.prototype.mouseDown = function (x, y) {
    this.performUpdate(this.gridController.mouseDown(x, y, this.isFinished));
}
SlitherlinkController.prototype.mouseMove = function (x, y) {
    this.performUpdate(this.gridController.mouseMove(x, y, this.isFinished));
}
SlitherlinkController.prototype.mouseUp = function (x, y) {
    this.performUpdate(this.gridController.mouseUp(x, y, this.isFinished));
}
SlitherlinkController.prototype.performUndo = function () {
    this.performUpdate(this.gridController.performUndo());
}
SlitherlinkController.prototype.performUndoAll = function () {
    this.performUpdate(this.gridController.performUndoAll());
}
SlitherlinkController.prototype.performRedo = function () {
    this.performUpdate(this.gridController.performRedo());
}
SlitherlinkController.prototype.performRedoAll = function () {
    this.performUpdate(this.gridController.performRedoAll());
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
