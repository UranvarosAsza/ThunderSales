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
          <p>ThunderSales<span class="version"> beta</span></p>

          <ul class="navbar-nav me-auto mb-2 mb-lg-0">
            <li class="nav-item">
              <a class="nav-link"
                ><RouterLink to="/">{{ $t('UI_Common.home') }}</RouterLink></a
              >
            </li>
            <li class="nav-item">
              <a class="nav-link"
                ><RouterLink to="/list">{{ $t('UI_Common.list') }}</RouterLink></a
              >
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
          --></ul>
          <button
            v-if="isDev"
            @click="clearCookies"
            class="dev-btn"
            title="Clear cookies (dev only)"
          >
            🍪❌
          </button>
          <div class="language-switcher">
            <button
              @click="switchLanguage('en')"
              :class="{ active: currentLocale === 'en' }"
              class="lang-btn"
            >
              EN
            </button>
            <button
              @click="switchLanguage('hu')"
              :class="{ active: currentLocale === 'hu' }"
              class="lang-btn"
            >
              HU
            </button>
          </div>
        </div>
      </div>
    </nav>
    <RouterView />
  </div>
</template>

<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import { ref, onMounted } from 'vue'
import { getLocale, setLocale, t, type Locale } from './language-selector'

const currentLocale = ref<Locale>(getLocale())
const isDev = import.meta.env.DEV

onMounted(() => {
  currentLocale.value = getLocale()
})

function switchLanguage(lang: Locale) {
  setLocale(lang)
  currentLocale.value = lang
  location.reload()
}

function clearCookies() {
  // Töröljük az összes cookie-t ezen az oldalon
  document.cookie.split(';').forEach((c) => {
    document.cookie = c
      .replace(/^ +/, '')
      .replace(/=.*/, '=;expires=' + new Date().toUTCString() + ';path=/')
  })
  console.log('🍪 Cookies cleared!')
  location.reload()
}
</script>

<style scoped>
.language-switcher {
  margin: 0px;
  gap: 0;
}
.lang-btn {
  font-size: 12px;
  padding: 4px;
}
.help {
  margin-top: auto !important;
  vertical-align: sub;
}
.version {
  font-size: small;
  font-variant: small-caps;
}
.dev-btn {
  padding: 0.375rem 0.75rem;
  border: 1px solid #dc3545;
  background: #dc3545;
  color: white;
  border-radius: 0.25rem;
  cursor: pointer;
  margin-right: 0.5rem;
  font-size: 1rem;
  transition: all 0.2s;
}

.dev-btn:hover {
  background: #c82333;
  border-color: #c82333;
}
</style>
