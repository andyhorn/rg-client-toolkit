import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import PortScan from '../views/PortScan.vue'

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home
  },
  {
    path: "/scan",
    name: "PortScan",
    component: PortScan
  }
];

const router = new VueRouter({
  routes
});

export default router;
