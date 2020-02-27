<template>
    <div>
        <b-form @submit="addItem">
            <b-input-group>
                <b-input ref="serialNumber" type="text"></b-input>
                <b-button variant="primary" type="submit">Add</b-button>
            </b-input-group>
        </b-form>
        <b-list-group horizontal class="py-3">
            <ExcludedSerial 
                v-for="item in serialList" 
                v-bind:key="item.id" 
                v-bind:serial="item.serial"
                v-bind:id="item.id" 
                v-on:removeSerial="removeSerial"
                class="m-1">
            </ExcludedSerial>
        </b-list-group>
    </div>
</template>

<script>
import { v4 as uuidv4 } from "uuid";
import path from "path";
import fs from "fs";
import ExcludedSerial from "./ExcludedSerial.vue";

export default {
    name: "SerialExclusionForm",
    components: {
        ExcludedSerial
    },
    data() {
        return {
            serialList: [],
            exclusionFilePath: null,
            exclusionFileName: "SerialExclusions.txt",
            filePath: null
        }
    },
    mounted() {
        this.exclusionFilePath = process.platform == "win32"
                ? path.join("C:", "ProgramData", "Red Giant", "Red Giant Service")
                : path.join("Users", "Shared", "Red Giant", "Red Giant Service");

        this.filePath = path.join(this.exclusionFilePath, this.exclusionFileName);

        this.read();
    },
    methods: {
        read() {
            if (fs.existsSync(this.filePath)) {
                let fileData = fs.readFileSync(this.filePath, {
                    encoding: "utf-8"
                });
                fileData = fileData.split("\n");

                for (let line of fileData) {
                    let item = {
                        serial: line,
                        id: uuidv4()
                    }
                    this.serialList.push(item);
                }
            }
        },
        addItem(e) {
            e.preventDefault();
            console.log("adding serial");
            let serial = this.$refs.serialNumber.$el.value;
            console.log(serial);
            this.$refs.serialNumber.$el.value = "";
            let item = {
                serial,
                id: uuidv4()
            }
            this.serialList.push(item);
            this.updateFile();
        },
        removeSerial(id) {
            console.log("removing serial " + id);
            this.serialList = this.serialList.filter(i => i.id != id);
            this.updateFile();
        },
        updateFile() {
            let contents = this.serialList.map(i => i.serial).join("\n");
            fs.writeFileSync(this.filePath, contents, {
                encoding: "utf-8"
            });
        }
    }
}
</script>

<style scoped>

</style>