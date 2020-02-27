<template>
  <div id="app">
    <div class="vertical-nav bg-dark" id="sidebar">
      <img src="../src/assets/red_giant_on_black.png" id="brand" />
      <router-link
        to="/scan"
        active-class="bg-light text-dark border-right border-dark"
        >Port Scan</router-link>
      <router-link
        to="/license"
        active-class="bg-light text-dark border-right border-dark"
        >License Scan</router-link>
      <router-link
        to="/create"
        active-class="bg-light text-dark border-right border-dark"
        >License Creator</router-link>
      <router-link
        to="/serials"
        active-class="bg-light text-dark border-right border-dark"
        >Serial Management</router-link>
      <router-link
        to="/other"
        active-class="bg-light text-dark border-right border-dark"
        >Other Tools</router-link>
    </div>
    <div id="view">
      <router-view />
    </div>
  </div>
</template>

<script>
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue";
import router from "./router/index";
const { ipcRenderer } = require("electron");

ipcRenderer.on("navTo", (e, page) => {
  router.push("/" + page);
});

export default {
  name: "App"
};
</script>

<style>
#app {
  min-width: 500px;
  min-height: 500px;
}
.vertical-nav {
  width: 10rem;
  min-width: 10rem;
  height: 100vh;
  position: fixed;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-end;
}
.vertical-nav a {
  padding: 1rem 0;
  width: 100%;
  text-align: right;
  padding-right: 0.75rem;
  margin-top: 0.05rem;
  margin-bottom: 0.05rem;
  color: #f4e9cd;
}
.vertical-nav a:hover {
  text-decoration: none;
  color: white;
  background-color: rgba(0, 0, 0, 0.15);
}
.vertical-nav img {
  width: 100%;
  padding: 5px;
  position: absolute;
  left: 0;
  top: 5px;
  border-bottom: 1px solid white;
}
#view {
  padding-left: 11rem;
  padding-right: 1rem;
}
button {
  border-radius: 0 !important;
}
</style>
