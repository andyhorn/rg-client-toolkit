<template>
  <b-form @submit="scanPorts" class="container">
    <b-row>
      <b-col>
        <PortScanTextInput v-bind:values="this.host" />
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <PortScanTextInput v-bind:values="this.ports[0]" />
      </b-col>
      <b-col>
        <PortScanTextInput v-bind:values="this.ports[1]" />
      </b-col>
      <b-col>
        <PortScanTextInput v-bind:values="this.ports[2]" />
      </b-col>
    </b-row>
    <div class="d-flex flex-row">
      <b-button id="scanButton" type="submit" variant="primary">Scan!</b-button>
      <div id="spinBox" class="hidden ml-3">
        <b-spinner></b-spinner>
      </div>
    </div>
  </b-form>
</template>

<script>
import PortScanTextInput from "./PortScanTextInput";
import log from "../../utils/log";

const Net = require("net");
const url = require("url");

const TIMEOUT = 5 * 1000;
log.debug(`[PortScanForm.vue] TIMEOUT set to: ${TIMEOUT}`);

var isScanning = false;

function startScanAnimation() {
  if (!isScanning) {
    disableScanButton();
    log.verbose("[PortScanForm] starting scan animation");
    document.getElementById("spinBox").classList.remove("hidden");
    document.getElementById("spinBox").classList.add("visible");
    isScanning = true;
  }
}

function endScanAnimation() {
  if (isScanning) {
    log.verbose("[PortScanForm.vue] ending scan animation");
    document.getElementById("spinBox").classList.add("hidden");
    document.getElementById("spinBox").classList.remove("visible");
    enableScanButton();
    isScanning = false;
  }
}

function disableScanButton() {
  document.getElementById("scanButton").classList.add("disabled");
  document.getElementById("scanButton").setAttribute("disabled", "true");
}

function enableScanButton() {
  document.getElementById("scanButton").classList.remove("disabled");
  document.getElementById("scanButton").removeAttribute("disabled");
}

export default {
  name: "PortScanForm",
  components: {
    PortScanTextInput
  },
  props: ["hostValue", "rlmPortValue"],
  data() {
    return {
      activeScans: 0,
      host: {
        title: "Server Address",
        value: this.hostValue,
        required: true
      },
      ports: [
        {
          name: "rlmPort",
          title: "RLM Port",
          value: this.rlmPortValue || "5053",
          success: null
        },
        {
          name: "webPort",
          title: "Web GUI Port",
          value: "5054",
          success: null
        },
        {
          name: "isvPort",
          title: "ISV Port",
          value: null,
          success: null
        }
      ]
    };
  },
  watch: {
    activeScans: function() {
      if (this.activeScans) {
        startScanAnimation();
      } else {
        endScanAnimation();
      }
    }
  },
  methods: {
    scanPorts(e) {
      log.info("[PortScanForm] beginning port scan...");

      log.debug("[PortScanForm.vue] preventing submit action on form");
      e.preventDefault();

      log.verbose("[PortScanForm] testing each available port...");
      let portList = this.ports.filter(p => p.value != null);

      for (let port of portList) {
        log.debug(`[PortScanForm.vue] beginning scan of port:`);
        log.debug(port);

        let value = port.value;
        if (value != null) {
          this.activeScans += 1;
          port.success = null;
          let host = url.parse(this.host.value).host;

          if (host == null) {
            host = this.host.value;
          } else {
            this.host.value = host;
          }

          log.debug(`[PortScanForm.vue] port value parsed: ${value}`);
          log.debug(`[PortScanForm.vue] port host value parsed: ${host}`);

          let socket = new Net.Socket();
          socket.setTimeout(TIMEOUT);

          log.debug("[PortScanForm.vue] new socket created and timeout set");

          socket.on("connect", () => {
            log.verbose(
              `[PortScanForm] port ${port.value} connected successfully`
            );
            socket.end();
            port.success = true;
          });

          socket.on("timeout", () => {
            log.warning(`[PortScanForm] port ${port.value} timed out`);
            socket.destroy();
            port.success = false;
          });

          socket.on("error", err => {
            log.error(`[PortScanForm] fatal error on port ${port.value}`);
            log.error(err);
            socket.end();
            port.success = false;
          });

          socket.on("close", () => {
            log.debug(
              `[PortScanForm.vue] socket closed for port ${port.value}`
            );
            log.debug(
              `[PortScanForm.vue] decrementing scan counter from ${this.activeScans}`
            );
            this.activeScans -= 1;
          });

          log.verbose(
            `[PortScanForm] initiating connection on port "${port.value}" to host "${host}"`
          );
          socket.connect(port.value, host);
        }
      }
    }
  }
};
</script>

<style scoped>
.hidden {
  visibility: hidden;
}
.visible {
  visibility: visible;
}
</style>
