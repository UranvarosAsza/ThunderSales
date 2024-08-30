<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <div>
    <nav class="navbar">
      <RouterLink to="/">Home</RouterLink>
      <RouterLink to="/list">List</RouterLink>
    </nav>
    <RouterView />
  </div>
</template>

<style scoped>
#body {
  margin: 0px !important;
}
.navbar {
  background-color: #2e4451;
  padding: 10px;
  text-align: center;
}

.navbar a {
  color: #ffffff;
  text-decoration: none;
  margin: 0 15px;
  font-size: 1.2em;
}

.navbar a:hover {
  text-decoration: underline;
}
</style>
