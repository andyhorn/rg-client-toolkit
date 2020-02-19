import Vue from "vue";
import VueRouter from "vue-router";
import PortScan from '../views/PortScan.vue'
import LicenseScan from '../views/LicenseScan.vue'

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    redirect: "/scan"
  },
  {
    path: "/scan",
    name: "PortScan",
    component: PortScan
  },
  {
    path: "/license",
    name: "LicenseScan",
    component: LicenseScan
  }
];

const router = new VueRouter({
  routes
});

export default router;
