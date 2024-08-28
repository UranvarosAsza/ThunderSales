<template>
  <!--TODORank header-t kéne készíteni -->
  <p class="rankHeader">Rank {{ rank }} {{ nation }}, {{ branch }}</p>
  <!--<p>Vehcicles of the techtree are going here</p>-->
  <div class="rank">
    <div class="techtree">
      <!-- itt kéne egy v-for végigmenni a ttvehicles-en majd minden elemének adni paramétereket -->
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
    <!--<p>Premium / event vehicles are going here</p>-->
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
        <!-- itt kéne egy v-for végigmenni a premvehicles-en majd minden elemének adni paramétereket-->
        <VehicleModel :identifier="vehicle.identifier" :data="vehicle" />
      </div>
    </div>
  </div>
</template>

<script>
import VehicleModel from './VehicleModel.vue'
import apiParameters from '@/assets/apiParams.json'

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
      translatedName: ''
    }
  },
  computed: {},
  mounted() {
    //amikor a teier-ek mountolódnak  akkor kéne tömböket készíteni
    //de lehet hogy ez jobb lenne computed-be
    this.fetchVehicles()
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
          this.getTechtreeVehicles(apiParameters.air)
          this.getPremiumTreeVehicles(apiParameters.air)

          break
        case 'heli':
          this.getTechtreeVehicles(apiParameters.heli)
          this.getPremiumTreeVehicles(apiParameters.heli)

          break
        case 'ground':
          this.getTechtreeVehicles(apiParameters.ground)
          this.getPremiumTreeVehicles(apiParameters.ground)

          break
        case 'boat':
          this.getTechtreeVehicles(apiParameters.boat)
          this.getPremiumTreeVehicles(apiParameters.boat)

          break
        case 'ship':
          this.getTechtreeVehicles(apiParameters.ship)
          this.getPremiumTreeVehicles(apiParameters.ship)

          break
        default:
          console.log(this.branch)
          console.log('default')
      }
    },

    getTechtreeVehicles(apiParamBranch) {
      fetch(
        'https://www.wtvehiclesapi.sgambe.serv00.net/api/vehicles?' +
          'country=' +
          this.nation +
          apiParamBranch +
          this.rank +
          apiParameters.techtree
      )
        .then((res) => res.json())
        .then((data) => (this.TechTreeVehicles = data.filter((vehicle) => vehicle.event === null)))
        .catch((err) => console.log(err.message))
    },
    getPremiumTreeVehicles(apiParam) {
      // 3 api call same params
      const premiumVehicles = fetch(
        'https://www.wtvehiclesapi.sgambe.serv00.net/api/vehicles?' +
          'country=' +
          this.nation +
          apiParam +
          this.rank +
          apiParameters.premium
      ).then((res) => res.json())
      //squadron
      const squadronVehicles = fetch(
        'https://www.wtvehiclesapi.sgambe.serv00.net/api/vehicles?' +
          'country=' +
          this.nation +
          apiParam +
          this.rank +
          apiParameters.squadron
      ).then((res) => res.json())
      //nincs event jármű csak tt járművek filterezve
      const eventVehicles = fetch(
        'https://www.wtvehiclesapi.sgambe.serv00.net/api/vehicles?' +
          'country=' +
          this.nation +
          apiParam +
          this.rank +
          apiParameters.techtree
      )
        .then((res) => res.json())
        .then((data) => {
          // Szűrés azokra a járművekre, ahol az "event" paraméter null
          return data.filter((vehicle) => vehicle.event !== null)
        })
      Promise.all([premiumVehicles, squadronVehicles, eventVehicles])
        .then(([premiumData, squadronData, regularData]) => {
          // Az adatokat egyesítjük egyetlen tömbbe
          this.PremVehicles = [...premiumData, ...squadronData, ...regularData]
        })
        .catch((err) => console.log(err.message))
    }
  }
}
</script>

<style scoped>
.rankHeader {
  background-color: #2e4451;
  color: white;
  border: 5px solid rgb(255, 255, 255);
  font-size: 30pt;
  font-weight: 600;
  margin: auto;
  text-align: center;
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
