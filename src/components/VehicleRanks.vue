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
        <!--
        <div
          v-for="vehicle in PremVehicles"
          :key="vehicle.identifier"
          :class="['col', {
            premium: vehicle.is_premium,
            squadronVehicle: vehicle.squadron_vehicle,
            vehicle: !vehicle.is_premium && !vehicle.squadron_vehicle
          }
          ]"
        >
          <VehicleModel :identifier="vehicle.identifier" :data="vehicle" />
        </div>
       -->
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
          // Filtereljük ki az unusedTechTreevehicles és a misplacedTechTreeVehicles járműveket
          this.TechTreeVehicles = data.filter(
            (vehicle) =>
              !vehicleFilter.unusedTechTreevehicles.vehicles.some(
                (unusedVehicle) => unusedVehicle.vehicle_id === vehicle.identifier
              ) &&
              !vehicleFilter.misplacedTechTreeVehicles.vehicles.some(
                (misplacedVehicle) =>
                  misplacedVehicle.vehicle_id === vehicle.identifier &&
                  misplacedVehicle.rank === this.rank &&
                  misplacedVehicle.nation === this.nation
              ) &&
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

      const filteredPremVehicles = [
        ...premiumVehicles,
        ...squadronVehicles,
        ...eventVehicles
      ].filter(
        (vehicle) =>
          !vehicleFilter.unusedPremvehicles.vehicles.some(
            (unusedVehicle) => unusedVehicle.vehicle_id === vehicle.identifier
          )
      )

      // Szűrjük ki a misplacedTechTreeVehicles-ből a jelenlegi nation/rank/branch járműveket
      const misplacedVehicles = vehicleFilter.misplacedTechTreeVehicles.vehicles.filter(
        (misplacedVehicle) =>
          misplacedVehicle.rank === this.rank &&
          misplacedVehicle.nation === this.nation &&
          misplacedVehicle.branch === this.branch // Szűrés a branch-re
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

      //console.log('Final Prem Vehicles:', this.PremVehicles)
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
  background-color: #48687a; /* Egységes hover szín */
}
</style>
