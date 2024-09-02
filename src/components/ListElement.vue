<template>
  <tr>
    <td>Vehicle: {{ vehicle.vehicle_id }}</td>
    <td>Cost GE: {{ vehicle.vehicleCostGe }}</td>
    <td>Cost SL: {{ vehicle.vehicleCostSL }}</td>
    <td>
      List option: {{ vehicle.listOption }},Baisc crew: {{ vehicle.basicCrewTrainingCost }} Sl,
      Expert crew: {{ vehicle.exptertCrewTrtainigCost }} Sl, Ace crew:
      {{ vehicle.aceCrewTrainingCost }} GE
    </td>
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
