<template>
  <div id="app">
    <nav class="nav-extended red darken-2">
      <div class="nav-content">
        <ul class="tabs tabs-transparent">
          <li class="tab"><router-link to="/">Home</router-link></li>
          <li class="tab"><router-link to="/scan">Port Scan</router-link></li>
        </ul>
      </div>
    </nav>
    <router-view />
  </div>
</template>

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

nav a.router-link-exact-active {
  color: white;
  background: rgb(153, 35, 35);
}

* {
  box-sizing: border-box;
}

strong {
  font-weight: bold !important;
}
</style>
