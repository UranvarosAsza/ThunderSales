<template>
  <tr>
    <td>Name: {{ vehicle.vehicle_id }}</td>
    <td>{{ vehicle.nation }}</td>
    <td>
      Your total is: {{ totalPrice.toLocaleString('hu-HU') }}
      <button @click="toggleInfoBox" class="tooltip">
        i
        <span class="tooltiptext">details</span>
      </button>
      <span v-if="showInfoBox" class="info-box">{{ infoText }}</span>
      <button class="edit" @click="showHideModify">Modify</button>
      <select v-if="showModify" v-model="selectedListOption">
        <option value="vehicleCost">Vehicle Cost</option>
        <option value="basicCrew">Basic Crew</option>
        <option value="expertCrew">Expert Crew</option>
      </select>
      <button class="remove" @click="removeFromList">Remove</button>
    </td>
  </tr>
</template>

<script>
import { watch } from 'vue'

export default {
  props: {
    vehicle: Object
  },
  data() {
    return {
      selectedListOption: '',
      totalPrice: 0,
      showInfoBox: false,
      infoText: '',
      showModify: false
    }
  },
  watch: {
    selectedListOption: 'computeSelectedPrice'
  },
  mounted() {
    this.selectedListOption = this.vehicle.listOption
    this.computeSelectedPrice()
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
            this.infoText =
              'Calculated as: vehicle cost: ' +
              this.vehicle.vehicleCostSL +
              ' basic crew cost: ' +
              this.vehicle.basicCrewTrainingCost +
              ' expert crew cost: ' +
              this.vehicle.exptertCrewTrtainigCost
          } else {
            this.totalPrice =
              this.vehicle.basicCrewTrainingCost + this.vehicle.exptertCrewTrtainigCost
            this.infoText =
              'Calculated as:' +
              ' basic crew cost: ' +
              this.vehicle.basicCrewTrainingCost +
              ' expert crew cost: ' +
              this.vehicle.exptertCrewTrtainigCost
          }
          break
        case 'basicCrew':
          if (this.vehicle.vehicleCostSL) {
            this.totalPrice = this.vehicle.basicCrewTrainingCost + this.vehicle.vehicleCostSL
            this.infoText =
              'Calculated as: vehicle cost: ' +
              this.vehicle.vehicleCostSL +
              ' basic crew cost: ' +
              this.vehicle.basicCrewTrainingCost
          } else {
            this.totalPrice = this.vehicle.basicCrewTrainingCost
            this.infoText =
              'Calculated as:' + ' basic crew cost: ' + this.vehicle.basicCrewTrainingCost
          }
          break
        case 'vehicleCost':
          if (this.vehicle.vehicleCostSL) {
            this.totalPrice = this.vehicle.vehicleCostSL
            this.infoText = 'Calculated as: vehicle cost: ' + this.vehicle.vehicleCostSL
          } else {
            this.totalPrice = 0
            this.infoText = 'Calculated as:' + '(vehicle cost is in Ge or free (reserve))'
          }
          break
        default:
          console.log('No valid list option selected')
      }

      this.$emit('price-updated', this.totalPrice, this.vehicle.vehicle_id)
    },
    removeFromList() {
      let vehicles = JSON.parse(sessionStorage.getItem('vehicleData') || '[]')
      vehicles = vehicles.filter((v) => v.vehicle_id !== this.vehicle.vehicle_id)
      sessionStorage.setItem('vehicleData', JSON.stringify(vehicles))
      this.$emit('vehicleRemoved')
    },

    editListOption() {
      console.log('cica')
    },
    toggleInfoBox() {
      this.showInfoBox = !this.showInfoBox
    },
    showHideModify() {
      this.showModify = !this.showModify
    }
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
.info-box {
  display: inline-block;
  background-color: #eee;
  padding: 5px;
  margin-left: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
}
.tooltip {
  position: relative;
  display: inline-block;
  border-bottom: 1px dotted black;
}

.tooltip .tooltiptext {
  visibility: hidden;
  background-color: rgba(0, 0, 0, 0.638);
  color: #fff;
  text-align: center;
  border-radius: 6px;
  padding: 5px 0;
  position: absolute;
  z-index: 1;
  margin-left: -60px;
  width: 120px;
  bottom: 100%;
  left: 50%;
  margin-left: -60px;
}

.tooltip .tooltiptext::after {
  content: ' ';
  position: absolute;
  top: 100%; /* At the bottom of the tooltip */
  left: 50%;
  margin-left: -5px;
  border-width: 5px;
  border-style: solid;
  border-color: black transparent transparent transparent;
}

.tooltip:hover .tooltiptext {
  visibility: visible;
}
select {
  display: inline-block;
}
</style>
