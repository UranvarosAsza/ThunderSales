<template>
  <tr>
    <td>Vehicle: {{ vehicle.vehicle_id }}</td>
    <td>Cost GE: {{ vehicle.vehicleCostGe }}</td>
    <td>Cost SL: {{ vehicle.vehicleCostSL }}</td>
    <td>List option: {{ vehicle.listOption }}</td>
  </tr>
</template>

<script>
export default {
  props: {
    vehicle: Object
  }
}
</script>

<style scoped>
td {
  padding: 10px;
  border: 2px solid #2e4451;
}
</style>
