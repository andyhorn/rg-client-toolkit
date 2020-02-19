import Vue from "vue";
import VueRouter from "vue-router";
import PortScan from '../views/PortScan.vue'
import LicenseScan from '../views/LicenseScan.vue'
import LicenseCreator from '../views/LicenseCreator.vue'

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
  },
  {
    path: '/create',
    name: 'LicenseCreator',
    component: LicenseCreator
  }
];

const router = new VueRouter({
  routes
});

export default router;
