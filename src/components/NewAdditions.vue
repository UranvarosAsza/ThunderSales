<template>
  <!--<button label="Show" @click="visible = true">New additions</button> -->
  <div>
    <Dialog v-model:visible="visible" modal header="Changelog" :style="{ width: '50rem' }">
      <div class="flex justify-center">
        <div v-for="patch in patchNotes" :key="patch.version">
          <h2>{{ patch.version }} - {{ patch.date }}</h2>
          <ul>
            <li v-for="note in patch.notes[selectedLanguage]" :key="note">{{ note }}</li>
          </ul>
        </div>
      </div>
    </Dialog>
  </div>
</template>

<script>
import Dialog from 'primevue/dialog'
import patchNotes from '@/assets/patchnotes.json'

export default {
  components: {
    // eslint-disable-next-line vue/no-reserved-component-names
    Dialog
  },
  data() {
    return {
      //lehet nem kéne fixen popupolni
      visible: true,
      patchNotes,
      selectedLanguage: 'en' //
    }
  },
  methods: {
    //  selectedLanguage-alapján váltsa
  }
}
</script>

<style scoped>
.newsCard {
}
</style>
