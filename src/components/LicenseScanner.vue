<template>
    <div>
        <div class="row">
            <div class="col s12 center">
                <button @click="scan" class="waves-effect waves-light btn-large"><i class="material-icons right">folder_open</i>Scan</button>
            </div>
        </div>
        <div v-bind:class="this.display ? 'visible' : 'hidden'" class="row">
            <div class="col s12">
                <h5>License File</h5>
                <ul id="file-list" ref="file" class="collection"></ul>
            </div>
            <div class="col s12">
                <h5>License Directory</h5>
                <ul id="folder-list" ref="folder" class="collection"></ul>
            </div>
        </div>
    </div>
</template>

<script>
import ScanResult from '../components/ScanResult.vue'
import LicenseFile from '../components/LicenseFile.vue'

import Vue from 'vue'
import path from 'path'
import fs from 'fs'

export default {
    name: 'LicenseScanner',
    data() {
        return {
            display: false,
            fileList: null,
            folderList: null
        }
    },
    mounted() {
        console.log(this.$refs)
        console.log(this.$refs.folder)
        this.fileList = this.$refs.file
        this.folderList = this.$refs.folder
    },
    methods: {
        scan() {
            this.display = true
            console.log('scan started!')
            if (this.defaultDirExists()) {
                console.log('default directory exists!')
                this.addListItem('folder', 'License directory found!', 'green-text')
                if (this.isLowerCase()) {
                    this.addListItem('folder', 'Uses lowercase "licenses"', 'green-text')
                } else {
                    this.addListItem('folder', 'Folder uses capital "L", please change to all lowercase', 'red-text')
                }

                console.log('scanning for license files')
                let files = this.getLicenseFiles()
                console.log('files found:')
                console.log(files)

                this.displayLicenses(files)
            } else {
                this.addListItem('folder', 'License directory not found', 'red-text')
                if (this.checkSpelling()) {
                    this.addListItem('folder', 'License folder misspelled, please change to "licenses"', 'red-text')
                }
            }
        },
        addListItem(ref, content, color) {
            let component = Vue.extend(ScanResult)
            let instance = new component({
                propsData: {
                    text: content,
                    color
                }
            })
            instance.$mount()
            this.$refs[ref].appendChild(instance.$el)
        },
        displayLicenseContents(lic) {
            let component = Vue.extend(LicenseFile)
            let instance = new component({
                propsData: {
                    license: lic
                }
            })

            instance.$mount()
            this.$refs.file.appendChild(instance.$el)
        },
        displayLicenses(licenseList) {
            if (licenseList.length == 0) {
                console.log('no license files found')
                this.addListItem('file', 'No license file found', 'red-text')
            } else {
                if (licenseList.length == 1) {
                    this.addListItem('file', 'Single license file found - no conflicts', 'green-text')
                } else {
                    this.addListItem('file', 'Multiple license files found - conflicts likely', 'red-text')
                }

                let dirPath = this.getLicenseDirPath()
                for (let license of licenseList) {
                    let lic = this.readLicenseFile(path.join(dirPath, license))
                    this.displayLicenseContents(lic)
                }
            }
        },
        readLicenseFile(filePath) {
            let fileContents = fs.readFileSync(filePath, {
                encoding: 'utf-8'
            })

            let license = {}
            let values = fileContents.split(' ')

            license.name = filePath
            license.host = values[1].trim()
            license.port = values[3].trim()

            return license
        },
        checkSpelling() {
            let dirPath = this.getLicenseDirPath()
            let rgDir = this.getParentDir(dirPath)

            let regex = new RegExp('[L|l]i[c|s]en[c|s]es?$')
            let dirContents = fs.readdirSync(rgDir)
            let folder = dirContents.filter(d => regex.test(d))

            return folder.length > 0 ? folder[0] : false
        },
        getLicenseFiles() {
            let dirPath = this.getLicenseDirPath()
            let contents = fs.readdirSync(dirPath)

            if (contents.length == 0) {
                return []
            } else {
                contents = contents.filter(f => f.endsWith('.lic') || f.endsWith('.config'))
                return contents
            }
        },
        isLowerCase() {
            let dirPath = this.getLicenseDirPath()
            let parentDir = this.getParentDir(dirPath)

            let dirContents = fs.readdirSync(parentDir)
            dirContents = dirContents.filter(d => d.includes('icenses'))
            
            if (dirContents.length >= 1) {
                return dirContents[0] === 'licenses'
            } else {
                return false
            }
        },
        getParentDir(dirPath) {
            let splitPath = dirPath.split(path.sep)
            if (splitPath.length > 1) {
                let parentPath = dirPath.split(path.sep).slice(0, -1).join(path.sep)
                return parentPath
            } else {
                return dirPath
            }
        },
        defaultDirExists() {
            let dirPath = this.getLicenseDirPath()
            return this.dirExists(dirPath)
        },
        dirExists(dirPath) {
            return fs.existsSync(dirPath)
        },
        getLicenseDirPath() {
            let platform = this.getPlatform()

            if (platform == 'win32') {
                return path.join('C:', 'ProgramData', 'Red Giant', 'licenses')
            } else {
                return path.join('Users', 'Shared', 'Red Giant', 'licenses')
            }
        },
        getPlatform() {
            return process.platform
        }
    }
}
</script>

<style scoped>
    .visible {
        visibility: visible;
    }
    .hidden {
        visibility: hidden;
    }
</style>