import fs from "fs";
import path from "path";
import { ipcRenderer } from "electron";

const FILE_OPTIONS = {
    encoding: "utf-8"
};
const MKDIR_OPTIONS = {
    recursive: true
};

// Attempts to write the "data" to a file, creating it if necessary.
// If the "force" flag is set to true, this will create any 
// directories needed for the full filepath.
// If the write fails for any reason, it will send an event message.
function write(filePath, data, force = false) {
    let directory = path.dirname(filePath);
    if (fs.existsSync(directory)) {
        try {
            fs.writeFileSync(filePath, data, FILE_OPTIONS);
            return true;
        } catch (e) {
            ipcRenderer.send("fileWriteError", filePath);
        }
    } else if (force) {
        fs.mkdirSync(directory, MKDIR_OPTIONS);
        return this.write(filePath, data);
    }
}

// Attempts to read a file and return the data as a string.
// Will verify that the path exists and that the path is a
// file before reading; If either of these fail, it will 
// return nothing.
function read(filePath) {
    if (fs.existsSync(filePath)) {
        let isFile = fs.statSync(filePath).isFile;
        if (isFile) {
            let data = fs.readFileSync(filePath, FILE_OPTIONS);
            return data;
        }
    }
    return null;
}

// Attempts to rename the "from" path to the "to" path.
// If the "from" path does not exist, it will return false.
// If it fails, it will send an error event message.
// If it completes the rename, it will return true.
function rename(from, to) {
    if (fs.existsSync(from)) {
        try {
            fs.renameSync(from, to);
            return true;
        } catch (e) {
            ipcRenderer.send("folderRenameError", { from, to });
        }
    }
    return false;
}

export { read, write, rename };