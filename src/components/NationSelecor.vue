<template>
  <div class="nationSelector">
    <nav>
      <label>Select nation: </label>
      <select v-model="nation">
        <option v-for="(nationData, nationKey) in nations" :key="nationKey" :value="nationKey">
          {{ nationKey.toUpperCase() }}
        </option>
      </select>

      <label>Select branch: </label>
      <select v-model="branch">
        <option v-for="branchName in filteredBranches" :key="branchName" :value="branchName">
          {{ branchName.charAt(0).toUpperCase() + branchName.slice(1) }}
        </option>
      </select>
    </nav>

    <div v-if="vehicleEras.length">
      <div v-for="vehicleEra in vehicleEras" :key="vehicleEra">
        <div>
          <VehicleRanks :nation="nation" :rank="vehicleEra" :branch="branch" />
        </div>
      </div>
    </div>
    <div v-else class="noVehicles">
      <h2>Please select a nation and a branch to start</h2>
    </div>
  </div>
</template>

<script lang="ts">
// @ts-ignore
import VehicleRanks from '@/components/VehicleRanks.vue'
import apiParams from '@/assets/apiParams.json'
import nationJson from '@/assets/nations.json'

export default {
  components: {
    VehicleRanks
  },

  data() {
    return {
      branch: sessionStorage.getItem('branch') || '',
      nation: sessionStorage.getItem('nation') || '',
      vehicles: [],
      vehicleEras: [],
      nations: nationJson, // JSON-ból származó adatok
      selectedNationBranches: {} // Az adott nemzet ágazatai
    }
  },
  computed: {
    filteredBranches() {
      // Ha nincs kiválasztva nemzet, vagy a nemzet nem található a JSON-ban, üres tömböt adunk vissza
      //@ts-ignore
      if (!this.nation || !this.nations[this.nation]) {
        return []
      }

      // A nemzet ágazatai, csak a true értékű ágazatok listázása
      //@ts-ignore
      const branches = this.nations[this.nation].branches
      return Object.keys(branches).filter((branch) => branches[branch])
    }
  },
  watch: {
    branch(newBranch) {
      sessionStorage.setItem('branch', newBranch)
      this.getVehicles()
    },
    nation(newNation) {
      sessionStorage.setItem('nation', newNation)
      this.getVehicles()
    }
  },
  mounted() {
    if (this.nation) {
      this.getVehicles()
    }
  },
  methods: {
    getVehicles() {
      if (!this.nation || !this.branch) return

      let apiUrl = ''

      switch (this.branch) {
        case 'air':
          apiUrl = apiParams.url + this.nation + apiParams.air
          break
        case 'heli':
          apiUrl = apiParams.url + this.nation + apiParams.heli
          break
        case 'ground':
          apiUrl = apiParams.url + this.nation + apiParams.ground
          break
        case 'boat':
          apiUrl = apiParams.url + this.nation + apiParams.boat
          break
        case 'ship':
          apiUrl = apiParams.url + this.nation + apiParams.ship
          break
        default:
          console.log('Invalid branch:', this.branch)
          return
      }

      fetch(apiUrl)
        .then((res) => res.json())
        .then((data) => {
          //@ts-ignore
          this.vehicleEras = Array.from(new Set(data.map((item) => item.era)))
          this.vehicleEras.sort()
        })
        .catch((err) => console.log(err.message))
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
  border-bottom-left-radius: 10px !important;
  border-bottom-right-radius: 10px !important;
}

select,
button {
  font-size: 16px;
  padding: 8px 12px;
  margin: 0 10px;
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
.noVehicles {
  margin-top: 30px;
  text-align: center;
  min-height: 40em;
}
</style>
