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
      display: false,
      fileList: null,
      folderList: null,
      platform: null,
      redGiantDirPath: null,
      redGiantDirContents: [],
      licenseDirPath: null,
      licenseList: []
    };
  },
  mounted() {
    log.debug("[LicenseScanner.vue] page mounted");
    this.fileList = this.$refs.file;
    this.folderList = this.$refs.folder;

    log.debug("[LicenseScanner.vue] file list:");
    log.debug(this.fileList);

    log.debug("[LicenseScanner.vue] folder list:");
    log.debug(this.folderList);

    let platform = process.platform;
    log.debug("[LicenseScanner.vue] platform detected: " + platform);
    this.platform = platform;

    if (platform == "win32") {
      log.debug("[LicenseScanner.vue] saving path for Windows");
      this.redGiantDirPath = path.join("C:", "ProgramData", "Red Giant");
    } else {
      log.debug("[LicenseScanner.vue] saving path for Unix");
      this.redGiantDirPath = path.join(
        path.sep,
        "Users",
        "Shared",
        "Red Giant"
      );
    }
    log.debug(this.redGiantDirPath);
  },
  methods: {
    testLicense(data) {
      log.debug(
        "[LicenseScanner.vue] license test button detected, emitting to parent"
      );
      this.$emit("testLicense", data);
    },
    clearResults() {
      log.verbose("[LicenseScanner] clearing any current result data");
      this.display = false;
      this.$refs.file.innerHTML = "";
      this.$refs.folder.innerHTML = "";
    },
    scan() {
      log.info("[LicenseScanner] beginning scan...");
      this.clearResults();

      log.debug("[LicenseScanner.vue] setting display property to true");
      this.display = true;

      if (this.defaultDirExists()) {
        log.info("[LicenseScanner] default directory found");
        this.addListItem(
          "folder",
          "License directory found!",
          SUCCESS,
          SUCCESS_ICON
        );

        if (this.isLowerCase()) {
          log.info("[LicenseScanner] directory using lowercase");
          this.addListItem(
            "folder",
            'Uses lowercase "licenses"',
            SUCCESS,
            SUCCESS_ICON
          );
        } else {
          log.info("[LicenseScanner] directory using capital 'L'");
          let directoryFrom = path.join(this.redGiantDirPath, "Licenses");
          let directoryTo = path.join(this.redGiantDirPath, "licenses");

          this.addListItemWithRenameButton(
            "folder",
            'Folder uses capital "L", please change to lowercase',
            FAILURE,
            FAILURE_ICON,
            directoryFrom,
            directoryTo
          );
        }

        log.info("[LicenseScanner] scanning for all license files...");
        let files = this.getLicenseFiles();

        if (files) {
          log.info("[LicenseScanner] files found: " + files.length);
          log.verbose("[LicenseScanner] displaying license files");
          this.displayLicenses(files);
        } else {
          log.info("[LicenseScanner] no license files detected");
        }
      } else {
        log.info("[LicenseScanner] licenses directory not found");
        this.addListItem(
          "folder",
          "License directory not found",
          FAILURE,
          FAILURE_ICON
        );

        if (this.checkSpelling()) {
          log.info("[LicenseScanner] possible misspelled folder found");
          this.addListItem(
            "folder",
            'License folder misspelled, please change to "licenses"',
            FAILURE,
            FAILURE_ICON
          );
        }
      }
    },
    addListItem(ref, content, color, icon) {
      log.verbose("[LicenseScanner] adding list item...");
      log.debug(`[LicenseScanner.vue] ref: ${ref}`);
      log.debug(`[LicenseScanner.vue] content: ${content}`);
      log.debug(`[LicenseScanner.vue] color: ${color}`);
      log.debug(`[LicenseScanner.vue] icon: ${icon}`);

      let component = Vue.extend(ScanResult);
      let instance = new component({
        propsData: {
          text: content,
          color,
          icon
        }
      });

      log.debug(
        "[LicenseScanner.vue] component and instance created, mounting..."
      );
      instance.$mount();

      log.debug("[LicenseScanner.vue] instance mounted, adding to DOM");
      this.$refs[ref].appendChild(instance.$el);
      log.debug("[LicenseScanner.vue] instance added to DOM");
      log.verbose("[LicenseScanner] item added to list");
    },
    addListItemWithRenameButton(
      ref,
      content,
      color,
      icon,
      renameFrom,
      renameTo
    ) {
      log.verbose("[LicenseScanner] adding list item...");
      log.debug(`[LicenseScanner.vue] ref: ${ref}`);
      log.debug(`[LicenseScanner.vue] content: ${content}`);
      log.debug(`[LicenseScanner.vue] color: ${color}`);
      log.debug(`[LicenseScanner.vue] icon: ${icon}`);
      log.debug(`[LicenseScanner.vue] renaming from: ${renameFrom}`);
      log.debug(`[LicenseScanner.vue] renaming to: ${renameTo}`);

      let component = Vue.extend(ScanResultWithButton);
      let instance = new component({
        propsData: {
          text: content,
          color,
          icon,
          from: renameFrom,
          to: renameTo
        }
      });

      log.debug(
        "[LicenseScanner] component and instance created, adding listeners and mounting..."
      );
      instance.$on("rescan", this.scan);
      instance.$mount();

      log.debug(
        "[LicenseScanner] listeners added, instance mounted; adding to DOM"
      );
      this.$refs[ref].appendChild(instance.$el);
      log.verbose("[LicenseScanner] item added to list");
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
    displayLicenses(licenseList) {
      log.debug("[LicenseScanner.vue] displaying licenses from list:");
      log.debug(licenseList);

      if (licenseList.length == 0) {
        log.verbose("[LicenseScanner] no licenses to display");
        log.debug(
          "[LicenseScanner.vue] adding list item to 'file' list with failure status"
        );
        this.addListItem(
          "file",
          "No license file found",
          FAILURE,
          FAILURE_ICON
        );
      } else {
        if (licenseList.length == 1) {
          log.verbose("[LicenseScanner] only one license found - no conflicts");
          log.debug(
            "[LicenseScanner.vue] adding list item to 'file' list with success status"
          );
          this.addListItem(
            "file",
            "Single license file found - no conflicts",
            SUCCESS,
            SUCCESS_ICON
          );
        } else {
          log.verbose(
            "[LicenseScanner] multiple licenses found - there may be conflicts"
          );
          log.debug(
            "[LicenseScanner.vue] adding list item to 'file' list with failure status"
          );
          this.addListItem(
            "file",
            "Multiple license files found - conflicts likely",
            FAILURE,
            FAILURE_ICON
          );
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
    },
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
    getLicenseFiles() {
      log.verbose(
        "[LicenseScanner] scanning for files ending with .lic and .config..."
      );

      let contents = fs.readdirSync(this.licenseDirPath);
      log.debug("[LicenseScanner.vue] license directory contents:");
      log.debug(contents);

      if (contents.length == 0) {
        log.verbose("[LicenseScanner] no files found");
        return [];
      } else {
        log.verbose("[LicenseScanner] filtering for .lic and .config files...");
        let licenseFiles = contents.filter(
          f => f.endsWith(".lic") || f.endsWith(".config")
        );
        log.debug("[LicenseScanner.vue] license files found:");
        log.debug(licenseFiles);
        this.licenseList = licenseFiles;
        return licenseFiles;
      }
    },
    isLowerCase() {
      log.verbose(
        "[LicenseScanner] checking if licenses directory is all lowercase..."
      );

      log.verbose("[LicenseScanner] filtering for 'licenses' directory");
      let dirContents = this.redGiantDirContents.filter(d =>
        d.includes("icenses")
      );

      if (dirContents.length >= 1) {
        log.verbose(
          "[LicenseScanner] directory found, verifying capitalization"
        );
        return dirContents[0] === "licenses";
      } else {
        log.verbose("[LicenseScanner] no directory found");
        return false;
      }
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
    },
    dirExists(dirPath) {
      return fs.existsSync(dirPath);
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
