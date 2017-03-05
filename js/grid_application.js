$(document).ready(function () {
    var cont = new GridController();
    var view = new GridView();
    var field = new GridField(10, 10);
    cont.setField(field);
    view.setField(field);

    var canvas = document.getElementById("player");
    canvas.addEventListener("mousedown", function (event) {
        var x = event.clientX, y = event.clientY, button = (event.button == 2);
        var rect = event.target.getBoundingClientRect();
        cont.mouseDown(x - rect.left, y - rect.top, button);
        view.drawAll();
    });
    canvas.addEventListener("touchstart", function (event) {
        event.preventDefault();
        var x = event.changedTouches[0].clientX, y = event.changedTouches[0].clientY, button = false;
        var rect = event.target.getBoundingClientRect();
        cont.mouseDown(x - rect.left, y - rect.top, button);
        view.drawAll();
    });
    canvas.addEventListener("mousemove", function (event) {
        var x = event.clientX, y = event.clientY, button = (event.button == 2);
        var rect = event.target.getBoundingClientRect();
        cont.mouseMove(x - rect.left, y - rect.top, button);
        view.drawAll();
    });
    canvas.addEventListener("touchmove", function (event) {
        event.preventDefault();
        var x = event.changedTouches[0].clientX, y = event.changedTouches[0].clientY, button = false;
        var rect = event.target.getBoundingClientRect();
        cont.mouseMove(x - rect.left, y - rect.top, button);
        view.drawAll();
    });
    canvas.addEventListener("mouseup", function (event) {
        var x = event.clientX, y = event.clientY, button = (event.button == 2);
        var rect = event.target.getBoundingClientRect();
        cont.mouseUp(x - rect.left, y - rect.top, button);
        view.drawAll();
    });
    canvas.addEventListener("touchend", function (event) {
        event.preventDefault();
        var x = event.changedTouches[0].clientX, y = event.changedTouches[0].clientY, button = false;
        var rect = event.target.getBoundingClientRect();
        cont.mouseUp(x - rect.left, y - rect.top, button);
        view.drawAll();
    });
    canvas.addEventListener("mouseout", function (event) {
        cont.mouseUp(-32768, -32768);
    });
    canvas.addEventListener("contextmenu", function (e) { e.preventDefault(); });

    $("#toolbar").append(createButton('<svg viewBox="0 0 100 100" height="20px" width="20px" style="vertical-align:-50%; position: relative; top: 50%;">\
            <polygon points="50,10 50,90 10,50" stroke="#000" fill="#000" />\
            <polygon points="90,10 90,90 50,50" stroke="#000" fill="#000" /></svg>', function () { cont.performUndoAll(); view.drawAll(); }));
    $("#toolbar").append(createButton('<svg viewBox="0 0 100 100" height="20px" width="20px" style="vertical-align:-50%; position: relative; top: 50%;">\
            <polygon points="70,10 70,90 30,50" stroke="#000" fill="#000" /></svg>', function () { cont.performUndo(); view.drawAll(); }, true));
    $("#toolbar").append(createButton('<svg viewBox="0 0 100 100" height="20px" width="20px" style="vertical-align:-50%; position: relative; top: 50%;">\
            <polygon points="30,10 30,90 70,50" stroke="#000" fill="#000" /></svg>', function () { cont.performRedo(); view.drawAll(); }, true));
    $("#toolbar").append(createButton('<svg viewBox="0 0 100 100" height="20px" width="20px" style="vertical-align:-50%; position: relative; top: 50%;">\
            <polygon points="10,10 10,90 50,50" stroke="#000" fill="#000" />\
            <polygon points="50,10 50,90 90,50" stroke="#000" fill="#000" /></svg>', function () { cont.performRedoAll(); view.drawAll(); }));

    view.setCanvas(canvas);
    view.drawAll();
});
