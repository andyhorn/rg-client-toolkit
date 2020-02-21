<template>
  <div id="app">
    <b-navbar toggleable="md" type="dark" variant="dark">
      <b-navbar-brand href="#">Red Giant Toolkit</b-navbar-brand>
      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav>
          <b-nav-item to="/scan">Port Scan</b-nav-item>
          <b-nav-item to="/license">License Scan</b-nav-item>
          <b-nav-item to="/create">License Creator</b-nav-item>
          <b-nav-item to="/serials">Serial Removal</b-nav-item>
          <b-nav-item to="/options">Other Options</b-nav-item>
        </b-navbar-nav>
      </b-collapse>

    </b-navbar>    

      <router-view/>
      
  </div>
</template>

<script>
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue'
export default {
  name: 'App'
}
</script>

<style>

</style>
