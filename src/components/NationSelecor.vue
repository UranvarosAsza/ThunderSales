<template class="background">
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
      <option value="Ship">Ship</option>
    </select>
  </nav>

  <p>Search params: {{ nation }}; {{ branch }}</p>
  <button @click="getVehicles">Get vehicles</button>
  <p v-if="vehicleEras.length">The number of ranks in this search: {{ vehicleEras.length }}</p>
  <!-- <div v-if="vehicles.length">
    <div v-for="vehicle in vehicles" :key="vehicle.identifier" class="vehicle">
      <div>Name: {{ vehicle.identifier }}</div>
      <div>Rank: {{ vehicle.era }}</div>
    </div>
  </div> -->
  <div>Ranks</div>
  <div v-for="vehicleEra in vehicleEras">
    <div>
      <VehicleRanks :nation="nation" :rank="vehicleEra" :branch="branch" />
    </div>
  </div>
</template>

<script lang="ts">
import VehicleRanks from '../components/VehicleRanks.vue'

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
          // console.log('fighter, assault, bomber')

          fetch(
            'https://www.wtvehiclesapi.sgambe.serv00.net/api/vehicles?' +
              'country=' +
              this.nation +
              '&type=fighter' +
              '&type=assault' +
              '&type=bomber'
          )
            .then((res) => res.json())
            .then((data) => {
              this.vehicleEras = Array.from(new Set(data.map((item) => item.era)))
              this.vehicleEras.sort()
              // console.log(this.vehicleEras)
            })
            .catch((err) => console.log(err.message))

          break
        case 'heli':
          //console.log('attack_helicopter, utility_helicopter')
          fetch(
            'https://www.wtvehiclesapi.sgambe.serv00.net/api/vehicles?' +
              'country=' +
              this.nation +
              '&type=attack_helicopter' +
              '&type=utility_helicopter'
          )
            .then((res) => res.json())
            .then((data) => {
              this.vehicleEras = Array.from(new Set(data.map((item) => item.era)))
              this.vehicleEras.sort()
              //console.log(this.vehicleEras)
            })
            .catch((err) => console.log(err.message))

          break
        case 'ground':
          // console.log('light_tank, medium_tank, heavy_tank, tank_destroyer, spaa')
          fetch(
            'https://www.wtvehiclesapi.sgambe.serv00.net/api/vehicles?' +
              'country=' +
              this.nation +
              '&type=light_tank' +
              '&type=medium_tank' +
              '&type=heavy_tank' +
              '&type=tank_destroyer' +
              '&type=spaa'
          )
            .then((res) => res.json())
            .then((data) => {
              this.vehicleEras = Array.from(new Set(data.map((item) => item.era)))
              this.vehicleEras.sort()
              //console.log(this.vehicleEras)
            })
            .catch((err) => console.log(err.message))

          break
        case 'boat':
          //console.log('ship, light_cruiser, boat, heavy_boat, barge')
          fetch(
            'https://www.wtvehiclesapi.sgambe.serv00.net/api/vehicles?' +
              'country=' +
              this.nation +
              '&type=ship' +
              '&type=light_cruiser' +
              '&type=heavy_boat' +
              '&type=barge'
          )
            .then((res) => res.json())
            .then((data) => {
              this.vehicleEras = Array.from(new Set(data.map((item) => item.era)))
              this.vehicleEras.sort()
              //console.log(this.vehicleEras)
            })
            .catch((err) => console.log(err.message))

          break
        case 'ship':
          //console.log('destroyer, frigate, heavy_cruiser, battlecruiser, battleship')
          fetch(
            'https://www.wtvehiclesapi.sgambe.serv00.net/api/vehicles?' +
              'country=' +
              this.nation +
              '&type=destroyer' +
              '&type=frigate' +
              '&type=heavy_cruiser' +
              '&type=battlecruiser' +
              '&type=battleship'
          )
            .then((res) => res.json())
            .then((data) => {
              this.vehicleEras = Array.from(new Set(data.map((item) => item.era)))
              this.vehicleEras.sort()
              // console.log(this.vehicleEras)
            })
            .catch((err) => console.log(err.message))

          break
        default:
          console.log('default')
      }
      //Filter by vehicle type|| tank, lbv, mbv, hbv, exoskeleton,submarine ????
    }
  }
}
</script>

<style scoped>
.background {
  background-color: rgb(116, 115, 115);
}
</style>
