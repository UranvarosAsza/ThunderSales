<template>
  <tr>
    <td>Name: {{ vehicle.vehicle_id }}</td>
    <td>{{ vehicle.nation }}</td>
    <td>
      Your total is: {{ totalPrice }}
      <!--
       L.O.: {{ vehicle.listOption }},Basic:
      {{ vehicle.basicCrewTrainingCost }} Sl, Expert: {{ vehicle.exptertCrewTrtainigCost }} Sl, Ace:
      {{ vehicle.aceCrewTrainingCost }} GE
     -->
      <button class="edit">Modify</button>

      <button class="remove" @click="removeFromList">Remove</button>
    </td>
  </tr>
</template>

<script>
export default {
  props: {
    vehicle: Object
  },
  data() {
    return {
      selectedListOption: '',
      totalPrice: 0
    }
  },
  mounted() {
    this.selectedListOption = this.vehicle.listOption
    this.computeSelectedPrice()
    // listOption alapján elágaztatjuk, lehet a list opion watch..
    //computeSelectedPrice(this.selectedListOption)
  },
  methods: {
    computeSelectedPrice() {
      switch (this.selectedListOption) {
        case 'expertCrew':
          if (this.vehicle.vehicleCostSL) {
            this.totalPrice =
              this.vehicle.basicCrewTrainingCost +
              this.vehicle.exptertCrewTrtainigCost +
              this.vehicle.vehicleCostSL
          } else {
            this.totalPrice =
              this.vehicle.basicCrewTrainingCost + this.vehicle.exptertCrewTrtainigCost
          }
          break
        case 'basicCrew':
          if (this.vehicle.vehicleCostSL) {
            this.totalPrice = this.vehicle.basicCrewTrainingCost + this.vehicle.vehicleCostSL
          } else {
            this.totalPrice = this.vehicle.basicCrewTrainingCost
          }
          break
        case 'vehicleCost':
          if (this.vehicle.vehicleCostSL) {
            this.totalPrice = this.vehicle.vehicleCostSL
          } else {
            this.totalPrice = 0
          }
          break
        default:
          console.log('No valid list option selected')
      }
    },
    removeFromList() {
      let vehicles = JSON.parse(sessionStorage.getItem('vehicleData') || '[]')
      vehicles = vehicles.filter((v) => v.vehicle_id !== this.vehicle.vehicle_id)
      sessionStorage.setItem('vehicleData', JSON.stringify(vehicles))
      this.$emit('vehicleRemoved')
    } /*
    computeSelectedPrice() {
      //Your total is: totalPrice (?) - details-es hover
      console.log('selectedlistOption1' + this.selectedListOption)
      switch (this.selectedListOption) {
        case 'expertCrew':
          // expert + basic + vehicle cost
          if (this.vehicle.vehicleCostSL) {
            //ha ez nem null akkor nem goldos
            this.totalPrice =
              vehicle.basicCrewTrainingCost +
              vehicle.exptertCrewTrtainigCost +
              vehicle.vehicleCostSL
          } else {
            this.totalPrice = vehicle.basicCrewTrainingCost + vehicle.exptertCrewTrtainigCost
          }

          break
        case 'basicCrew':
          if (vehicle.vehicleCostSL) {
            this.totalPrice = vehicle.basicCrewTrainingCost + vehicle.vehicleCostSL
          } else {
            this.totalPrice = vehicle.basicCrewTrainingCost
          }
          // basic + vehicle cost
          break
        case 'vehicleCost':
          if (vehicle.vehicleCostSL) {
            this.totalPrice = vehicle.vehicleCostSL
          } else {
            this.totalPrice = 0
          }
          // vehicle cost
          break

        default:
          return 'cica'
      }
      console.log('selectedlistOption1' + selectedListOption)
      console.log(totalPrice)
      return
    }
    
    removeFromList(vehicle.vehicle_id){


      //removes the given vehicle from the list
    },
    editListOption(){

    } */
  }
}
</script>

<style>
td {
  padding: 10px;
  border: 2px solid #2e4451;
}

.edit:hover {
  background-color: rgb(88, 218, 71);
}
.remove:hover {
  background-color: rgba(255, 0, 0, 0.582) !important;
}
</style>
