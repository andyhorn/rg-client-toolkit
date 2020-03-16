<template>
  <div>
    <b-row>
      <b-col>
        <b-button variant="primary" @click="scan">Scan</b-button>
      </b-col>
    </b-row>
    <b-row v-bind:class="this.display ? 'visible' : 'hidden'">
      <b-col cols="12" class="my-3">
        <h5>License File</h5>
        <b-list-group id="file-list" ref="file"></b-list-group>
      </b-col>
      <b-col cols="12" class="my-3">
        <h5>License Directory</h5>
        <b-list-group id="folder-list" ref="folder"></b-list-group>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import ScanResult from "./ScanResult.vue";
import LicenseFile from "./LicenseFile.vue";
import ScanResultWithButton from "./ScanResultWithButton.vue";

import Vue from "vue";
import path from "path";
import fs from "fs";
import log from "../../utils/log";

const SUCCESS = "text-success";
const FAILURE = "text-danger";
const SUCCESS_ICON = "check";
const FAILURE_ICON = "alert-triangle";

// Attempts to pull the filename from a full path using the "fs" utility.
// Will check that the path exists and that it is a file; otherwise returns
// null.
function getFileName(fullPath) {
  log.debug(`[LicenseScanner.vue] finding filename for path "${fullPath}"`);
  if (!fs.existsSync(fullPath)) {
    log.debug("[LicenseScanner.vue] path does not exist, returning null");
    return null;
  }

  if (fs.statSync(fullPath).isFile()) {
    let filename = path.basename(fullPath);
    log.debug(
      `[LicenseScanner.vue] path is a file, returning filename "${filename}"`
    );
    return filename;
  } else {
    log.debug("[LicenseScanner.vue] path is a directory, returning null");
    return null;
  }
}

export default {
  name: "LicenseScanner",
  data() {
    return {
      // flag for controlling the display of the results section
      display: false,
      // the full filepath for the "Red Giant" directory
      redGiantDirPath:
        process.platform == "win32"
          ? path.join("C:", "ProgramData", "Red Giant")
          : path.join(path.sep, "Users", "Shared", "Red Giant"),
      // holds a list of subdirectories and files of the "Red Giant" directory
      redGiantDirContents: [],
      // the full filepath of the "licenses" directory
      licenseDirPath: null,
      // holds a list of license files in the "licenses" directory
      licenseList: []
    };
  },
  mounted() {
    log.debug("[LicenseScanner.vue] page mounted");

    // format the "licenses" path
    this.licenseDirPath = path.join(this.redGiantDirPath, "licenses");

    // if the Red Giant directory exists, read its contents
    if (fs.existsSync(this.redGiantDirPath)) {
      this.redGiantDirContents = fs.readdirSync(this.redGiantDirPath);
    }
  },
  methods: {
    findLicenseFiles() {
      // console.log(this.licenseDirPath);
      if (fs.existsSync(this.licenseDirPath)) {
        let contents = fs.readdirSync(this.licenseDirPath);
        // console.log(contents);
        this.licenseList = contents.filter(
          i => i.endsWith(".lic") || i.endsWith(".config")
        );
        // console.log(this.licenseList);
      }
    },
    // send the license data to be used in the port scan utility
    testLicense(data) {
      log.debug(
        "[LicenseScanner.vue] license test button detected, emitting to parent"
      );
      this.$emit("testLicense", data);
    },
    // remove any existing result information
    clearResults() {
      log.verbose("[LicenseScanner] clearing any current result data");
      this.display = false;
      this.$refs.file.innerHTML = "";
      this.$refs.folder.innerHTML = "";
    },
    // perform a scan for Red Giant license files
    scan() {
      log.info("[LicenseScanner] beginning scan...");

      // clear any existing results
      this.clearResults();

      // scan for license files (ending in .lic or .config)
      this.findLicenseFiles();

      // set display to true
      log.debug("[LicenseScanner.vue] setting display property to true");
      this.display = true;

      // check that the licenses directory exists, display an error message
      // if it cannot be found
      if (fs.existsSync(this.licenseDirPath)) {
        log.info("[LicenseScanner] default directory found");
        let options = {
          ref: "folder",
          content: "License directory found!",
          color: SUCCESS,
          icon: SUCCESS_ICON
        };
        this.addListItem(options);

        // check for lowercase "l" or capital "L" in the licenses directory
        if (this.isLowerCase()) {
          log.info("[LicenseScanner] directory using lowercase");
          let options = {
            ref: "folder",
            content: "Uses lowercase",
            color: SUCCESS,
            icon: SUCCESS_ICON
          };
          this.addListItem(options);
        } else {
          // if a capital "L" was used, prepare to rename to a lowercase "l"
          log.info("[LicenseScanner] directory using capital 'L'");
          let directoryFrom = path.join(this.redGiantDirPath, "Licenses");
          let directoryTo = path.join(this.redGiantDirPath, "licenses");

          let options = {
            ref: "folder",
            content: "Folder uses capital 'L', please change to lowercase",
            color: FAILURE,
            icon: FAILURE_ICON,
            directoryFrom,
            directoryTo
          };

          this.addListItem(options);
        }

        // if license files were found, read and display them to the user
        if (this.licenseList.length) {
          log.info("[LicenseScanner] files found: " + this.licenseList.length);
          log.verbose("[LicenseScanner] displaying license files");
          // display each of the license files
          this.displayLicenses(this.licenseList);
        } else {
          log.info("[LicenseScanner] no license files detected");
        }
      } else {
        log.info("[LicenseScanner] licenses directory not found");
        let options = {
          ref: "folder",
          content: "License directory not found",
          color: FAILURE,
          icon: FAILURE_ICON
        };
        this.addListItem(options);

        // if the licenses directory wasn't found, check for common misspellings
        if (this.checkSpelling()) {
          log.info("[LicenseScanner] possible misspelled folder found");
          let options = {
            ref: "folder",
            content: "License folder misspelled, please change to 'licenses'",
            color: FAILURE,
            icon: FAILURE_ICON
          };
          this.addListItem(options);
        }
      }
    },
    addListItem(options) {
      let component;
      if (options.renameFrom && options.renameTo) {
        component = Vue.extend(ScanResultWithButton);
      } else {
        component = Vue.extend(ScanResult);
      }

      let propsData = {
        text: options.content,
        color: options.color,
        icon: options.icon
      };

      if (options.renameFrom) {
        propsData.from = options.renameFrom;
      }
      if (options.renameTo) {
        propsData.to = options.renameTo;
      }

      let instance = new component({
        propsData
      });

      instance.$mount();

      if (options.on) {
        instance.on(options.on.name, options.on.method);
      }

      this.$refs[options.ref].appendChild(instance.$el);
    },
    displayLicenseContents(lic) {
      log.verbose("[LicenseScanner] displaying license contents...");
      log.debug("[LicenseScanner.vue] license data:");
      log.debug(lic);

      let component = Vue.extend(LicenseFile);
      let instance = new component({
        propsData: {
          license: lic
        }
      });
      log.debug("[LicenseScanner.vue] component and instance created");

      instance.$on("rescan", this.scan);
      instance.$on("testLicense", this.testLicense);
      log.debug(
        "[LicenseScanner.vue] rescan and testLicense event listeners addded"
      );

      instance.$mount();
      log.debug("[LicenseScanner.vue] instance mounted");

      this.$refs.file.appendChild(instance.$el);
      log.verbose("[LicenseScanner] license contents added");
    },
    // Loops through a list of license files and sends each one to the DOM
    displayLicenses(licenseList) {
      log.debug("[LicenseScanner.vue] displaying licenses from list:");
      log.debug(licenseList);
      let options = {
        ref: "file"
      };

      if (licenseList.length == 0) {
        log.verbose("[LicenseScanner] no licenses to display");
        log.debug(
          "[LicenseScanner.vue] adding list item to 'file' list with failure status"
        );
        options.content = "No license file found";
        options.color = FAILURE;
        options.icon = FAILURE_ICON;
      } else {
        if (licenseList.length == 1) {
          log.verbose("[LicenseScanner] only one license found - no conflicts");
          log.debug(
            "[LicenseScanner.vue] adding list item to 'file' list with success status"
          );
          options.content = "Single license file found - no conflicts";
          options.color = SUCCESS;
          options.icon = SUCCESS_ICON;
        } else {
          log.verbose(
            "[LicenseScanner] multiple licenses found - there may be conflicts"
          );
          log.debug(
            "[LicenseScanner.vue] adding list item to 'file' list with failure status"
          );
          options.content = "Multiple license files found - conflicts likely";
          options.color = FAILURE;
          options.icon = FAILURE_ICON;
        }

        log.debug(
          "[LicenseScanner.vue] looping through license list and displaying contents"
        );
        for (let license of this.licenseList) {
          log.debug(`[LicenseScanner.vue] reading license file: ${license}`);
          let lic = this.readLicenseFile(
            path.join(this.licenseDirPath, license)
          );
          log.debug("[LicenseScanner.vue] license data:");
          log.debug(lic);
          log.debug("[LicenseScanner.vue] displaying license contents...");
          this.displayLicenseContents(lic);
        }
      }

      this.addListItem(options);
    },
    // Reads a license file and parses the data into a "license" object
    readLicenseFile(filePath) {
      log.verbose(`[LicenseScanner] reading license file: ${filePath}`);
      let fileContents = fs.readFileSync(filePath, {
        encoding: "utf-8"
      });
      log.debug("[LicenseScanner.vue] license data:");
      log.debug(fileContents);

      let license = {};
      let values = fileContents.split(" ");

      license.fullPath = filePath;
      license.name = getFileName(filePath);
      license.host = values[1].trim();
      license.port = values[3].trim();

      log.debug("[LicenseScanner.vue] license object data:");
      log.debug(license);

      return license;
    },
    // Checks for misspelled "licenses" directory using a regular expression
    checkSpelling() {
      log.verbose("[LicenseScanner] checking for common spelling mistakes...");

      let regex = new RegExp("[L|l]i[c|s]en[c|s]es?$");
      log.debug(`[LicenseScanner.vue] regular expression object:`);
      log.debug(regex);

      let folder = this.redGiantDirContents.filter(d => regex.test(d));
      log.debug("[LicenseScanner.vue] alternate spelling folders found:");
      log.debug(folder);

      return folder.length > 0 ? folder[0] : false;
    },
    isLowerCase() {
      log.verbose(
        "[LicenseScanner] checking if licenses directory is all lowercase..."
      );

      let lowercase = this.redGiantDirContents.some(d => d === "licenses");
      return lowercase;
    },
    defaultDirExists() {
      let regex = new RegExp("[L|l]icenses");
      this.redGiantDirContents = fs.readdirSync(this.redGiantDirPath);
      let contents = this.redGiantDirContents.filter(i => regex.test(i));
      if (contents.length) {
        this.licenseDirPath = path.join(this.redGiantDirPath, contents[0]);
        return true;
      } else {
        return false;
      }
    }
  }
};
</script>

<style scoped>
.visible {
  visibility: visible;
}
.hidden {
  visibility: hidden;
}
</style>
