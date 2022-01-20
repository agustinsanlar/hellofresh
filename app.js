const data = require('./data');
const fs = require('fs');
const path = require('path');



//** SECTION 1 **// 

/**
 * We want to log the object ONLY on the condition that: 
 * COUNT is greater than 3, AND 
 * REASON is 'buildError' OR 'sendFailure', AND
 * for multiple objects with the same COUNT and EMAILNAME, the REASON is 'sendFailure'.
 * @param {Array} logObjects
 */
 const checkRequirementsForLogging = (logObjects) => {
     logObjects.forEach(object => {
        if (object.count > 3 && checkLogObjectReason(object.reason)) {
            if (countAndEmailAlreadyExists(logObjects, object)) {
                (object.reason === 'sendFailure') ? console.log(object) : '';
            } else {
                console.log(object);
            }
        }
     });
}

/**
 * Should return true iff reason is either buildError OR sendFailure
 * @param {String} reason 
 */
 const checkLogObjectReason = (reason) => {
    return (reason === 'buildError' || reason === 'sendFailure')
}

/**
 * Checks if inputted object's count & email already exists in another element of array logObjects
 * @param {Array} logObjects
 * @param {Object} object
 */
 const countAndEmailAlreadyExists = (logObjects, object) => {
    return logObjects.some((element) => {
        return (element.emailName === object.emailName && element.count === object.count);
    });
}

// Now we must call checkRequirementsForLogging on the data:
const sendLogData = data.send_log_data;
checkRequirementsForLogging(sendLogData);



//** SECTION 2 **//

/**
 * Given a target folder name and a new folder to create, recursively copy over all structure and contents 
 * from target folder to the new folder.
 * @param {String} targetFolderName 
 * @param {String} newFolderName 
 */
 const createFolderShallowCopy = (targetFolderName, newFolderName) => {
    const ROOT = "digital_dev_challenge";

    const newPath = path.join(ROOT, newFolderName); // NEW represents the copies we are making
    const targetPath = path.join(ROOT, targetFolderName); // TARGET represents what we are copying from.

    checkDirectoryExists(newPath);

    try {
        performCopy(targetPath, newPath);
    } catch (error) {
        console.log(error);
        return;
    }
}

/**
 * Given a path, check if that path exists. If it doesn't, make the directory.
 * @param {String} path 
 */
 const checkDirectoryExists = (path) => {
    if (!fs.existsSync(path)) {
        fs.mkdirSync(path);
    }
}

/**
 * The recursive call to copy over all of the folders, and contents of their files, respectively & structuredly.
 * @param {String} targetPath 
 * @param {String} newPath
 */
 const performCopy = (targetPath, newPath) => {
    fs.readdirSync(targetPath).forEach(file => {
        var currentNewPath = path.join(newPath, file);
        var currentTargetPath = path.join(targetPath, file);

        if (file.includes('.')) {
            // If file (with extension, i.e '.txt', '.html', etc.), copy over contents.
            copyFileContents(currentTargetPath, currentNewPath);
        } else {
            // In case of sub-folders, recursively iterate over the sub-folder contents (by calling performCopy).
            checkDirectoryExists(currentNewPath);
            performCopy(currentTargetPath, currentNewPath);
        }
    });

}

/**
 * Read contents of targetPath, and write it to the newPath - thus copying targeted contents into new.
 * @param {String} targetPath 
 * @param {String} newPath 
 */
 const copyFileContents = (targetPath, newPath) => {
    var contentsToCopyOver = fs.readFileSync(targetPath);
    fs.writeFileSync(newPath, contentsToCopyOver)
}

// Create a copy of 'prod' into the new folder 'backup'
createFolderShallowCopy('prod', 'backup');


// Copy over contents of dev_cta.txt into prod_cta.txt
const targetCTAPath = 'digital_dev_challenge/dev/components/cta.txt';
const newCTAPath = 'digital_dev_challenge/prod/components/cta.txt'

copyFileContents(targetCTAPath, newCTAPath);



//** SECTION 3 **//

const devEnvData = data.template_data.dev_env;
const prodEnvData = data.template_data.prod_env;

/**
 * Copy over the value(s) pertaining to the desiredField key from the data objects into the targetPath file.
 * @param {String} path 
 * @param {Array} data 
 * @param {String} desiredField
 */
 const populateFileFromData = (path, data, desiredField) => {
    data.forEach(element => {
        const desiredValues = extractDesiredValueFromObject(element, desiredField, []);
        fs.writeFileSync(path, formatDesiredValuesList(desiredValues));
    });
}

/**
 * 
 * @param {Object} object 
 * @param {String} desiredField
 */
 const extractDesiredValueFromObject = (object, desiredField, desiredValue) => {
     try {
        for (const [field, value] of Object.entries(object)) {
            if (field === desiredField) {
                desiredValue.push(value);
            } else if (typeof(value) === 'object') {
                extractDesiredValueFromObject(value, desiredField, desiredValue);
            }
        }
        return desiredValue;
     } catch (error) {
         console.log(error);
         return;
     }
}

/**
 * Takes in a list of values, and returns a STRING where each value exists on a separate line by 
 * replacing commas with line breaks.
 * @param {*} listOfValues 
 */
const formatDesiredValuesList = (listOfValues) => {
    return listOfValues.toString().replace(/,/g, '\n');
}

populateFileFromData('digital_dev_challenge/dev/templates/transactional.html', devEnvData, 'content');
populateFileFromData('digital_dev_challenge/prod/templates/transactional.html', prodEnvData, 'content');