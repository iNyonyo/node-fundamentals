console.log(process.version);
// Predicted: Current node version
// Actual: v24.13.0
// Why: Because node is the process and we are checking its version

console.log(process.versions.v8);
//Presdicted: A v8 version
//Actual: 13.6.233.17-node.37
//Why: That is the node v8 version

console.log(process.platform);
//Presdicted: The platform node is running on
//Actual: win32
//Why: That is the os system node is running on

console.log(process.pid);
//Presdicted: Node's pid
//Actual: 13984
//Why: That is the node pid

console.log(__filename);
//Presdicted: My file path
//Actual: C:\Users\Akpalu\OneDrive\Desktop\node-fundamentals\day1\runtime.js
//Why: That is my file path

console.log(__dirname);
//Presdicted: My directory path
//Actual: C:\Users\Akpalu\OneDrive\Desktop\node-fundamentals\day1
//Why: That is my directory path

console.log(typeof window);
/* The result is undefined because window is a 
browser feature and not a node feature. */