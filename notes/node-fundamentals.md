# Node Fundamentals – Reflection Questions

## 1. V8 and libuv
**Question:** What are V8 and libuv, and how does one thread serve many users?

**Answer:**

V8 is an engine that runs pure javascript code. Libuv acts as a bridge between the operating system and javascript code by running operations like opening a file etc. 
Through the event loop and asychronous functions, one thread is able to serve multiple users.

---

## 2. Order of Output in Exercise 02
**Question:** Explain the order of output in exercise 02.

**Answer:**

1. All sychronous code runs first hence 1, 9 then 11.
2. Microtasks run next hence 5, 4, then 10.
3. Then the timers (2: timeout)
4. Then immediate (3: immediate) because it is outside a callback.
5. The readFile callback 
6. The inside callbacks (8, then 7) because the correct order is immediate then timer.

2 and 3 at the top level depends on the process startup timing however inside an I/O callback 8 always runs before 7.
If process.nextTick() keeps scheduling itself forever, it starves the event loop and freezes your application.

---

## 3. Node.js Modules
**Question:** Why does a module run only once, and why does `exports = {}` not work?

**Answer:**

A module runs only once because the runtime caches its evaluated exports after the first import. 
exports = {} does not work because it only references module.exports. 

---

## 4. CommonJS vs ES Modules
**Question:** Explain four differences between CommonJS and ES modules.

1. Common Js uses require and module.exports while es modules use import and export default. This is because common Js was built originally for node.js while es modules were introduced in ES6.

2. Common JS loads synchronously while es modules load asychronously. This is because in common js, node.js pauses execution to read and evealuate file from the loacl disk before moving to the next line while in es modules the javascript engine parses the module graph, fetches all imported files over the network or disk without blocking the main thread, and evaluates them in dependency order.

3. Common JS exports shallow copies of values while es modules export live, read-only bindings. This is because, in common js, once a value is exported via module.exports, changing that primitive variable inside the original module later will not update the value in the file that imported it. In es modules however, An import acts like a direct window into the variable inside the source module.

4. Common Js is dynamic while es modules are static. This is because require() is just a regular function, you can call it conditionally inside an if block or compute the file path at runtime. For es modules, import and export statements must sit at the top level of the file and cannot be wrapped in conditionals. 

---

## 5. Promise Methods
**Question:** When would you use `Promise.all()`, `Promise.allSettled()` and `Promise.race()`?

**Answer:**

### Promise.all()
Use it when you are running multiple async tasks in parallel and need every single one to succeed before moving forward. 

### Promise.allSettled()
Use it when you have independent tasks and want to know the outcome of each one, even if some fail.

### Promise.race()
Use it when you only care about the very first promise to finish.

---

## 6. Error Handling in Express
**Question:** Why did the root route in your old `app.js` fail when it called `next(err)`?

**Answer:**

It failed because next was not declared in the route handler parameters.

---

## Exercise 6 explanation

For express@^5.1.0, ^ (caret) allows minor and patch updates (>=5.1.0 <6.0.0), while ~ (tilde) allows only patch updates (>=5.1.0 <5.2.0). 
npm install updates your lockfile for development, whereas npm ci performs a strict, clean install from package-lock.json. 
Running npm init (or npm install) while my terminal's current working directory was inside src/ instead of the project root created package.json and node_modules/ inside src/.

**Problems Caused**
1. It breaks root-level commands.
2. It will cause deployment and CI/CD failures.
3. It will also cause config and module resolution friction.