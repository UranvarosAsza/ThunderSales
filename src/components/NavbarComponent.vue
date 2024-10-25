<template>
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
        <p>ThunderSales<span class="version" v-tooltip.top="patchnotes[0].version"> beta</span></p>

        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <li class="nav-item">
            <a class="nav-link"
              ><RouterLink to="/">{{ getTranslatedText('home') }}</RouterLink></a
            >
          </li>
          <li class="nav-item">
            <a class="nav-link"
              ><RouterLink to="/list">{{ getTranslatedText('list') }}</RouterLink></a
            >
          </li>
          <li class="nav-item">
            <select v-model="selectedLanguage" @change="updateLanguage">
              <option value="en">EN</option>
              <option value="hu">HU</option>
            </select>
          </li>
          <li class="nav-item">
            <Popover ref="settingsPopover">
              <div class="settings-panel">
                <h5>{{ getTranslatedText('options') }}</h5>
                <div>
                  <label>{{ getTranslatedText('navbar_stickness') }}</label>
                  <input type="checkbox" v-model="settings.stickyNavbar" @change="saveSettings" />
                </div>
                <div>
                  <label>{{ getTranslatedText('number_format') }}</label>
                  <select v-model="settings.numberFormat" @change="saveSettings">
                    <option value="en">4,000</option>
                    <option value="hu">4 000</option>
                  </select>
                </div>
                <div>
                  <label>{{ getTranslatedText('show_hits') }}</label>
                  <input type="checkbox" v-model="settings.showHints" @change="saveSettings" />
                </div>
                <div>
                  <label>{{ getTranslatedText('show_patchnotes') }}</label>
                  <input type="checkbox" v-model="settings.showPatchnotes" @change="saveSettings" />
                </div>
                <div>
                  <button @click="showCookieInfo">{{ getTranslatedText('cookie_info') }}</button>
                </div>
              </div>
            </Popover>
          </li>
        </ul>
      </div>
    </div>
    <li class="nav-item settings">
      <button @click="clearCookies">Clear Cookies</button>
    </li>
    <li class="nav-item settings">
      <i
        class="pi pi-cog"
        @click="toggle"
        style="font-size: 1.2em"
        v-tooltip.bottom="'Settings'"
      ></i>
    </li>
  </nav>
</template>

<script>
import { RouterLink } from 'vue-router'
import patchnotes from '@/assets/patchnotes.json'
import Popover from 'primevue/popover'
import Cookies from 'js-cookie' // npm install js-cookie
import { getCookie, setCookie } from '../utlis/cookieUtils'
import { translate } from '../utlis/translation'

export default {
  components: {
    Popover
  },
  data() {
    return {
      patchnotes,
      selectedLanguage: Cookies.get('language') || 'en',
      settings: {
        stickyNavbar: Cookies.get('stickyNavbar') === 'true',
        numberFormat: Cookies.get('numberFormat') || 'en',
        showHints: Cookies.get('showHints') === 'true',
        showPatchnotes: Cookies.get('showPatchnotes') === 'true'
      }
    }
  },

  mounted() {
    // Ha sticky a navbar, alkalmazzuk a stílust
    if (this.settings.stickyNavbar) {
      document.querySelector('.navbar').classList.add('sticky-top')
    }
  },
  methods: {
    toggle(event) {
      this.$refs.settingsPopover.toggle(event)
    },
    getTranslatedText(key) {
      return translate(key, this.selectedLanguage)
    },
    saveSettings() {
      setCookie('stickyNavbar', this.settings.stickyNavbar)
      setCookie('numberFormat', this.settings.numberFormat)
      setCookie('showHints', this.settings.showHints)
      setCookie('showPatchnotes', this.settings.showPatchnotes)
    },
    updateLanguage() {
      Cookies.set('language', this.selectedLanguage)
      // Itt frissítheted az alkalmazás nyelvét a választott érték alapján
      console.log('Language changed to:', this.selectedLanguage)
    },
    showCookieInfo() {
      alert('Süti információk megjelenítése')
    },
    clearCookies() {
      // Az összes cookie törlése
      const cookies = document.cookie.split('; ')
      for (const cookie of cookies) {
        const [name] = cookie.split('=')
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=None; Secure`
      }
      console.log('All cookies have been cleared.')
    }
  }
}
</script>

<style>
.settings {
  font-size: 17pt;
  margin-right: 20px;
  list-style-type: none;
}
.popover {
  background-color: #f5f5f5 !important;
}
.settings-panel {
  padding: 1rem;
  background: #ffffff;
  border-radius: 4px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}
.version {
  font-size: small;
  font-variant: small-caps;
}
</style>
