<template>
  <b-container class="pt-5" id="port-scan">
    <b-row>
      <b-col>
        <h3>Port Scanner</h3>
        <p>
          Enter your RLM server's IP, Hostname, or URL along with the three TCP
          ports listed below (the defaults are already filled).
        </p>
      </b-col>
    </b-row>
    <b-row>
      <PortScanForm
        :hostValue="this.$route.query.host"
        :rlmPortValue="this.$route.query.port"
      />
    </b-row>
  </b-container>
</template>

<script>
import PortScanForm from "../components/ports/PortScanForm";
import log from "../utils/log";

export default {
  name: "PortScan",
  components: {
    PortScanForm
  },
  mounted() {
    log.verbose("[PortScan.vue] mounted");
    let query = this.$route.query;

    if (query && (query.host || query.port)) {
      log.info("[PortScan.vue] URL query parameters present");
      if (query.host) {
        log.debug(`[PortScan.vue] query.host: ${query.host}`);
        log.info(`[PortScan.vue] setting host value to ${query.host}`);
        this.host = query.host;
      }
      if (query.port) {
        log.debug(`[PortScan.vue] query.port: ${query.port}`);
        log.info(`[PortScan.vue] setting RLM port value to ${query.port}`);
        this.rlmPort = query.port;
      }
    }
  }
};
</script>

<style scoped>
#port-scan {
  margin-top: 1rem;
}
</style>
