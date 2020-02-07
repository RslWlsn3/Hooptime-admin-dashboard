const electron = require('electron')
const url = require('url');
const path = require('path');
const deletion = require('./MongoDBAccess')

const {app, BrowserWindow, Menu, ipcMain} = electron;               
let mainWindow;

app.on('ready', function(){
    //creates new window
    mainWindow = new BrowserWindow(
        {
            webPreferences: {
                nodeIntegration: true
            }
        }
    );
    //load html
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'mainWindow.html'),
        protocol:'file:',
        slashes: true
    }));

    //builds menu from template
    const mainMenu = Menu.buildFromTemplate(mainMenuTemplate)
    //insert menu
    Menu.setApplicationMenu(mainMenu);
});

//catch item:add (should rename later)
ipcMain.on('item:add', function(e, item){   
    deletion.run(item);    
})


//menu template
const mainMenuTemplate = [
    {
        label:'file'
    }
]

//add developer tool if not in prod
if(process.env.NODE_ENV !== 'production'){
    mainMenuTemplate.push({
        label: 'Developer Tools',
        submenu:[
            {
                label: 'Toggle DevTools',
                accelerator: process.platform == 'darwin' ? 'Comand+I' :
                'Ctrl+I',
                click(item, focusedWindow){
                    focusedWindow.toggleDevTools();
                }
            },
            {
                role: 'reload'
            }
            
        ]
    })
}

