$(document).ready(function () {
    var defaultProblem = new KakuroProblem(3, 3);
    defaultProblem.setClueHorizontal(0, 0, 0);
    defaultProblem.setClueHorizontal(0, 1, 3);
    defaultProblem.setClueHorizontal(0, 2, 16);
    defaultProblem.setClueVertical(1, 0, 11);
    defaultProblem.setClueVertical(2, 0, 8);
    var view = new KakuroView();
    var canvas = document.getElementById("player");
    var cont = new KakuroController([defaultProblem]);

    canvas.addEventListener("mousedown", function (event) {
        var x = event.clientX, y = event.clientY, button = (event.button == 2);
        var rect = event.target.getBoundingClientRect();
        cont.mouseDown(x - rect.left, y - rect.top, button);
    });
    canvas.addEventListener("touchstart", function (event) {
        event.preventDefault();
        var x = event.changedTouches[0].clientX, y = event.changedTouches[0].clientY, button = false;
        var rect = event.target.getBoundingClientRect();
        cont.mouseDown(x - rect.left, y - rect.top, button);
    });
    canvas.addEventListener("mousemove", function (event) {
        var x = event.clientX, y = event.clientY, button = (event.button == 2);
        var rect = event.target.getBoundingClientRect();
        cont.mouseMove(x - rect.left, y - rect.top, button);
    });
    canvas.addEventListener("touchmove", function (event) {
        event.preventDefault();
        var x = event.changedTouches[0].clientX, y = event.changedTouches[0].clientY, button = false;
        var rect = event.target.getBoundingClientRect();
        cont.mouseMove(x - rect.left, y - rect.top, button);
    });
    canvas.addEventListener("mouseup", function (event) {
        var x = event.clientX, y = event.clientY, button = (event.button == 2);
        var rect = event.target.getBoundingClientRect();
        cont.mouseUp(x - rect.left, y - rect.top, button);
    });
    canvas.addEventListener("touchend", function (event) {
        event.preventDefault();
        var x = event.changedTouches[0].clientX, y = event.changedTouches[0].clientY, button = false;
        var rect = event.target.getBoundingClientRect();
        cont.mouseUp(x - rect.left, y - rect.top, button);
    });
    canvas.addEventListener("mouseout", function (event) {
        cont.mouseUp(-32768, -32768);
    });
    canvas.addEventListener("contextmenu", function (e) { e.preventDefault(); });
    
    var problemIdBox = $("<span style='vertical-align:middle'></span>");
    var setProblemIdBox = function () {
        problemIdBox.text((cont.getProblemId() + 1) + "/" + cont.getNumberOfProblems());
    }
    $("#toolbar").append(createButton('<svg viewBox="0 0 100 100" height="20px" width="20px" style="vertical-align:-50%; position: relative; top: 50%;">\
            <polygon points="50,10 50,90 10,50" stroke="#000" fill="#000" />\
            <polygon points="90,10 90,90 50,50" stroke="#000" fill="#000" /></svg>', function () { cont.performUndoAll(); }));
    $("#toolbar").append(createButton('<svg viewBox="0 0 100 100" height="20px" width="20px" style="vertical-align:-50%; position: relative; top: 50%;">\
            <polygon points="70,10 70,90 30,50" stroke="#000" fill="#000" /></svg>', function () { cont.performUndo(); }, true));
    $("#toolbar").append(createButton('<svg viewBox="0 0 100 100" height="20px" width="20px" style="vertical-align:-50%; position: relative; top: 50%;">\
            <polygon points="30,10 30,90 70,50" stroke="#000" fill="#000" /></svg>', function () { cont.performRedo(); }, true));
    $("#toolbar").append(createButton('<svg viewBox="0 0 100 100" height="20px" width="20px" style="vertical-align:-50%; position: relative; top: 50%;">\
            <polygon points="10,10 10,90 50,50" stroke="#000" fill="#000" />\
            <polygon points="50,10 50,90 90,50" stroke="#000" fill="#000" /></svg>', function () { cont.performRedoAll(); }));
    $("#toolbar").append(createButton('<svg viewBox="0 0 100 100" height="20px" width="20px" style="vertical-align:-50%; position: relative; top: 50%;">\
            <polygon points="10,40 90,40 90,60 10,60" stroke="#000" fill="#000" /></svg>', function () { cont.zoomOut(); }));
    $("#toolbar").append(createButton('<svg viewBox="0 0 100 100" height="20px" width="20px" style="vertical-align:-50%; position: relative; top: 50%;">\
            <polygon points="10,40 40,40 40,10 60,10 60,40 90,40 90,60 60,60 60,90 40,90 40,60 10,60" stroke="#000" fill="#000" /></svg>', function () { cont.zoomIn(); }));
    $("#toolbar").append(createButton('<svg viewBox="0 0 100 100" height="20px" width="20px" style="vertical-align:-50%; position: relative; top: 50%;">\
            <polygon points="10,50 40,20 40,40 90,40 90,60 40,60 40,80" stroke="#000" fill="#000" /></svg>', function () { cont.previousProblem(); setProblemIdBox(); }, true));
    $("#toolbar").append(createButton('<svg viewBox="0 0 100 100" height="20px" width="20px" style="vertical-align:-50%; position: relative; top: 50%;">\
            <polygon points="90,50 60,20 60,40 10,40 10,60 60,60 60,80" stroke="#000" fill="#000" /></svg>', function () { cont.nextProblem(); setProblemIdBox(); }, true));
    $("#toolbar").append(problemIdBox);

    view.setCanvas(canvas);
    cont.setView(view);
    setProblemIdBox();
});
