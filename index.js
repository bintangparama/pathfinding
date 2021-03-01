var gridsize = 20;
var grid = [[new PFNode()]];

document.querySelector('input').value = '100'
var speed = document.querySelector('input').value;

var togglepaint = document.getElementById('tp')
var paint = {
    toggle: () => {
        paint.isOn = !paint.isOn;
        if (paint.isOn) togglepaint.innerHTML = 'Erase wall';
        if (!paint.isOn) togglepaint.innerHTML = 'Draw wall';
    },
    isOn: true
}

InitializeGrid(gridsize);