var $ = require('jquery');
var fs = require('fs');
const {
    dialog
} = require('electron').remote;

$(document).ready(() => {
    console.log("***App Ready***");

    $('#source-folder').on('click', (event) => {
        var sourceDirectory = event.currentTarget.value;
        console.log("***Source Directory***");
        dialog.showOpenDialog({
            title: "Select the Source Folder",
            properties: ["openDirectory"]
        }, (folderPaths) => {
            if(folderPaths === undefined) {
                console.log("***No Source Folder Selected***");
                return;
            } else {
                console.log(folderPaths);
                printFolderName(folderPaths, 'source-folder-value');
            }
        });

    });
    
    $('#destination-folder').on('click', (event) => {
        var sourceDirectory = event.currentTarget.value;
        console.log("***Destination Directory***");
        dialog.showOpenDialog({
            title: "Select the Destination Folder",
            properties: ["openDirectory"]
        }, (folderPaths) => {
            if(folderPaths === undefined) {
                console.log("***No Destination Folder Selected***");
                return;
            } else {
                console.log(folderPaths);
                printFolderName(folderPaths, 'destination-folder-value');
            }
        });

    });


});

function printFolderName(folderName, targetElement) {
    targetElement && $('#'+targetElement).text(folderName);
}
