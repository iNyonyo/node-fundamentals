const fs = require('fs/promises');
const path = require('path');

const tmpDir = path.join(__dirname, 'tmp');
const jsonPath = path.join(tmpDir, 'info.json');
const logPath = path.join(tmpDir, 'activity.log');

async function main() {
    // Create directory
    await fs.mkdir(tmpDir, { recursive: true });

    // Write JSON
    const user = {
        name: "Mawunyo",
        role: "Developer",
        language: "JavaScript"
    };

    await fs.writeFile(jsonPath, JSON.stringify(user, null, 2));

    // Read and parse JSON
    const data = await fs.readFile(jsonPath, 'utf8');

    const parsedData = JSON.parse(data);

    console.log(parsedData);

    // Append to log
    await fs.appendFile(logPath, 'JSON file created successfully\n');

    // List directory and file sizes
    const files = await fs.readdir(tmpDir);

    for (const file of files) {
        // construct full path
        const filePath = path.join(tmpDir, file);

        // Get file stats
        const stats = await fs.stat(filePath);

        // Display filename and size
        console.log(`Filename: ${file}\n`);
        console.log(`File size: ${stats.size}\n`);
    }

    // Renaming files
    const newPath = path.join(tmpDir, 'user-data.json');

    await fs.rename(jsonPath, newPath);

    console.log('Renamed successfully');

    // Missing file
    const missingPath = path.join(tmpDir, 'missingFile.txt');

    try{
        await fs.readFile(missingPath, 'utf8');
    } catch (error) {
        if (error.code === 'ENOENT') {
            console.log("File does not exist");
        } else {
            throw error;
        }
    }
}

async function deleteDirectory() {
    await fs.rm(tmpDir, { recursive: true, force: true });
    console.log("Directory deleted successfully");
}

main();

//deleteDirectory();

// Predicted
/* 
1. Create a tmp directory.
2. Write user data to a JSON file.
3. Read and parse the JSON file.
4. Append a message to a log files.
5. List files and their sizes.
6. Rename a file.
7. Reading a missing file.
8. Delete the directory.
*/

// Actual
/*
{ name: 'Mawunyo', role: 'Developer', language: 'JavaScript' }
Filename: activity.log

File size: 31

Filename: info.json

File size: 74

Renamed successfully
File does not exist
*/

// Why
/* 
I used fs/promises to perform file operations asynchronously without blocking the execution of other code. 
I used JSON.stringify() and JSON.parse() to convert between JavaScript objects and JSON data. 
I also used fs.readdir() and fs.stat() to inspect directory contents and file sizes. 
The ENOENT error handling helped me deal with missing files without stopping the program. 
Finally, I used path.join() and __dirname to ensure that file paths work correctly regardless of the directory from which I run the script.
*/