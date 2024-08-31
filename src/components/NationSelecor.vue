<template>
  <div class="nationSelector">
    <nav>
      <label>Select nation: </label>
      <select v-model="nation">
        <option value="usa">USA</option>
        <option value="germany">GER</option>
        <option value="ussr">USSR</option>
        <option value="britain">GBR</option>
        <option value="china">CHN</option>
        <option value="italy">ITA</option>
        <option value="japan">JPN</option>
        <option value="france">FRA</option>
        <option value="israel">ISR</option>
        <option value="sweden">SWE</option>
      </select>
      <label>Select branch: </label>
      <select v-model="branch">
        <option value="air">Air</option>
        <option value="heli">Heli</option>
        <option value="ground">Ground</option>
        <option value="boat">Boat</option>
        <option value="ship">Ship</option>
      </select>
      <button @click="getVehicles">Get vehicles</button>
    </nav>

    <!-- eslint-disable-next-line vue/require-v-for-key-->
    <div v-for="vehicleEra in vehicleEras">
      <div>
        <VehicleRanks :nation="nation" :rank="vehicleEra" :branch="branch" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
// @ts-ignore
import VehicleRanks from '@/components/VehicleRanks.vue'
import apiParams from '@/assets/apiParams.json'

export default {
  components: {
    VehicleRanks
  },

  data() {
    return {
      branch: '',
      nation: '',
      vehicles: [],
      vehicleEras: [],
      uniqueVehicleEras: []
    }
  },
  methods: {
    getVehicles() {
      //TODO amint változik a keresési paraméter (nation, branch) akkor ki kell üríteni a vehicleEras tömböt
      switch (this.branch) {
        case 'air':
          fetch(
            'https://www.wtvehiclesapi.sgambe.serv00.net/api/vehicles?' +
              'country=' +
              this.nation +
              apiParams.air
          )
            .then((res) => res.json())
            .then((data) => {
              // @ts-ignore
              this.vehicleEras = Array.from(new Set(data.map((item) => item.era)))
              this.vehicleEras.sort()
            })
            .catch((err) => console.log(err.message))

          break
        case 'heli':
          fetch(
            'https://www.wtvehiclesapi.sgambe.serv00.net/api/vehicles?' +
              'country=' +
              this.nation +
              apiParams.heli
          )
            .then((res) => res.json())
            .then((data) => {
              // @ts-ignore
              this.vehicleEras = Array.from(new Set(data.map((item) => item.era)))
              this.vehicleEras.sort()
            })
            .catch((err) => console.log(err.message))

          break
        case 'ground':
          fetch(
            'https://www.wtvehiclesapi.sgambe.serv00.net/api/vehicles?' +
              'country=' +
              this.nation +
              apiParams.ground
          )
            .then((res) => res.json())
            .then((data) => {
              // @ts-ignore
              this.vehicleEras = Array.from(new Set(data.map((item) => item.era)))
              this.vehicleEras.sort()
            })
            .catch((err) => console.log(err.message))

          break
        case 'boat':
          fetch(
            'https://www.wtvehiclesapi.sgambe.serv00.net/api/vehicles?' +
              'country=' +
              this.nation +
              apiParams.boat
          )
            .then((res) => res.json())
            .then((data) => {
              // @ts-ignore
              this.vehicleEras = Array.from(new Set(data.map((item) => item.era)))
              this.vehicleEras.sort()
            })
            .catch((err) => console.log(err.message))

          break
        case 'ship':
          fetch(
            'https://www.wtvehiclesapi.sgambe.serv00.net/api/vehicles?' +
              'country=' +
              this.nation +
              apiParams.ship
          )
            .then((res) => res.json())
            .then((data) => {
              // @ts-ignore
              this.vehicleEras = Array.from(new Set(data.map((item) => item.era)))
              this.vehicleEras.sort()
            })
            .catch((err) => console.log(err.message))

          break
        default:
          console.log(this.branch)
          console.log('default')
      }
      //Filter by vehicle type|| tank, lbv, mbv, hbv, exoskeleton,submarine ????
    }
  }
}
</script>

<style>
.nationSelector {
  margin: 0 auto;
  padding: 20px;
  color: white;
  font-size: 25px;
  background-color: #2e4451;
}

select,
button {
  font-size: 16px;
  padding: 8px 12px;
  margin: 0 5px;
  border-radius: 4px;
  border: 1px solid #ccc;
  background-color: #fff;
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1);
}

nav {
  font-size: 18px;
  font-weight: bold;
  padding: 10px 20px;
  background-color: #242e33;
  color: #fff;
  border-radius: 5px;
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.3);
}

.header {
  font-size: 24px;
  font-weight: bold;
  text-align: center;
  padding: 20px;
  color: #fff;
}
</style>
