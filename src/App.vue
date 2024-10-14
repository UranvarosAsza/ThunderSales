<template>
  <div>
    <nav class="navbar navbar-expand-lg bg-body-tertiary my-nav">
      <div class="container-fluid">
        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarTogglerDemo01"
          aria-controls="navbarTogglerDemo01"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarTogglerDemo01">
          <p>
            ThunderSales<span class="version" v-tooltip.top="patchnotes[0].version"> beta</span>
          </p>

          <ul class="navbar-nav me-auto mb-2 mb-lg-0">
            <li class="nav-item">
              <a class="nav-link"><RouterLink to="/">Home</RouterLink></a>
            </li>
            <li class="nav-item">
              <a class="nav-link"><RouterLink to="/list">List</RouterLink></a>
            </li>
            <!--
            <li class="nav-item">
              <a class="nav-link help"
                ><i
                  class="pi pi-question-circle"
                  style="font-size: 1.2em"
                  v-tooltip.bottom="'Help'"
                ></i
              ></a>
            </li>
            -->
          </ul>
        </div>
      </div>
    </nav>
    <RouterView />
  </div>
</template>

<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import patchnotes from '@/assets/patchnotes.json'
</script>

<style scoped>
.help {
  margin-top: auto !important;
  vertical-align: sub;
}
.version {
  font-size: small;
  font-variant: small-caps;
}
</style>
