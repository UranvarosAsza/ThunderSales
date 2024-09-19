<template>
  <tr>
    <td>{{ vehicle.longName }}</td>
    <td>{{ vehicle.nation }}</td>
    <td>
      Your total is: {{ totalPrice.toLocaleString('hu-HU') }}
      <button @click="toggleInfoBox" class="my-tooltip">
        i
        <span class="my-tooltiptext">details</span>
      </button>
      <span v-if="showInfoBox" class="my-info-box">{{ infoText }}</span>
      <button class="edit" @click="showHideModify">Modify</button>
      <select v-if="showModify" v-model="selectedListOption">
        <option value="vehicleCost">Vehicle Cost</option>
        <option value="basicCrew">Basic Crew</option>
        <option value="expertCrew">Expert Crew</option>
      </select>
      <button class="remove" @click="removeFromList">Remove</button>
      <span
        :class="[
          'vehicle-type-label',
          vehicle.vehicleType === 'TT' ? 'vehicle-tt' : '',
          vehicle.vehicleType === 'SQ' ? 'vehicle-sq' : '',
          vehicle.vehicleType === 'PR' ? 'vehicle-pr' : ''
        ]"
      >
        {{ vehicle.vehicleType }}
      </span>
      <div class="my-tooltip explanationMark" v-if="this.saleText">
        !<span class="my-tooltiptext_long"> {{ this.saleText }}</span>
      </div>
    </td>
  </tr>
</template>

<script>
import updates from '@/assets/updates.json'

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
      saleText: '',
      showModify: false
    }
  },
  watch: {
    selectedListOption(newOption) {
      //FIXME
      // eslint-disable-next-line vue/no-mutating-props
      this.vehicle.listOption = newOption
      this.computeSelectedPrice()
      this.updateVehicle()
    }
  },
  mounted() {
    this.selectedListOption = this.vehicle.listOption
    this.computeSelectedPrice()
    this.setSaleText()
  },
  methods: {
    updateVehicle() {
      let vehicles = JSON.parse(sessionStorage.getItem('vehicleData') || '[]')
      const vehicleIndex = vehicles.findIndex((v) => v.vehicle_id === this.vehicle.vehicle_id)

      if (vehicleIndex !== -1) {
        vehicles[vehicleIndex] = this.vehicle
        sessionStorage.setItem('vehicleData', JSON.stringify(vehicles))
      }

      // Emit the updated price after saving the changes
      this.$emit('price-updated', {
        vehicleTotal: this.totalPrice,
        vehicleGoldPrice: this.vehicle.gePrice,
        vehiclePrice: this.totalPrice,
        basicCrewPrice: this.vehicle.basicCrewTrainingCost,
        expertCrewPrice: this.vehicle.exptertCrewTrtainigCost,
        vehicleId: this.vehicle.vehicle_id,
        selectedOption: this.selectedListOption,
        vehicleType: this.vehicle.vehicleType
      })
    },
    computeSelectedPrice() {
      switch (this.selectedListOption) {
        case 'expertCrew':
          this.totalPrice =
            this.vehicle.basicCrewTrainingCost +
            this.vehicle.exptertCrewTrtainigCost +
            (this.vehicle.vehicleCostSL || 0)
          this.infoText = `Calculated as: vehicle cost: ${this.vehicle.vehicleCostSL || 0}, basic crew cost: ${this.vehicle.basicCrewTrainingCost}, expert crew cost: ${this.vehicle.exptertCrewTrtainigCost}`
          break
        case 'basicCrew':
          this.totalPrice = this.vehicle.basicCrewTrainingCost + (this.vehicle.vehicleCostSL || 0)
          this.infoText = `Calculated as: vehicle cost: ${this.vehicle.vehicleCostSL || 0}, basic crew cost: ${this.vehicle.basicCrewTrainingCost}`
          break
        case 'vehicleCost':
          if (this.vehicle.vehicleCostSL == 0 && this.vehicle.vehicleCostGe) {
            this.infoText = `Calculated as: vehicle cost: ${this.vehicle.vehicleCostGe}Ge`
          } else {
            this.infoText = `Calculated as: vehicle cost: ${this.vehicle.vehicleCostSL || '(vehicle cost is free (reserve))'}`
          }
          this.totalPrice = this.vehicle.vehicleCostSL || 0

          break
        default:
          console.log('No valid list option selected')
      }

      // Esemény kibocsátása egy objektummal
      this.$emit('price-updated', {
        //komponensek: jármű ára, basic crew, expert crew, id, listoption esetleg később talizmán ár,
        vehicleTotal: this.totalPrice,
        vehicleGoldPrice: this.vehicle.gePrice,
        vehiclePrice: this.totalPrice,
        basicCrewPrice: this.vehicle.basicCrewTrainingCost,
        expertCrewPrice: this.vehicle.exptertCrewTrtainigCost,
        vehicleId: this.vehicle.vehicle_id,
        selectedOption: this.selectedListOption,
        vehicleType: this.vehicle.vehicleType
      })
    },

    removeFromList() {
      let vehicles = JSON.parse(sessionStorage.getItem('vehicleData') || '[]')
      vehicles = vehicles.filter((v) => v.vehicle_id !== this.vehicle.vehicle_id)
      sessionStorage.setItem('vehicleData', JSON.stringify(vehicles))
      this.$emit('vehicleRemoved')
    },
    //TODO ezt kitenni a vehicleModel-be és véltozóként adni a vehicle-hez a text-et és az isRemovable-t -> majd gombra tenni azt hogy ezeket ki lehessen szedni ha sórolni akarna
    setSaleText() {
      //ha squdronjármű vagy a dátuma az utolsó 2 patch dátumánál korábbi akkor nem lesz leárazva
      if (this.vehicle.vehicleType == 'SQ') {
        this.saleText = ' This is a squdron vehicle, the discount does not apply'
      } else if (this.vehicle.vehicleAddDate > updates.updates[2].start_date) {
        this.saleText =
          ' This is a new vehicle, only vehicles introduced after ' +
          updates.updates[2].name +
          ' are discounted'
      }
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
.explanationMark {
  font-weight: bold;
  font-size: x-large;
  color: red;
  margin-left: 10px;
}

.longtext {
  width: 500px;
}
.vehicle-type-label {
  display: inline-block;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.8em;
  color: white;
}

.vehicle-tt {
  background-color: #416173; /* Kék háttér */
}

.vehicle-sq {
  background-color: #5c8655; /* Zöld háttér */
}

.vehicle-pr {
  background-color: #7f6c38; /* Arany háttér */
}
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
.my-info-box {
  display: inline-block;
  background-color: #eee;
  padding: 5px;
  margin-left: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
}
.my-tooltip {
  position: relative;
  display: inline-block;
}
.my-tooltip_long {
  position: relative;
  display: inline-block;
}
.my-tooltip .my-tooltiptext {
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
.my-tooltip .my-tooltiptext_long {
  visibility: hidden;
  background-color: rgba(0, 0, 0, 0.638);
  color: #fff;
  font-size: medium;
  text-align: center;
  border-radius: 6px;
  padding: 5px 0;
  position: absolute;
  z-index: 1;
  margin-left: -60px;
  width: 500px;
  bottom: 100%;
  left: 50%;
  margin-left: -60px;
}

.my-tooltip .my-tooltiptext::after {
  content: ' ';
  position: absolute;
  top: 100%; /* At the bottom of the tooltip */
  left: 50%;
  margin-left: -5px;
  border-width: 5px;
  border-style: solid;
  border-color: black transparent transparent transparent;
}
.my-tooltip .my-tooltiptext_long::after {
  content: ' ';
  position: absolute;
  top: 100%; /* At the bottom of the tooltip */
  left: 12%;
  margin-left: -5px;
  border-width: 5px;
  border-style: solid;
  border-color: black transparent transparent transparent;
}

.my-tooltip:hover .my-tooltiptext {
  visibility: visible;
}
.my-tooltip:hover .my-tooltiptext_long {
  visibility: visible;
}
select {
  display: inline-block;
}
.discountError {
  background-color: salmon;
  font-weight: bolder;
  color: white;
}
</style>
