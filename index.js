let json;
const file = new FileReader()
const reader = document.getElementById('reader')
const cinput = document.getElementById('color')
reader.addEventListener('change', (e) => {
    text = ""
    file.readAsText(e.target.files[0], 'utf8')
    file.onloadend = (evt) => {
        if (evt.target.readyState === FileReader.DONE) {
            json = JSON.parse(evt.target.result)
            changecolor(json)
        }
    }
})

function truncateToDecimals(num, dec = 7) {
    const calcDec = Math.pow(10, dec);
    return Math.trunc(num * calcDec) / calcDec;
}

function handledivision(num, div = 255, digits = 7) {
    let divd = (num / div).toFixed(digits)
    if (divd.length < 9) {
        return truncateToDecimals(num / div, digits)
    } else {
        return parseFloat(divd)
    }
}

function toColor(num) {
    num >>>= 0;
    var b = num & 0xFF,
        g = (num & 0xFF00) >>> 8,
        r = (num & 0xFF0000) >>> 16
    return [r, g, b]
}

cinput.addEventListener('change', (e) => {
    let color = e.target.value
    let [r, g, b] = toColor(Number.parseInt(color.substr(1), 16))
    r = handledivision(r)
    g = handledivision(g)
    b = handledivision(b)
    console.log([r, g, b])
    if (json !== undefined) {
        json[1].TevColors[0].R = r
        json[1].TevColors[0].G = g
        json[1].TevColors[0].B = b
    }
})

function changecolor(data) {
    if (cinput !== null) {
        cinput.value = formatcolors(data[1].TevColors[0])
    }
}

function formatcolors(data) {
    let [r, g, b] = [data.R, data.G, data.B]
    r = Math.round(r * 255).toString(16).padStart(2, '0')
    g = Math.round(g * 255).toString(16).padStart(2, '0')
    b = Math.round(b * 255).toString(16).padStart(2, '0')
    return `#${r}${g}${b}`
}

function download(file, text) {
              
    var element = document.createElement('a');
    element.setAttribute('href', 
    'data:text/plain;charset=utf-8,'
    + text);
    element.setAttribute('download', file);
  
  
    document.body.appendChild(element);
  
    element.click();
  
    document.body.removeChild(element);
}

function save() {
    let data = JSON.stringify(json, null, 2)
    if (data === undefined) {
        data = '{}'
    }
    download('grandstar_materials.json', data)
}