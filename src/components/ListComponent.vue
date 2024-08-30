<template>
  <div class="list-container">
    <h1>Here is your list:</h1>
    <table class="vehicle-table">
      <thead>
        <tr>
          <th>Vehicle</th>
          <th>Cost GE</th>
          <th>Cost SL</th>
          <th>List option</th>
        </tr>
      </thead>
      <tbody>
        <ListElement v-for="vehicle in vehicles" :vehicle="vehicle" :key="vehicle.vehicle_id" />
      </tbody>
    </table>
    <button @click="clearList">Clear list</button>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import ListElement from './ListElement.vue'

export default {
  components: {
    ListElement
  },
  setup() {
    const vehicles = ref([])

    onMounted(() => {
      vehicles.value = JSON.parse(sessionStorage.getItem('vehicleData') || '[]')
    })

    const clearList = () => {
      vehicles.value = []
      sessionStorage.setItem('vehicleData', JSON.stringify([]))
    }

    return {
      vehicles,
      clearList
    }
  }
}
</script>

<style scoped>
.list-container h1 {
  color: black;
}
.list-container {
  max-width: 80%;
  margin: 0 auto;
  padding: 20px;
  background-color: #f5f5f5;
  border-radius: 8px;
}

.vehicle-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
}

.vehicle-table th,
.vehicle-table td {
  border: 2px solid #2e4451;
  padding: 10px;
  text-align: left;
}

.vehicle-table th {
  background-color: #2e4451;
  color: #ffffff;
}

.vehicle-table td {
  background-color: #dbe4ff;
}

button {
  padding: 10px 20px;
  background-color: #2e4451;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

button:hover {
  background-color: #22323b;
}
</style>
