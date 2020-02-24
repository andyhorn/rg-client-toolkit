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
    <b-button type="submit" variant="primary">Scan!</b-button>
    <div id="scanStatus"></div>
  </b-form>
</template>

<script>
import PortScanTextInput from "./PortScanTextInput";
import Log from "../../utils/log";
const log = new Log();

const Net = require("net");
const url = require("url");

const TIMEOUT = 5 * 1000;
log.debug(`[PortScanForm.vue] TIMEOUT set to: ${TIMEOUT}`);

const scanStatusText = ["Scanning", "Scanning.", "Scanning..", "Scanning..."];
var scans = 0,
  scanStatusIndex = 0,
  interval;

function startScanAnimation() {
  log.verbose("[PortScanForm.vue] starting scan animation");
  interval = setInterval(updateScanText, 100);
}

function updateScanText() {
  let scanStatusElement = document.getElementById("scanStatus");
  let text = `<p>${scanStatusText[scanStatusIndex]}</p>`;
  log.debug(`[PortScanForm.vue] updaing scan text to: ${text}`);
  scanStatusElement.innerHTML = text;
  scanStatusIndex += 1;

  if (scanStatusIndex == scanStatusText.length) {
    scanStatusIndex = 0;
  }
}

function endScanAnimation() {
  log.verbose("[PortScanForm.vue] ending scan animation");
  if (scans == 0) {
    log.debug(`[PortScanForm.vue] clearing interval...`);
    clearInterval(interval);
    log.debug(`[PortScanForm.vue] interval cleared`);

    log.debug("[PortScanForm.vue] clearing scan text");
    document.getElementById("scanStatus").innerText = "";
  }
}

export default {
  name: "PortScanForm",
  components: {
    PortScanTextInput
  },
  props: ["hostValue", "rlmPortValue"],
  data() {
    return {
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
  methods: {
    scanPorts(e) {
      log.info("[PortScanForm] beginning port scan...");

      log.debug("[PortScanForm.vue] preventing submit action on form");
      e.preventDefault();

      log.verbose("[PortScanForm.vue] starting scan animation");
      startScanAnimation();

      log.verbose("[PortScanForm] testing each available port...");
      for (let port of this.ports) {
        log.debug(`[PortScanForm.vue] beginning scan of port:`);
        log.debug(port);

        let value = port.value;
        if (value == null) {
          return;
        }

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
          log.verbose(`[PortScanForm] port ${port} connected successfully`);
          socket.end();
          port.success = true;
        });

        socket.on("timeout", () => {
          log.warning(`[PortScanForm] port ${port} timed out`);
          socket.destroy();
          port.success = false;
        });

        socket.on("error", err => {
          log.error(`[PortScanForm] fatal error on port ${port}`);
          log.error(err);
          socket.end();
          port.success = false;
        });

        socket.on("close", () => {
          log.debug(`[PortScanForm.vue] socket closed for port ${port}`);
          log.debug(
            `[PortScanForm.vue] decrementing scan counter from ${scans}`
          );
          scans -= 1;
          endScanAnimation();
        });

        log.debug(`[PortScanForm.vue] incrementing scan counter from ${scans}`);
        scans += 1;
        log.debug(`[PortScanForm.vue] scan counter incremented to ${scans}`);

        log.verbose(
          `[PortScanForm] initiating connection on port "${port}" to host "${host}"`
        );
        socket.connect(port.value, host);
      }
    }
  }
};
</script>

<style scoped></style>
