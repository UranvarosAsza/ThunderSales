<template>
  <div>
    <nav class="navbar">
      <RouterLink to="/">Home</RouterLink>
      <RouterLink to="/list">List</RouterLink>
    </nav>
    <RouterView />
  </div>
</template>

<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>

<style scoped>
#body {
  margin: 0px !important;
}
.navbar {
  border-top-left-radius: 10px !important;
  border-top-right-radius: 10px !important;
  border-bottom-left-radius: 0px !important;
  border-bottom-right-radius: 0px !important;
  margin: auto;
  background-color: #2e4451;
  padding: 20px;
  text-align: center;
}

.navbar a {
  color: #ffffff;
  text-decoration: none;
  margin: 0 15px;
  font-size: 2em;
}

.navbar a:hover {
  text-decoration: underline;
}
</style>
