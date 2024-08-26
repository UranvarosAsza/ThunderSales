<template>
  <div v-if="vehicles.length" class="vehiclesInARank">
    <div
      v-for="vehicle in vehicles"
      :key="vehicle.identifier"
      :class="{
        premium: vehicle.is_premium,
        squadronVehicle: vehicle.squadron_vehicle,
        vehicle: !vehicle.is_premium && !vehicle.squadron_vehicle
      }"
    >
      <!--https://' + -->
      <img :src="vehicle.images.techtree" />

      <div v-if="vehicle.event">Event vehicle</div>
      <div v-if="vehicle.squadron_vehicle">Squadron vehicle</div>
      <div class="name">{{ translateVehicleNames(vehicle.identifier) }}</div>
      <div class="country">{{ vehicle.country }}</div>
      <div>Rank: {{ vehicle.era }}</div>
      <div
        :class="this.showPopupListComputed ? showPopup : hidePopup"
        @click="openCloseListOptions"
      >
        Add to list as:
        <div>Price: {{ vehicle.value }} Sl</div>
        <div>Expert crew price: {{ vehicle.value }} Sl</div>
        <div>{{ this.showPopupListComputed }}</div>
      </div>
      <!--<div>{{ translateAllVehicleNames(vehicle.identifier) }}</div>
      <div>{{ translateVehicleNames(this.vehicle.identifier) }}</div>

      <div>Computed prop: {{ vehicleColorType }}</div>
      <div>Vehicle type: {{ vehicle.vehicle_type }}</div>
        <div>isPremium: {{ vehicle.is_premium }}</div>
        <div>isPack: {{ vehicle.is_pack }}</div>
        <div>isSquadronvehicle: {{ vehicle.squadron_vehicle }}</div>
        <div>Price: {{ vehicle.value }} Sl</div>
        <div>Basic crew price: {{ vehicle.value }} Sl</div>
        <div>Research cost: {{ vehicle.req_exp }} Rp</div> 
      <a :href="'https://' + vehicle.images.techtree">link to the picture</a>-->
    </div>
  </div>
  <div v-else>
    <p>Loading vehicles list</p>
  </div>
</template>

<script>
import vehicleTranslationsEN from '@/assets/vehicleTranslationsEN.json'
import apiParameters from '@/assets/apiParams.json'

export default {
  props: {
    rank: Number,
    nation: String,
    branch: String,
    isPlacedInTechTree: Boolean
  },
  data() {
    return {
      showPopupList: false,
      vehicles: [],
      translatedName: String
    }
  },
  mounted() {
    //ezt a computedbe kéne
    switch (this.branch) {
      case 'air':
        //ezen belül kéne még két elágazás egy a tt-nek, egy pedig a prém treenek
        if (this.isPlacedInTechTree == true) {
          this.getTechtreeVehicles(apiParameters.air)
        } else {
          this.getPremiumTreeVehicles(apiParameters.air)
        }
        break
      case 'heli':
        if (this.isPlacedInTechTree == true) {
          this.getTechtreeVehicles(apiParameters.heli)
        } else {
          this.getPremiumTreeVehicles(apiParameters.heli)
        }
        break
      case 'ground':
        if (this.isPlacedInTechTree == true) {
          this.getTechtreeVehicles(apiParameters.ground)
        } else {
          this.getPremiumTreeVehicles(apiParameters.ground)
        }
        break
      case 'boat':
        if (this.isPlacedInTechTree == true) {
          this.getTechtreeVehicles(apiParameters.boat)
        } else {
          this.getPremiumTreeVehicles(apiParameters.boat)
        }
        break
      case 'ship':
        if (this.isPlacedInTechTree == true) {
          this.getTechtreeVehicles(apiParameters.ship)
        } else {
          this.getPremiumTreeVehicles(apiParameters.ship)
        }
        break
      default:
        console.log(this.branch)
        console.log('default')
    }
  },
  methods: {
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
        .then((data) => (this.vehicles = data.filter((vehicle) => vehicle.event === null)))
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
          this.vehicles = [...premiumData, ...squadronData, ...regularData]
        })
        .catch((err) => console.log(err.message))
    },
    openCloseListOptions() {
      this.showPopupListComputed = !this.showPopupListComputed
    },

    translateVehicleNames(vehicleName) {
      // kell remaster hogy a csv-t dolgozza fel ( units.csv)
      const translatedName = vehicleTranslationsEN[vehicleName]
      return translatedName || vehicleName
    }
  },
  computed: {
    showPopupListComputed: false
  }
}
</script>

<style>
.name {
  font-size: larger;
  font-weight: bold;
}
.vehicle {
  min-width: 120px;
  min-height: 180px;
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
.vehiclesInARank {
  display: flex;
  align-items: flex-start;
  align-content: flex-start;
  flex-wrap: wrap; /* Tördelés több sorba */
  gap: 10px;
  flex-direction: row;
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
.showPopup {
  color: white;
  font-size: 20;
  text-align: left;
}
.hidePopup {
  display: none;
}
</style>
