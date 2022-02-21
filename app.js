/**
    ### Section 1
    Using the send log data in the data.js file console log only the objects that have all of the following: <br>
    * Have a count greater than 3 [X]
    * Reason equals build error or send failure [X]
    * If email name and count are the same value only return the send failure object [X]

    ### Section 2
    * Copy the file structure and content of the prod directory into a new folder called 'backup' at the root level [X]
    * Copy the content of dev_cta.txt into prod_cta.txt [X]

    ### Section 3
    Using the template data object in the data.js file as a data source: <br>
    * Copy the development environment content into the transactional.html file in the local development directory [X]
    * Copy the production environment content into the transactional.html file in the local production directory [X]
    * 
    
    COMMENTS:
    - Running this program could be easier with fs-extra
    - When copying dev_cta.txt into prod_cta.txt I assumed "dev/components/cta.txt" (following the naming of the given folder)
*/



/**
 * 
 * Start Section 1
 * 
 */
 const data = require('./data')
 const fs = require('fs')
 const path = require('path')
 //const fs = require('fs-extra') // Extend fs -> https://www.npmjs.com/package/fs-extra is this case, we wouldn't need fs / path modules, but we need to install fs-extra
 
 let log_collection = []; // Init array for deduplication later
 
 // Loop each element from send_log_data in data.js and just keep valid objects
 data.send_log_data.forEach(function (item) {
 
     // Basic filter (count and reason)
     if (
         (item.count > 3) && // Have a count greater than 3
         (item.reason === 'buildError' || item.reason === 'sendFailure') // Reason equals build error or send failure
     ) {
 
         // Create an index using name and count
         let item_index = item.emailName + item.count;
 
         // Check if key exists already in collection
         if (item_index in log_collection) {
 
             // Ensure you just keep sendFailure, overwrite if needed
             if (item.reason === 'sendFailure') {
                 log_collection[item_index] = item;
             }
 
         }
 
         // For new items, store in collection directly
         else {
             log_collection[item_index] = item; // Insert into array, using key to keep unique objects per specification
         }
 
     }
 });
 
 // Display objects requested
 for (let item in log_collection) {
     console.log(log_collection[item]);
 }
 
 
 
 
 /**
  * 
  * Start Section 2
  * 
  */
 
 // Copy the file structure and content of the prod directory into a new folder called 'backup' at the root level
 // Using native solution from https://stackoverflow.com/questions/13786160/copy-folder-recursively-in-node-js code by Simon Zyx
 // ! Running this script more than once will throw an error (destination folder already exists)
 var copyRecursiveSync = function (src, dest) {
     var exists = fs.existsSync(src);
     var stats = exists && fs.statSync(src);
     var isDirectory = exists && stats.isDirectory();
     if (isDirectory) {
         fs.mkdirSync(dest);
         fs.readdirSync(src).forEach(function (childItemName) {
             copyRecursiveSync(path.join(src, childItemName),
                 path.join(dest, childItemName));
         });
     } else {
         fs.copyFileSync(src, dest);
     }
 };
 
 // Native fs
 fs.rmSync('backup', { recursive: true, force: true }); // Remove "backup" folder first
 if (!fs.existsSync('backup')) {copyRecursiveSync('prod', 'backup');} // If backup is not present, copy recursively
 
 
 // Using fs-extra
 // fs.copy('prod', 'backup') // Pretty basic as we already are in root (also will save lines 82 to 103 and the need to call fs + path modules)
 
 // Copy the content of dev_cta.txt into prod_cta.txt
 fs.copyFileSync('./dev/components/cta.txt', './prod/components/cta.txt'); // Everything at dev is lost (still backup)
 
 
 
 
 
 /**
  * 
  * Start Section 3
  * 
  */
 // Native fs is enough to perform the content insert https://www.codegrepper.com/code-examples/typescript/copy+text+from+file+to+another+file+in+javascript+with+fs
 fs.writeFileSync('./dev/templates/transactional.html', data.template_data.dev_env[0].content); // Copy the development environment content into the transactional.html file in the local development directory
 fs.writeFileSync('./prod/templates/transactional.html', data.template_data.prod_env[0].content); // Copy the production environment content into the transactional.html file in the local production directory