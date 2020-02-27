import fs from "fs";
import path from "path";
import { ipcRenderer } from "electron";

const FILE_OPTIONS = {
    encoding: "utf-8"
};
const MKDIR_OPTIONS = {
    recursive: true
};

// class File {
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
// }

// export default File;
export { read, write, rename };