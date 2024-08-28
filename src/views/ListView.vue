<template>
  <div class="list">
    <h1>The list view</h1>
    <ul>
      <li v-for="vehicle in vehicles">
        <div>ID: {{ vehicle.vehicle_id }}</div>
        <div>Cost GE: {{ vehicle.vehicleCostGe }}</div>
        <div>Cost SL: {{ vehicle.vehicleCostSL }}</div>
        <div>List option: {{ vehicle.listOption }}</div>
      </li>
    </ul>
    <button @click="clearList">Clear list</button>
  </div>
</template>
<script>
export default {
  data() {
    return {
      vehicles: []
    }
  },
  mounted() {
    // Session storage-ból tömb lekérése
    this.vehicles = JSON.parse(sessionStorage.getItem('vehicleData') || '[]')
    console.log(this.vehicles)
  },
  methods: {
    clearList() {
      this.vehicles = []
      sessionStorage.removeItem('vehicleData')
      console.log('List cleared:', this.vehicles)
    }
  }
}
</script>

<style>
@media (min-width: 1024px) {
  .list {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}
</style>
