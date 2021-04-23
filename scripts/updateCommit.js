const fs = require("fs");
const cp = require("child_process");

const readResource = async (fileName) => {
  const promise = new Promise((resolve, reject) => {
    fs.readFile(fileName, (err, data) => {
      if (err) {
        console.log(err);
        reject(new Error("file not readable"));
      } else {
        resolve(JSON.parse(data));
      }
    });
  });
  return promise;
};

const writeResource = async (fileName, data) => {
  const promise = new Promise((resolve, reject) => {
    fs.writeFile(fileName, data, (err) => {
      if (err) reject(new Error(err));
      resolve({ success: true });
    });
  });
  return promise;
};

const execute = async (command) => {
  const promise = new Promise((resolve, reject) => {
    cp.exec(command, (err, stdout) => {
      if (err) {
        console.log(err);
        reject(new Error("command not executable"));
      } else {
        resolve(stdout.trim());
      }
    });
  });
  return promise;
};

const updateBuildInfo = async () => {
  const pkg = await readResource("package.json");
  const commitHash = await execute("git rev-parse --short HEAD");
  pkg.commitHash = commitHash;
  pkg.buildDate = new Date().toISOString();
  await writeResource("package.json", JSON.stringify(pkg, null, 3));
};

updateBuildInfo();
