<template>
    <div>
        <b-row>
            <b-col>
                <b-button variant="outline-primary" @click="scan">Scan</b-button>
            </b-col>
        </b-row>
        <b-row v-bind:class="this.display ? 'visible' : 'hidden'">
            <b-col cols="12" class="my-3">
                <h5>License File</h5>
                <ResultsColumn id="file-list" ref="file"/>
            </b-col>
            <b-col cols="12" class="my-3">
                <h5>License Directory</h5>
                <ResultsColumn id="folder-list" ref="folder"/>
            </b-col>
        </b-row>
    </div>
</template>

<script>
import ScanResult from '../components/ScanResult.vue'
import LicenseFile from '../components/LicenseFile.vue'

import Vue from 'vue'
import path from 'path'
import fs from 'fs'

const SUCCESS = 'text-success'
const FAILURE = 'text-danger'
const SUCCESS_ICON = 'check'
const FAILURE_ICON = 'close'

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
        testLicense(data) {
            this.$emit('testLicense', data)
        },
        clearResults() {
            this.display = false
            this.$refs.file.innerHTML = ''
            this.$refs.folder.innerHTML = ''
        },
        scan() {
            this.clearResults()
            this.display = true
            console.log('scan started!')
            if (this.defaultDirExists()) {
                console.log('default directory exists!')
                this.addListItem('folder', 'License directory found!', SUCCESS, SUCCESS_ICON)
                if (this.isLowerCase()) {
                    this.addListItem('folder', 'Uses lowercase "licenses"', SUCCESS, SUCCESS_ICON)
                } else {
                    this.addListItem('folder', 'Folder uses capital "L", please change to all lowercase', FAILURE, FAILURE_ICON)
                }

                console.log('scanning for license files')
                let files = this.getLicenseFiles()
                console.log('files found:')
                console.log(files)

                this.displayLicenses(files)
            } else {
                this.addListItem('folder', 'License directory not found', FAILURE, FAILURE_ICON)
                if (this.checkSpelling()) {
                    this.addListItem('folder', 'License folder misspelled, please change to "licenses"', FAILURE, FAILURE_ICON)
                }
            }
        },
        addListItem(ref, content, color, icon) {
            let component = Vue.extend(ScanResult)
            let instance = new component({
                propsData: {
                    text: content,
                    color,
                    icon
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

            instance.$on('rescan', this.scan)
            instance.$on('testLicense', this.testLicense)

            instance.$mount()
            this.$refs.file.appendChild(instance.$el)
        },
        displayLicenses(licenseList) {
            if (licenseList.length == 0) {
                console.log('no license files found')
                this.addListItem('file', 'No license file found', FAILURE, FAILURE_ICON)
            } else {
                if (licenseList.length == 1) {
                    this.addListItem('file', 'Single license file found - no conflicts', SUCCESS, SUCCESS_ICON)
                } else {
                    this.addListItem('file', 'Multiple license files found - conflicts likely', FAILURE, FAILURE_ICON)
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