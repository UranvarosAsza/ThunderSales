<template>
  <p class="rankHeader">Rank {{ rankInRoman }}</p>

  <div class="rank">
    <div class="techtree">
      <div
        v-for="vehicle in TechTreeVehicles"
        :key="vehicle.identifier"
        :class="{
          premium: vehicle.is_premium,
          squadronVehicle: vehicle.squadron_vehicle,
          vehicle: !vehicle.is_premium && !vehicle.squadron_vehicle
        }"
      >
        <VehicleModel :identifier="vehicle.identifier" :data="vehicle" />
      </div>
    </div>

    <div class="premtree">
      <div
        v-for="vehicle in PremVehicles"
        :key="vehicle.identifier"
        :class="{
          premium: vehicle.is_premium,
          squadronVehicle: vehicle.squadron_vehicle,
          vehicle: !vehicle.is_premium && !vehicle.squadron_vehicle
        }"
      >
        <VehicleModel :identifier="vehicle.identifier" :data="vehicle" />
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

<style scoped>
.rankHeader {
  background-color: #2e4451;
  color: white;

  font-size: 30pt;
  font-weight: 600;
  margin: auto;
  text-align: left;
}
.rank {
  display: flex;
  gap: 20px;
  background-color: #242e33;
  background-color: #242e33;
  border-color: darkgray;
  border: 5px solid;
}
.techtree,
.premtree {
  display: flex;
  /* Kártyák tördelése több sorra */
  gap: 10px;
}
.techtree {
  display: flex;
  flex-wrap: wrap; /* Tördelés több sorba */

  align-items: flex-start;
  justify-content: flex-start;
  align-content: flex-start;
  gap: 10px;
  flex: 5;
  background-color: #242e33;
}
.premtree {
  justify-content: flex-start;
  align-items: flex-start;
  align-content: flex-start;
  flex: 2;
  background-color: #3c341b;
  display: flex;
  flex-wrap: wrap; /* Tördelés több sorba */
  gap: 10px;
}
.techtree .card {
  flex: 1 1 calc(20% - 10px);
}
.premtree .card {
  flex: 1 1 calc(50% - 10px);
}
.card :hover {
  background-color: #48687a;
}
.vehicle {
  min-width: 120px;
  min-height: 180px;
  max-height: 400px;
  padding: 10px;
  margin: 20px auto;
  color: white;
  font-size: 20;
  border-radius: 10px;
  border: 5px, lightgray;
  background-color: #2e4451;
  padding: 20px;
  text-align: center;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
}

.vehicle :hover {
  background-color: #48687a;
}
.premium {
  min-width: 120px;
  min-height: 180px;
  padding: 10px;
  margin: 20px auto;
  color: white;
  font-size: 20;
  border-radius: 10px;
  border: 5px, lightgray;
  padding: 20px;
  text-align: center;
  background-color: #524624;
}
.premium :hover {
  background-color: #716032;
  border: 5px, #716032;
}
.squadronVehicle {
  min-width: 120px;
  min-height: 180px;
  padding: 10px;
  margin: 20px auto;
  color: white;
  font-size: 20;
  border-radius: 10px;
  border: 5px, lightgray;
  padding: 20px;
  text-align: center;
  background-color: #344c30;
}
.squadronVehicle :hover {
  background-color: #42613d;
}
</style>
