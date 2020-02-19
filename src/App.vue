<template>
  <div id="app">
    <nav>
      <div class="nav-wrapper">
        <a href="#" data-target="mobile-nav" class="sidenav-trigger"><i class="material-icons">menu</i></a>
        <ul class="hide-on-med-and-down">
          <li><router-link to="/scan">Port Scan</router-link></li>
          <li><router-link to="/license">License Scan</router-link></li>
          <li><router-link to="/create">License Creator</router-link></li>
          <li><router-link to="/serials">Serial Removal</router-link></li>
          <li><router-link to="/options">Other Options</router-link></li>
        </ul>
      </div>
    </nav>
    <ul class="sidenav grey lighten-2" id="mobile-nav">
      <li><router-link to="/scan">Port Scan</router-link></li>
      <li><router-link to="/license">License Scan</router-link></li>
      <li><router-link to="/create">License Creator</router-link></li>
      <li><router-link to="/serials">Serial Removal</router-link></li>
      <li><router-link to="/options">Other Options</router-link></li>
    </ul>
    <router-view />
  </div>
</template>

<script>
const $ = window.$ = window.jQuery = require('jquery')
// const M = require('materialize-css')

export default {
  name: 'App',
  mounted() {
    $(document).ready(() => {
      $('.sidenav').sidenav()
    })
  }
}
</script>

<style>
#app {
  font-family: Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

nav a:hover {
  color: white;
  cursor: pointer;
  text-decoration: none;
}

* {
  box-sizing: border-box;
}

strong {
  font-weight: bold !important;
}
</style>
