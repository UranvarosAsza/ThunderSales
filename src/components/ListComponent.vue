<template>
  <div class="list-container">
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
          v-for="vehicle in vehicles"
          :vehicle="vehicle"
          :key="vehicle.vehicle_id"
          @vehicleRemoved="updateList"
          @price-updated="updateTotalPrice"
        />
      </tbody>
    </table>
    <button @click="clearList">Clear list</button>
    <h2>Total Price of All Vehicles: {{ grandTotal.toLocaleString('hu-HU') }} Sl</h2>
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
          You need to save {{ grandTotalDiscount.toLocaleString('hu-HU') }} Sl for a
          {{ discount * 100 }}% sale
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
      vehicles: [],
      grandTotal: 0,
      discount: null,
      grandTotalDiscount: null
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
      this.vehicles = JSON.parse(sessionStorage.getItem('vehicleData') || '[]')
    },
    updateTotalPrice(newPrice, vehicleId) {
      const vehicle = this.vehicles.find((v) => v.vehicle_id === vehicleId)
      if (vehicle) {
        vehicle.totalPrice = newPrice
        this.calculateGrandTotal()
      }
    },
    calculateGrandTotal() {
      this.grandTotal = this.vehicles.reduce((total, vehicle) => {
        return total + (vehicle.totalPrice || 0)
      }, 0)
    },

    clearList() {
      this.vehicles = []
      sessionStorage.setItem('vehicleData', JSON.stringify([]))
      this.grandTotal = 0 // Reset grand total when list is cleared
    },
    updateList() {
      this.loadVehicles()
      this.calculateGrandTotal() // Recalculate total after removing a vehicle
    },
    calculateDiscountedPrice() {
      if (this.discount != null) {
        this.grandTotalDiscount = this.grandTotal * (1 - this.discount)
      } else {
        toast.error('Please select a discount percentage!')
      }
    }
  }
}
</script>

<style scoped>
.list-container h1 {
  color: black;
}
.list-container {
  max-width: 90%;
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
.discount {
  display: inline;
}
</style>
