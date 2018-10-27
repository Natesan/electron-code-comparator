var $ = require('jquery');
var fs = require('fs');
const {
    dialog
} = require('electron').remote;
var compare = require('./compare.js');

var sourceDirectory, destinationDirectory;

$(document).ready(() => {
    console.log("***App Ready***");

    $('#source-folder').on('click', (event) => {
        console.log("***Source Directory***");
        dialog.showOpenDialog({
            title: "Select the Source Folder",
            properties: ["openDirectory"]
        }, (folderPaths) => {
            if(folderPaths === undefined) {
                console.log("***No Source Folder Selected***");
                return;
            } else {
                sourceDirectory = folderPaths;
                console.log(folderPaths);
                printFolderName(folderPaths, 'source-folder-value');
            }
        });

    });
    
    $('#destination-folder').on('click', (event) => {
        console.log("***Destination Directory***");
        dialog.showOpenDialog({
            title: "Select the Destination Folder",
            properties: ["openDirectory"]
        }, (folderPaths) => {
            if(folderPaths === undefined) {
                console.log("***No Destination Folder Selected***");
                return;
            } else {
                destinationDirectory = folderPaths;
                console.log(folderPaths);
                printFolderName(folderPaths, 'destination-folder-value');
            }
        });

    });


    $('#compare-button').on('click', (event) => {
        if (sourceDirectory && destinationDirectory) {
            initializeComparison(sourceDirectory[0], destinationDirectory[0]);
        } else {
            alert("Please select both the directories.")
        }
    });

});

function printFolderName(folderName, targetElement) {
    targetElement && $('#'+targetElement).text(folderName);
}

function initializeComparison(src, dest) {
    compare.initializeComparison(src, dest, function(result){
        $('#result').text(result.reportContent);
        $('#summary').find('#summaryFilesMatched').find('span').text(result.filesMatched.length);
        $('#summary').find('#summaryFilesAdded').find('span').text(result.filesAddedDestination.length);
        $('#summary').find('#summaryFilesRemoved').find('span').text(result.filesRemovedSource.length);
        
        for(i = 0; i < result.filesMatched.length; i++) {
            $('#details').find('#detailsFilesMatched').append('<li>' + result.filesMatched[i] + '</li>');
        }
        
        for(i = 0; i < result.filesAddedDestination.length; i++) {
            $('#details').find('#detailsFilesAdded').append('<li>' + result.filesAddedDestination[i] + '</li>');
        }

        for(i = 0; i < result.filesRemovedSource.length; i++) {
            $('#details').find('#detailsFilesRemoved').append('<li>' + result.filesRemovedSource[i] + '</li>');
        }

        $('#difference').find('#consolidatedDifference').text(result.diffContent);

    }.bind(this));
    
}
