var readdirp = require('readdirp');
var _ = require('lodash');
var fs = require('fs');
var jsdiff = require('diff');
var writeFile = require('write');

var aFileList, aFinalList, aAddedFileList, aRemovedFileList, aSourceFileList, aTargetFileList, aDiffContent;
var sourceSettings, targetSettings;
var report;

var fnResetContent = function () {
    aFileList = [];
    aFinalList = [];
    aAddedFileList = [];
    aRemovedFileList = [];
    aSourceFileList = [];
    aTargetFileList = [];
    aDiffContent = [];
}

var fnInitialize = function (srcDir, tarDir, fnCallBack) {

    fnResetContent();

    sourceSettings = {
        root: srcDir,
        entryType: 'files',
        filter: '*.js'
    };

    targetSettings = {
        root: tarDir,
        entryType: 'files',
        filter: '*.js'
    };

    fnAsyncDirectoryRead(sourceSettings).then(function (result) {
        aSourceFileList = result;
        fnAsyncDirectoryRead(targetSettings).then(function (result) {
            aTargetFileList = result;

            fnCompareFileList(aSourceFileList, aTargetFileList);
            fnCompareFileContent(srcDir, tarDir);
            report = fnWriteReport();
            fnCallBack && fnCallBack(report);
        });
    });

}

var fnCompareFileList = function (srcFileList, destFileList) {
    if (!srcFileList || !destFileList)
        return;

    srcFileList.forEach((srcElement) =>
        destFileList.forEach((destElement) => {
            if (srcElement == destElement) {
                aFinalList.push(srcElement);
            }
        }));

    console.log(`\nFinal Matching List:${aFinalList.length}`);
    console.log(aFinalList);

    aAddedFileList = _.difference(destFileList, srcFileList);
    console.log(`\nAdded in Destination:${aAddedFileList.length}`);
    console.log(aAddedFileList);

    aRemovedFileList = _.difference(srcFileList, destFileList);
    console.log(`\nDeleted from Source:${aRemovedFileList.length}`);
    console.log(aRemovedFileList);
}

var fnCompareFileContent = function (srcDir, tarDir) {
    console.log(`\nComparing File Content for Files available in both directories...`);

    aFinalList.forEach((aFinalListItem) => {
        var srcFileContent = fs.readFileSync(srcDir + '/' + aFinalListItem, "utf8");
        var destFileContent = fs.readFileSync(tarDir + '/' + aFinalListItem, "utf8");

        var diff = jsdiff.structuredPatch(srcDir + '/' + aFinalListItem, tarDir + '/' + aFinalListItem,
            srcFileContent, destFileContent,
            srcDir + '/' + aFinalListItem, tarDir + '/' + aFinalListItem);
        if (diff.hunks[0] && diff.hunks[0].lines) {
            aDiffContent.push(diff);
        }
    });
}

var fnAsyncDirectoryRead = function (settings) {
    return new Promise(function (resolve, reject) {
        readdirp(settings)
            .on('data', function (entry) {
                aFileList.push(entry.path);
            })
            .on('warn', function (warn) {
                console.log("Warn: ", warn);
            })
            .on('error', function (err) {
                console.log("Error: ", err);
                reject(err);
            })
            .on('end', function () {
                resolve(aFileList);
                aFileList = [];
            });
    });
}

var fnWriteReport = function () {
    var sReportContent = [];
    var sDiffContent = [];

    console.log(`\nFinal Matching List:${aFinalList.length}`);
    console.log(`\nAdded in Destination:${aAddedFileList.length}`);
    console.log(`\nDeleted from Source:${aRemovedFileList.length}`);

    sReportContent.push(`\nFinal Matching List:${aFinalList.length}`);
    sReportContent.push(`\nAdded in Destination:${aAddedFileList.length}`);
    sReportContent.push(`\nDeleted from Source:${aRemovedFileList.length}`);

    sReportContent.push(`\n\nFinal Matching List:\n`);
    aFinalList.forEach((finalListItem) => {
        sReportContent.push(finalListItem + '\n');
    });

    sReportContent.push(`\n\nAdded in Destination:\n`);
    aAddedFileList.forEach((addedListItem) => {
        sReportContent.push(addedListItem + '\n');
    });

    sReportContent.push(`\n\nDeleted from Source:\n`);
    aRemovedFileList.forEach((removedListItem) => {
        sReportContent.push(removedListItem + '\n');
    });

    aDiffContent.forEach((diffItem) => {
        sDiffContent.push(`\n\nDifference between ${diffItem.oldHeader} and ${diffItem.newHeader} \n`);
        sDiffContent.push(diffItem.hunks[0].lines.join("\n"));
    });

    console.log(`\nCreating Patch File...`);
    writeFile('download/diff.patch', sDiffContent.join("\n"), function (err) {
        if (err) console.log(err);
    });

    return {
        reportContent: sReportContent,
        diffContent: sDiffContent,
        filesMatched: aFinalList.sort(),
        filesAddedDestination: aAddedFileList.sort(),
        filesRemovedSource: aRemovedFileList.sort()

    };
}

exports.initializeComparison = fnInitialize;