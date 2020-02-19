<template>
  <div id="app">
    <nav class="nav-extended red darken-2">
      <div class="nav-content">
        <ul class="tabs tabs-transparent">
          <li class="tab"><router-link to="/scan">Port Scan</router-link></li>
          <li class="tab"><router-link to="/license">License Scan</router-link></li>
        </ul>
      </div>
    </nav>
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App'
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
