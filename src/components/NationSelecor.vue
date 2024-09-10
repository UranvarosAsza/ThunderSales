<template>
  <div class="nationSelector">
    <nav>
      <label>Select a nation:</label>
      <div class="nation-boxes">
        <div
          v-for="(nationData, nationKey) in nations"
          :key="nationKey"
          class="nation-box"
          :class="{ active: nation === nationKey }"
          :style="{
            backgroundImage: `url(${nationData.flag_url})`,
            filter: nation === nationKey ? 'none' : 'grayscale(100%)'
          }"
          @click="selectNation(nationKey)"
        >
          <div class="nation-name">{{ nationData.displayed_name_EN }}</div>
        </div>
      </div>

      <label>Select branch:</label>
      <div class="branch-boxes">
        <div
          v-for="branchName in filteredBranches"
          :key="branchName"
          class="branch-box"
          :class="{ active: branch === branchName }"
          @click="selectBranch(branchName)"
        >
          {{ branchName.charAt(0).toUpperCase() + branchName.slice(1) }}
        </div>
      </div>
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
      nations: nationJson
    }
  },
  computed: {
    filteredBranches() {
      //@ts-ignore
      if (!this.nation || !this.nations[this.nation]) {
        return []
      }
      //@ts-ignore
      const branches = this.nations[this.nation].branches
      return Object.keys(branches).filter((branch) => branches[branch])
    }
  },
  watch: {
    branch(newBranch) {
      sessionStorage.setItem('branch', newBranch) // Tárolás
      this.getVehicles() // Járművek frissítése
    },
    nation(newNation) {
      sessionStorage.setItem('nation', newNation) // Tárolás
      this.getVehicles() // Járművek frissítése
    }
  },
  methods: {
    //@ts-ignore
    selectNation(nationKey) {
      this.nation = nationKey
      sessionStorage.setItem('nation', nationKey)

      // Ellenőrzés, hogy van-e "air" branch, és ha igen, állítsuk be alapértelmezettként
      //@ts-ignore
      if (this.nations[nationKey].branches.air) {
        this.branch = 'air'
        sessionStorage.setItem('branch', 'air')
      } else {
        this.branch = '' // Ha nincs "air", akkor üres
        sessionStorage.removeItem('branch')
      }

      this.getVehicles() // Frissítsük a járműveket is
    },
    //@ts-ignore
    selectBranch(branchName) {
      this.branch = branchName
    },
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
.branch-boxes {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 20px;
}

.branch-box {
  padding: 10px 20px;
  background-color: grey;
  color: white;
  cursor: pointer;
  transition: background-color 0.3s;
  border-radius: 5px;
}

.branch-box.active {
  background-color: #2e4451;
  color: white;
  border: 2px solid white;
}
.nation-boxes {
  display: flex;
  justify-content: center; /* Vízszintes középre igazítás */
  align-items: center; /* Függőleges középre igazítás */
  flex-wrap: wrap;
  gap: 10px;
}

.nation-box {
  width: 160px;
  height: 80px;
  margin-top: 40px;
  margin-bottom: 20px;
  background-size: cover;
  background-position: left top;
  background-origin: border-box;
  background-repeat: no-repeat;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  cursor: pointer;
  position: relative;
  border: 5px solid transparent;
  transition: border-color 0.3s;
}

.nation-box:hover {
  border-color: #d4d1d1;
}

.nation-name {
  position: absolute;
  top: -35px;
  left: 50%;
  transform: translateX(-50%);
  font-weight: bold;
  color: white;
  font-size: 25px;
}
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
label {
  font-size: 25px;
}
</style>
