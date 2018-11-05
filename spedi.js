let start = Date.now()
let canvas_container = document.getElementById('canvas-container')
let canvas = document.getElementById('canvas')
let ctx = canvas.getContext('2d')
let side = 0;
let cells;
let tilecount = 100;
let cellwidth = side / tilecount
let playing = true
init()
let i = 0
setInterval(() => {
    if (playing) {
        step()
        i++;
    }
    if (i == 1000) console.log(1000 / (Date.now() - start) * 1000)
}, 1)
function step() {
    side = canvas_container.offsetHeight
    canvas_container.style.width = side
    if (canvas.width != side || canvas.height != side) {
        canvas.width = side
        canvas.height = side
    }
    ctx.clearRect(0, 0, side, side)
    cellwidth = side / tilecount
    let nextphase = cells.slice(0)
    for (var y = 0; y < tilecount; y++) {
        for (let x = 0; x < tilecount; x++) {
            nextphase[y * tilecount + x] = nextvalue(x, y, cells[y * tilecount + x])
            if (nextphase[y * tilecount + x]) draw(x, y, nextphase[y * tilecount + x])
        }
    }
    cells = nextphase.slice(0)
}
function getneighborcount(x, y) {
    let neighborcount = 0
    py = (y + 1) == tilecount ? 0 : y + 1
    my = (y - 1) < 0 ? tilecount - 1 : y - 1
    px = (x - 1) < 0 ? tilecount - 1 : x - 1
    mx = (x + 1) == tilecount ? 0 : x + 1
    neighborcount += cells[py * tilecount + mx]
    neighborcount += cells[py * tilecount + x]
    neighborcount += cells[py * tilecount + px]
    neighborcount += cells[y * tilecount + mx]
    neighborcount += cells[y * tilecount + px]
    neighborcount += cells[my * tilecount + mx]
    neighborcount += cells[my * tilecount + x]
    neighborcount += cells[my * tilecount + px]
    return neighborcount
}
function nextvalue(x, y, val) {
    let neighborcount = getneighborcount(x, y);
    if (val) {
        if (neighborcount < 2 || neighborcount > 3) {
            return false
        } else {
            return true
        }
    } else {
        if (neighborcount == 3) {
            return true
        } else {
            return false
        }
    }
}

function init() {
    side = canvas_container.offsetHeight
    canvas_container.style.width = side
    canvas.width = side
    canvas.height = side
    cells = []
    for (let x = 0; x < tilecount; x++) {
        for (let y = 0; y < tilecount; y++) {
            cells.push(Math.random() >= 0.7)
        }
    }
}

function draw(x, y, age) {
    ctx.fillStyle = `hsl(120,50%,50%)`
    if (age) ctx.fillRect(x * cellwidth, y * cellwidth, cellwidth, cellwidth)
}

canvas.addEventListener('click', (e) => {
    let y = Math.floor(e.offsetY / cellwidth)
    let x = Math.floor(e.offsetX / cellwidth)
    if (!e.metaKey) {
        console.log(x, y, e.offsetX, e.offsetY)
        cells[y * tilecount + x] = 1
        draw(x, y, cells[y * tilecount + x])
    } else {
        console.log(getneighborcount(x, y), nextvalue(x, y, cells[y * tilecount + x]))
    }
}, false)
