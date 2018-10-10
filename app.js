const {app, BrowserWindow} = require('electron')

let mainWindow

function createWindow() {
    mainWindow = new BrowserWindow({width: 800, height: 600})
    mainWindow.loadFile('index.html')
}

app.on('ready', createWindow)

app.on('activate', function() {
    if(mainWindow === null) {
        createWindow()
    }
})

app.on('closed', function() {
    mainWindow = null
})