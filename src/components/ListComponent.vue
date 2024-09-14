<template>
  <div class="container--fluid list-container">
    <h1>Here is your list:</h1>
    <table class="vehicle-table">
      <thead>
        <tr>
          <th>Vehicle</th>
          <th>Nation</th>
          <th>List option</th>
        </tr>
      </thead>
      <tbody>
        <ListElement
          v-for="vehicle in vehiclesPrices"
          :vehicle="vehicle"
          :key="vehicle.vehicle_id"
          @vehicleRemoved="updateList"
          @price-updated="updateTotalPrice"
        />
      </tbody>
    </table>
    <button @click="clearList">Clear list</button>
    <h2>
      Total Price of All Vehicles:
      <span v-if="grandTotal">{{ grandTotal.toLocaleString('hu-HU') }} Sl </span>
      <span v-if="goldTotal">and {{ goldTotal.toLocaleString('hu-HU') }} GE</span>
    </h2>
    <div class="discount">
      <button @click="calculateDiscountedPrice(discount)">Calculate</button>
      <label>
        <input type="radio" v-model="discount" value="0.3" />
        30%
      </label>
      <label>
        <input type="radio" v-model="discount" value="0.5" />
        50%
      </label>
      <div v-if="grandTotalDiscount">
        <h1>
          You need to save {{ grandTotalDiscount.toLocaleString('hu-HU') }} Sl
          <span v-if="grandTotalGeDiscount">
            and {{ grandTotalGeDiscount.toLocaleString('hu-HU') }} GE
          </span>
          for a {{ discount * 100 }}% sale
        </h1>
      </div>
    </div>
  </div>
</template>

<script>
import ListElement from './ListElement.vue'
import { toast } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'

export default {
  components: {
    ListElement
  },
  data() {
    return {
      vehiclesPrices: [],
      grandTotal: 0,
      goldTotal: 0,
      discount: null,
      grandTotalDiscount: null,
      grandTotalGeDiscount: null,
      techTreeVehicleTotal: 0, //nem lehet benne a squadronjármű-ár és a prém-jármű ár
      crewsAndSquadronVehiclePrices: 0
    }
  },
  watch: {
    vehicles: {
      handler(newVehicles) {
        sessionStorage.setItem('vehicleData', JSON.stringify(newVehicles))
        this.calculateGrandTotal()
      },
      deep: true
    },
    discount(newDiscount) {
      this.calculateDiscountedPrice()
    }
  },
  mounted() {
    this.loadVehicles()
    this.calculateGrandTotal() // Ensure total is correct on load
  },
  methods: {
    loadVehicles() {
      this.vehiclesPrices = JSON.parse(sessionStorage.getItem('vehicleData') || '[]')
    },
    updateTotalPrice(vehicleData) {
      const vehicle = this.vehiclesPrices.find((v) => v.vehicle_id === vehicleData.vehicleId)
      if (vehicle) {
        // Frissítjük a jármű adatait a JSON alapján
        vehicle.vehicleTotal = vehicleData.vehicleTotal
        vehicle.vehicleGoldPrice = vehicleData.vehicleGoldPrice
        vehicle.vehiclePrice = vehicleData.vehiclePrice
        vehicle.basicCrewPrice = vehicleData.basicCrewPrice
        vehicle.expertCrewPrice = vehicleData.expertCrewPrice
        vehicle.vehicleId = vehicleData.vehicleId
        vehicle.selectedOption = vehicleData.selectedOption
        vehicle.vehicleType = vehicleData.vehicleType
        this.calculateGrandTotal()
      }
    },
    // kiszámolja az összesített jármű-crew összegeket discount előtt
    calculateGrandTotal() {
      //console.log(this.vehiclesPrices)
      this.techTreeVehicleTotal = 0
      this.crewsAndSquadronVehiclePrices = 0
      this.goldTotal = 0

      this.vehiclesPrices.forEach((vehicle) => {
        //console.log(vehicle)
        switch (vehicle.vehicleType) {
          case 'TT':
            this.techTreeVehicleTotal += vehicle.vehicleCostSL
            break
          case 'SQ':
            this.crewsAndSquadronVehiclePrices += vehicle.vehicleCostSL
            break
          case 'PR':
            this.goldTotal += vehicle.vehicleCostGe
            break
          default:
            toast.error('OOF! (vehicletype)')
            break
        }
        //listoption alapján a crew árak:
        switch (vehicle.listOption) {
          case 'expertCrew':
            this.crewsAndSquadronVehiclePrices += vehicle.basicCrewPrice + vehicle.expertCrewPrice
            //this.infoText = `Calculated as: vehicle cost: ${this.vehicle.vehicleCostSL || 0}, basic crew cost: ${this.vehicle.basicCrewTrainingCost}, expert crew cost: ${this.vehicle.exptertCrewTrtainigCost}`
            break
          case 'basicCrew':
            this.crewsAndSquadronVehiclePrices += vehicle.basicCrewPrice
            //this.infoText = `Calculated as: vehicle cost: ${this.vehicle.vehicleCostSL || 0}, basic crew cost: ${this.vehicle.basicCrewTrainingCost}`
            break
          case 'vehicleCost':
            //vehiclecost már kezelve van fent
            // this.infoText = `Calculated as: vehicle cost: ${this.vehicle.vehicleCostSL || '(vehicle cost is in Ge or free (reserve))'}`
            break
          default:
            console.log('list option error')
            console.log(vehicle.listOption)
        }
      })

      this.grandTotal = this.techTreeVehicleTotal + this.crewsAndSquadronVehiclePrices
    },
    clearList() {
      this.vehiclesPrices = [] //
      sessionStorage.setItem('vehicleData', JSON.stringify([]))
      this.grandTotal = 0 // Reset grand total when list is cleared
      this.goldTotal = 0
    },
    updateList() {
      this.loadVehicles()
      this.calculateGrandTotal() // Recalculate total after removing a vehicle
    },

    calculateDiscountedPrice() {
      if (this.discount === null) {
        toast.error('Please select a discount percentage!')
        return
      }

      this.grandTotalDiscount =
        this.techTreeVehicleTotal * (1 - this.discount) + this.crewsAndSquadronVehiclePrices
      this.grandTotalGeDiscount = this.goldTotal * (1 - this.discount)
    }
  }
}
</script>

<style scoped>
.list-container h1 {
  color: black;
}
.list-container {
  max-width: 1799px;
  margin-top: 30px;
  margin-left: auto;
  margin-right: auto;
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
.discount {
  display: inline;
}
</style>
