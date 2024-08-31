<template>
  <div class="list">
    <ListComponent />
  </div>
</template>
<script>
import ListComponent from '@/components/ListComponent.vue'

export default {
  components: {
    ListComponent
  },
  data() {
    return {}
  }
}
</script>

<style scoped>
.list {
  margin: auto;
  background-color: #2e4451;
  height: 75em;
}
.list h1 {
  font-size: 30pt;
  font-weight: 600;
  margin: auto;
  text-align: center;
}
</style>
