import Vue3Toastify from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
// @ts-ignore
import Papa from 'papaparse'
// @ts-ignore
import units from '@/assets/units.csv'
import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
import './assets/main.css'
import PrimeVue from 'primevue/config'
import Aura from '@primevue/themes/aura'
import Tooltip from 'primevue/tooltip'
import 'primeicons/primeicons.css'

const app = createApp(App)

if (!sessionStorage.getItem('parsedCSVData')) {
  // Betöltjük és feldolgozzuk a CSV-t
  fetch(units)
    .then((response) => response.text())
    .then((csvText) => {
      const config = {
        delimiter: ';', // Auto-detect
        newline: '', // Auto-detect
        quoteChar: '"',
        escapeChar: '"',
        header: true,
        skipFirstNLines: 870
      }

      //@ts-ignore
      const parsedData = Papa.parse(csvText, config)
      //FIXME átírni a változóneveket hogy legyen egy név meg egy hosszú név,
      //FIXME nem a _1 kell hanem a _0 végü
      // Feldolgozott adatokat alakítsuk kulcs-érték párokká
      //const keyValuePairs: Record<string, string> = {}
      const keyValuePairs: Record<string, { english: string; french: string }> = {}

      //@ts-ignore
      parsedData.data.forEach((row: any) => {
        const id = row['<ID|readonly|noverify>']
        const englishValue = row['<English>']
        const frenchValue = row['<French>']

        // Csak a "_shop" vagy "_1" végződésű kulcsokat mentjük el
        if (id && (id.endsWith('_shop') || id.endsWith('_0'))) {
          keyValuePairs[id] = {
            english: englishValue,
            french: frenchValue
          }
        }
      })

      // Ellenőrizzük, hogy az adatok mérete belefér-e a sessionStorage limitbe
      const keyValuePairsJSON = JSON.stringify(keyValuePairs)

      if (keyValuePairsJSON.length < 5 * 1024 * 1024) {
        // 5MB korlát
        sessionStorage.setItem('parsedCSVData', keyValuePairsJSON)
        console.log('parsedCSVData had been saved')
        //console.log('Parsed key-value pairs: ', keyValuePairs)
      } else {
        console.warn(
          'A CSV fájl (key-value párok) feldolgozott adata túl nagy a sessionStorage-hoz!'
        )
      }
    })
    .catch((err) => console.error('Error loading CSV:', err))
}

app.use(router)
app.use(Vue3Toastify, {
  autoClose: 3000, // az automatikus bezárási idő beállítása (példa: 3000 ms)
  position: 'bottom-center', // pozíció beállítása (példa: jobb felső sarok)
  transition: 'slide'
})
app.directive('tooltip', Tooltip)
app.mount('#app')
//@ts-ignore
app.use(Papa)
//app.use(PrimeVue, { unstyled: true });
app.use(PrimeVue, {
  theme: {
    preset: Aura,
    options: {
      prefix: 'p',
      darkModeSelector: 'light',
      cssLayer: false
    }
  }
})
