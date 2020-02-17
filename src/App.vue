<template>
  <div id="app">
    <nav>
      <div class="nav-wrapper red darken-3">
        <ul class="left">
          <li><router-link to="/">Home</router-link></li>
          <li><router-link to="/about">About</router-link></li>
          <li><router-link to="/scan">Port Scan</router-link></li>
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
  background: rgb(126, 34, 34);
}

* {
  box-sizing: border-box;
}

strong {
  font-weight: bold !important;
}
</style>
