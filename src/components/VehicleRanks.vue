<template>
  <p class="rankHeader">Rank {{ rankInRoman }}</p>

  <div class="container--fluid">
    <div class="row frameFroRow">
      <div class="col-sm-8 col-md-9 col-lg-9 col-xl-8 techtree">
        <div class="row row-cols-sm-2 row-cols-md-3 row-cols-xl-4 row-cols-xxl-5 g-3 red">
          <div v-for="vehicle in TechTreeVehicles" :key="vehicle.identifier" class="col">
            <div
              :class="[
                'box',
                {
                  premium: vehicle.is_premium,
                  squadronVehicle: vehicle.squadron_vehicle,
                  vehicle: !vehicle.is_premium && !vehicle.squadron_vehicle
                }
              ]"
            >
              <VehicleModel :identifier="vehicle.identifier" :data="vehicle" />
            </div>
          </div>
        </div>
      </div>
      <div class="col-sm-4 col-md-3 col-lg-3 col-xl-4 premtree">
        <div class="row row-cols-sm-1 row-cols-xl-2 g-3 red">
          <div v-for="vehicle in PremVehicles" :key="vehicle.identifier" class="col">
            <div
              :class="[
                'box',
                {
                  premium: vehicle.is_premium,
                  squadronVehicle: vehicle.squadron_vehicle,
                  vehicle: !vehicle.is_premium && !vehicle.squadron_vehicle
                }
              ]"
            >
              <VehicleModel :identifier="vehicle.identifier" :data="vehicle" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import VehicleModel from './VehicleModel.vue'
import apiParameters from '@/assets/apiParams.json'
import vehicleFilter from '@/assets/vehicleFilter.json'

export default {
  components: {
    VehicleModel
  },
  props: {
    rank: Number,
    nation: String,
    branch: String
  },
  data() {
    return {
      PremVehicles: [],
      TechTreeVehicles: [],
      rankInRoman: ''
    }
  },
  computed: {},
  mounted() {
    this.fetchVehicles()
    this.rankNumbersInRoman(this.rank)
  },
  watch: {
    // Figyeli a propokat, és ha valamelyik változik, újra lefut a fetchVehicles
    rank: 'fetchVehicles',
    nation: 'fetchVehicles',
    branch: 'fetchVehicles'
  },
  methods: {
    // Új általános filter metódus
    isVehicleFiltered(vehicleId, vehicleData, filterType) {
      // Minta alapú szűrés (regex)
      if (vehicleFilter.rules?.excludePatterns) {
        for (const rule of vehicleFilter.rules.excludePatterns) {
          const regex = new RegExp(rule.pattern)
          if (regex.test(vehicleId)) {
            console.log(`Filtered by pattern "${rule.pattern}": ${vehicleId}`)
            return true // Kiszűrjük
          }
        }
      }

      // Kulcsszó alapú szűrés (case-insensitive)
      if (vehicleFilter.rules?.excludeKeywords) {
        const lowerVehicleId = vehicleId.toLowerCase()
        for (const keyword of vehicleFilter.rules.excludeKeywords) {
          if (lowerVehicleId.includes(keyword.toLowerCase())) {
            console.log(`Filtered by keyword "${keyword}": ${vehicleId}`)
            return true
          }
        }
      }

      // Prefix alapú szűrés
      if (vehicleFilter.rules?.excludePrefixes) {
        for (const prefix of vehicleFilter.rules.excludePrefixes) {
          if (vehicleId.startsWith(prefix)) {
            console.log(`Filtered by prefix "${prefix}": ${vehicleId}`)
            return true
          }
        }
      }

      // Suffix alapú szűrés
      if (vehicleFilter.rules?.excludeSuffixes) {
        for (const suffix of vehicleFilter.rules.excludeSuffixes) {
          if (vehicleId.endsWith(suffix)) {
            console.log(`Filtered by suffix "${suffix}": ${vehicleId}`)
            return true
          }
        }
      }

      // Régi JSON lista alapú szűrés (backwards compatibility)
      if (filterType === 'premium') {
        return vehicleFilter.unusedPremvehicles.vehicles.some(
          (unusedVehicle) => unusedVehicle.vehicle_id === vehicleId
        )
      }

      if (filterType === 'techtree') {
        const unusedMatch = vehicleFilter.unusedTechTreevehicles.vehicles.some(
          (unusedVehicle) => unusedVehicle.vehicle_id === vehicleId
        )

        const misplacedMatch = vehicleFilter.misplacedTechTreeVehicles.vehicles.some(
          (misplacedVehicle) =>
            misplacedVehicle.vehicle_id === vehicleId &&
            misplacedVehicle.rank === this.rank &&
            misplacedVehicle.nation === this.nation
        )

        return unusedMatch || misplacedMatch
      }

      return false
    },

    fetchVehicles() {
      switch (this.branch) {
        case 'air':
          this.getTechtreeVehicles(apiParameters[this.branch])
          this.getPremiumTreeVehicles(apiParameters[this.branch])
          break
        case 'heli':
          this.getTechtreeVehicles(apiParameters[this.branch])
          this.getPremiumTreeVehicles(apiParameters[this.branch])
          break
        case 'ground':
          this.getTechtreeVehicles(apiParameters[this.branch])
          this.getPremiumTreeVehicles(apiParameters[this.branch])
          break
        case 'boat':
          this.getTechtreeVehicles(apiParameters[this.branch])
          this.getPremiumTreeVehicles(apiParameters[this.branch])
          break
        case 'ship':
          this.getTechtreeVehicles(apiParameters[this.branch])
          this.getPremiumTreeVehicles(apiParameters[this.branch])
          break
        default:
          console.log(this.branch)
          console.log('default')
      }
    },

    getTechtreeVehicles(apiParamBranch) {
      fetch(apiParameters.url + this.nation + apiParamBranch + this.rank + apiParameters.techtree)
        .then((res) => res.json())
        .then((data) => {
          // Új filter használata
          this.TechTreeVehicles = data.filter(
            (vehicle) =>
              !this.isVehicleFiltered(vehicle.identifier, vehicle, 'techtree') &&
              vehicle.event === null
          )
        })
        .catch((err) => console.log(err.message))
    },

    async getPremiumTreeVehicles(apiParam) {
      const premiumVehicles = await fetch(
        apiParameters.url + this.nation + apiParam + this.rank + apiParameters.premium
      ).then((res) => res.json())

      const squadronVehicles = await fetch(
        apiParameters.url + this.nation + apiParam + this.rank + apiParameters.squadron
      ).then((res) => res.json())

      const eventVehicles = await fetch(
        apiParameters.url + this.nation + apiParam + this.rank + apiParameters.techtree
      )
        .then((res) => res.json())
        .then((data) => {
          return data.filter((vehicle) => vehicle.event !== null)
        })

      // Új filter használata premium járműveknél
      const filteredPremVehicles = [
        ...premiumVehicles,
        ...squadronVehicles,
        ...eventVehicles
      ].filter((vehicle) => !this.isVehicleFiltered(vehicle.identifier, vehicle, 'premium'))

      // Szűrjük ki a misplacedTechTreeVehicles-ből a jelenlegi nation/rank/branch járműveket
      const misplacedVehicles = vehicleFilter.misplacedTechTreeVehicles.vehicles.filter(
        (misplacedVehicle) =>
          misplacedVehicle.rank === this.rank &&
          misplacedVehicle.nation === this.nation &&
          misplacedVehicle.branch === this.branch
      )

      // Lekérjük az API-ból a misplaced vehicles részletes adatait
      const misplacedVehiclesData = await Promise.all(
        misplacedVehicles.map(async (misplacedVehicle) => {
          const res = await fetch(apiParameters.urlForOneVehicle + misplacedVehicle.vehicle_id)
          return res.json()
        })
      )

      // Az API-ból kapott teljes járműadatok hozzáadása a PremVehicles-hez
      this.PremVehicles = [...filteredPremVehicles, ...misplacedVehiclesData]
    },

    rankNumbersInRoman(rankNumberInArabic) {
      switch (rankNumberInArabic) {
        case 1:
          this.rankInRoman = 'I'
          break
        case 2:
          this.rankInRoman = 'II'
          break
        case 3:
          this.rankInRoman = 'III'
          break
        case 4:
          this.rankInRoman = 'IV'
          break
        case 5:
          this.rankInRoman = 'V'
          break
        case 6:
          this.rankInRoman = 'VI'
          break
        case 7:
          this.rankInRoman = 'VII'
          break
        case 8:
          this.rankInRoman = 'VIII'
          break
        default:
          this.rankInRoman = rankNumberInArabic.toString()
          console.log('rankNumber converting failed')
      }
    }
  }
}
</script>

<style>
.red {
  width: 100%;
}

.box {
  margin: auto;
  width: 170px;
  border-radius: 10px;
  border: 3px solid lightgray;
  overflow-wrap: break-word;
  flex-wrap: wrap;
  align-self: flex-start;
  color: rgb(255, 255, 255);
  text-align: center;
  font-weight: bold;
  font-size: 17pt;
}

.techtree,
.premtree {
  width: 100%;
  padding-top: 20px;
  padding-bottom: 20px;
  display: flex;
  flex-flow: row wrap;
  justify-content: start;
  align-items: flex-start;
  gap: 10%;
}

.techtree {
  background-color: #242e33;
}

.premtree {
  background-color: #3c341b;
}

.vehicle,
.premium,
.squadronVehicle {
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
}

.vehicle {
  background-color: #2e4451;
}

.premium {
  background-color: #524624;
}

.squadronVehicle {
  background-color: #344c30;
}

.vehicle:hover,
.premium:hover,
.squadronVehicle:hover {
  background-color: #48687a;
}
</style>
