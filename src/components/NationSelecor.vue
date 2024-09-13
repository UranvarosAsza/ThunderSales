<template>
  <div class="container-fluid nationSelector">
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

      <label v-if="nation">Select branch:</label>
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
//FIXME
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
      //FIXME
      // @ts-ignore
      vehicles: JSON.parse(sessionStorage.getItem('vehicles')) || [], // Visszaállítjuk a mentett jármű adatokat
      //FIXME
      // @ts-ignore
      vehicleEras: JSON.parse(sessionStorage.getItem('vehicleEras')) || [], // Visszaállítjuk a mentett era adatokat
      nations: nationJson
    }
  },
  computed: {
    filteredBranches() {
      //FIXME
      // @ts-ignore
      if (!this.nation || !this.nations[this.nation]) {
        return []
      }
      //FIXME
      // @ts-ignore
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
    //FIXME
    // @ts-ignore
    selectNation(nationKey) {
      this.nation = nationKey
      sessionStorage.setItem('nation', nationKey)

      // Ellenőrizzük, hogy van-e "air" branch, és ha igen, állítsuk be alapértelmezettként
      //FIXME
      //@ts-ignore
      if (this.nations[nationKey].branches.air) {
        this.selectBranch('air') // Most a selectBranch hívjuk meg itt is
      } else {
        this.branch = '' // Ha nincs "air", akkor üres
        sessionStorage.removeItem('branch')
      }

      // Töröljük a tárolt jármű adatokat, ha nemzetet váltunk
      sessionStorage.removeItem('vehicles')
      sessionStorage.removeItem('vehicleEras')
    },
    //FIXME
    // @ts-ignore
    selectBranch(branchName) {
      this.branch = branchName
      sessionStorage.setItem('branch', branchName)

      // Töröljük a jármű adatokat, ha branch-et váltunk
      sessionStorage.removeItem('vehicles')
      sessionStorage.removeItem('vehicleEras')

      this.getVehicles() // Járművek frissítése
    },
    getVehicles() {
      if (!this.nation || !this.branch) return

      // Ellenőrizzük, hogy van-e már elmentett jármű adat

      const storedVehicles = JSON.parse(
        //FIXME
        //@ts-ignore
        sessionStorage.getItem(`vehicles_${this.nation}_${this.branch}`)
      )

      const storedVehicleEras = JSON.parse(
        //FIXME
        //@ts-ignore
        sessionStorage.getItem(`vehicleEras_${this.nation}_${this.branch}`)
      )

      // Ha már elmentettük korábban, visszaolvassuk
      if (storedVehicles && storedVehicleEras) {
        this.vehicles = storedVehicles
        this.vehicleEras = storedVehicleEras
        return
      }

      // Ha nincsenek elmentett adatok, futtassuk le az API hívást
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
          this.vehicles = data
          //FIXME
          //@ts-ignore
          this.vehicleEras = Array.from(new Set(data.map((item) => item.era)))
          this.vehicleEras.sort()

          // Elmentjük a lekért adatokat a sessionStorage-be nemzet+branch alapján
          sessionStorage.setItem(
            `vehicles_${this.nation}_${this.branch}`,
            JSON.stringify(this.vehicles)
          )
          sessionStorage.setItem(
            `vehicleEras_${this.nation}_${this.branch}`,
            JSON.stringify(this.vehicleEras)
          )
        })
        .catch((err) => console.log(err.message))
    }
  },
  mounted() {
    // Visszaállítjuk a kiválasztott nation-t és branch-et a sessionStorage-ból, ha vannak értékek
    const storedNation = sessionStorage.getItem('nation')
    const storedBranch = sessionStorage.getItem('branch')

    if (storedNation) {
      this.nation = storedNation
      // Ellenőrizzük, hogy a nemzet elérhető-e, és frissítjük a branch-et, ha szükséges
      //FIXME
      // @ts-ignore
      if (this.nations[storedNation].branches.air && !storedBranch) {
        this.branch = 'air'
      } else {
        this.branch = storedBranch || '' // Ha nincs tárolva branch, üres marad
      }
    }

    // Frissítjük a jármű adatokat, ha nincsenek elmentve
    this.getVehicles()
  }
}
</script>

<style>
.branch-boxes {
  display: flex;
  justify-content: center;
  align-items: center; /* Ez igazítja középre vertikálisan, ha szükséges */
  flex-wrap: wrap;
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
  min-width: 120px;
  text-align: center;
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
  top: -45px;
  left: 50%;
  transform: translateX(-50%);
  font-weight: bold;
  color: white;
  font-size: 25px;
}
.nationSelector {
  max-width: 1799px;
  margin: 0 auto;
  padding: 20px;
  color: white;
  font-size: 25px;
  background-color: #2e4451;
  border-bottom-left-radius: 10px !important;
  border-bottom-right-radius: 10px !important;
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
