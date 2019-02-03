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
        $('.alert').addClass('d-none');
        dialog.showOpenDialog({
            title: "Select the Source Folder",
            properties: ["openDirectory"]
        }, (folderPaths) => {
            if (folderPaths === undefined) {
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
        $('.alert').addClass('d-none');
        dialog.showOpenDialog({
            title: "Select the Destination Folder",
            properties: ["openDirectory"]
        }, (folderPaths) => {
            if (folderPaths === undefined) {
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
            reset();
            $('.loadingIndicator').removeClass('d-none');
            initializeComparison(sourceDirectory[0], destinationDirectory[0]);
        } else {
            $('.alert').removeClass('d-none');
            $('.alert').find('#alertText').text("Please select both the directories.");
        }
    });

});

function printFolderName(folderName, targetElement) {
    targetElement && $('#' + targetElement).text(folderName);
}

function initializeComparison(src, dest) {
    compare.initializeComparison(src, dest, function (result) {
        console.log("Logging Control Back");
        $('#summary').removeClass('d-none');
        $('.loadingIndicator').addClass('d-none');
        $('#summary').find('#summaryFilesMatched').find('span').text(result.filesMatched.length);
        $('#summary').find('#summaryFilesAdded').find('span').text(result.filesAddedDestination.length);
        $('#summary').find('#summaryFilesRemoved').find('span').text(result.filesRemovedSource.length);

        for (i = 0; i < result.filesMatched.length; i++) {
            $('#details').removeClass('d-none');
            $('#details').find('#detailsFilesMatched').append('<li>' + result.filesMatched[i] + '</li>');
        }

        for (i = 0; i < result.filesAddedDestination.length; i++) {
            $('#details').removeClass('d-none');
            $('#details').find('#detailsFilesAdded').append('<li>' + result.filesAddedDestination[i] + '</li>');
        }

        for (i = 0; i < result.filesRemovedSource.length; i++) {
            $('#details').removeClass('d-none');
            $('#details').find('#detailsFilesRemoved').append('<li>' + result.filesRemovedSource[i] + '</li>');
        }

        $('#difference').removeClass('d-none');
        $('#difference').find('#consolidatedDifference').text(result.diffContent);
        console.log("Logging Done");
    }.bind(this));

}

function reset() {
    $('#details').addClass('d-none');
    $('#difference').addClass('d-none');
    $('.alert').addClass('d-none');

    $('#summary').find('#summaryFilesMatched').find('span').text(0);
    $('#summary').find('#summaryFilesAdded').find('span').text(0);
    $('#summary').find('#summaryFilesRemoved').find('span').text(0);
}
