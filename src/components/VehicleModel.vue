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
    //ezt a computedbe kéne valahogy
    switch (this.branch) {
      case 'air':
        // console.log('fighter, assault, bomber')
        //ezen bellűl kéne még két elágazás egy a tt-nek, egy pedig a prém treenek
        if (this.isPlacedInTechTree == true) {
          //itt a tt gépek helye (amelyben nincs event jármű) lehet hogy ehhez kellenek még kivétel lista is pl (a-26 c, német-olasz gépek)
          fetch(
            'https://www.wtvehiclesapi.sgambe.serv00.net/api/vehicles?' +
              'country=' +
              this.nation +
              '&type=fighter' +
              '&type=assault' +
              '&type=bomber' +
              '&era=' +
              this.rank +
              '&isPremium=false' +
              '&isSquadronVehicle=false' +
              '&excludeEventVehicles=true' +
              '&excludeKillstreak=true'
          )
            .then((res) => res.json())
            .then((data) => (this.vehicles = data.filter((vehicle) => vehicle.event === null)))
            .catch((err) => console.log(err.message))
        } else {
          //itt a prém gépek
          this.getPremiumAirTreeAllVehicles()
          //squadron
        }
        /*
        fetch(
          'https://www.wtvehiclesapi.sgambe.serv00.net/api/vehicles?' +
            'country=' +
            this.nation +
            '&type=fighter' +
            '&type=assault' +
            '&type=bomber' +
            '&era=' +
            this.rank +
            '&isPremium=' +
            this.isPremium +
            '&isSquadronVehicle' +
            this.isSquadronVehicle
        )
          .then((res) => res.json())
          .then((data) => (this.vehicles = data))
          .catch((err) => console.log(err.message)) */
        break
      case 'heli':
        //console.log('attack_helicopter, utility_helicopter')
        fetch(
          'https://www.wtvehiclesapi.sgambe.serv00.net/api/vehicles?' +
            'country=' +
            this.nation +
            '&type=attack_helicopter' +
            '&type=utility_helicopter' +
            '&era=' +
            this.rank +
            '&isPremium=' +
            this.isPremium
        )
          .then((res) => res.json())
          .then((data) => (this.vehicles = data))
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
            '&type=spaa' +
            '&era=' +
            this.rank +
            '&isPremium=' +
            this.istechtree
        )
          .then((res) => res.json())
          .then((data) => (this.vehicles = data))
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
            '&type=barge' +
            '&era=' +
            this.rank +
            '&isPremium=' +
            this.istechtree
        )
          .then((res) => res.json())
          .then((data) => (this.vehicles = data))
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
            '&type=battleship' +
            '&era=' +
            this.rank +
            '&isPremium=' +
            this.istechtree
        )
          .then((res) => res.json())
          .then((data) => (this.vehicles = data))
          .catch((err) => console.log(err.message))
        break
      default:
        console.log('default')
    }
  },
  methods: {
    vehicleApiCall(isPlacedInTechTree) {
      //össszerakja a paraméterlistát

      ///refactor->  egy elágazás az elején a prém alapján
      // ami TT annak egy switch case
      // ami prém annak szintén egy külön
      var paramForApiCall = null
      if (isPlacedInTechTree) {
        //tt switch case
        switch (this.branch) {
          case 'air':
            //TT air lekérés
            paramForApiCall =
              'country=' +
              this.nation +
              '&type=fighter' +
              '&type=assault' +
              '&type=bomber' +
              '&era=' +
              this.rank +
              '&isPremium=false' +
              '&isSquadronVehicle=false' +
              '&excludeEventVehicles=true' +
              '&excludeKillstreak=true'

            break
          case 'ground':
            paramForApiCall =
              'country=' +
              this.nation +
              '&type=light_tank' +
              '&type=medium_tank' +
              '&type=heavy_tank' +
              '&type=tank_destroyer' +
              '&type=spaa' +
              '&era=' +
              this.rank +
              '&isPremium=false' +
              '&isSquadronVehicle=false' +
              '&excludeEventVehicles=true' +
              '&excludeKillstreak=true'
            break
          case 'heli':
            paramForApiCall =
              'country=' +
              this.nation +
              '&type=attack_helicopter' +
              '&type=utility_helicopter' +
              '&era=' +
              this.rank +
              '&isPremium=false' +
              '&isSquadronVehicle=false' +
              '&excludeEventVehicles=true' +
              '&excludeKillstreak=true'
            break
          case 'boat':
            paramForApiCall =
              'country=' +
              this.nation +
              '&type=ship' +
              '&type=light_cruiser' +
              '&type=heavy_boat' +
              '&type=barge' +
              '&era=' +
              this.rank +
              '&isPremium=false' +
              '&isSquadronVehicle=false' +
              '&excludeEventVehicles=true' +
              '&excludeKillstreak=true'
            break
          case 'ship':
            paramForApiCall =
              'country=' +
              this.nation +
              '&type=destroyer' +
              '&type=frigate' +
              '&type=heavy_cruiser' +
              '&type=battlecruiser' +
              '&type=battleship' +
              '&era=' +
              this.rank +
              '&isPremium=false' +
              '&isSquadronVehicle=false' +
              '&excludeEventVehicles=true' +
              '&excludeKillstreak=true'
            break
          default:
            console.log("vehicleApiCall's techtree switch failed")
        }

        //behelyettesíti és leléri, majd feltölti vele a vehicles tömböt

        fetch('https://www.wtvehiclesapi.sgambe.serv00.net/api/vehicles?' + paramForApiCall)
          .then((res) => res.json())
          .then((data) => (this.vehicles = data.filter((vehicle) => vehicle.event === null)))
          .catch((err) => console.log(err.message))
      } else {
        // prém switch case
        switch (this.branch) {
          case 'air':
            this.getPremiumAirTreeAllVehicles()
            break
          case 'ground':
            this.getPremiumGroundTreeAllVehicles()
            break
          case 'heli':
            this.getPremiumHeliTreeAllVehicles()
            break
          case 'boat':
            this.getPremiumBoatTreeAllVehicles()
            break
          case 'ship':
            this.getPremiumBoatTreeAllVehicles()
            break
          default:
            console.log("vehicleApiCall's prem tree switch failed")
        }
      }
    },

    /*
    lekéri a prémium, a squadron és a tt-ből az eventes járműveket */
    getPremiumAirTreeAllVehicles() {
      const premiumVehiclesFetch = fetch(
        'https://www.wtvehiclesapi.sgambe.serv00.net/api/vehicles?' +
          'country=' +
          this.nation +
          '&type=fighter' +
          '&type=assault' +
          '&type=bomber' +
          '&era=' +
          this.rank +
          '&isPremium=true'
      ).then((res) => res.json())
      //squadron
      const squadronVehiclesFetch = fetch(
        'https://www.wtvehiclesapi.sgambe.serv00.net/api/vehicles?' +
          'country=' +
          this.nation +
          '&type=fighter' +
          '&type=assault' +
          '&type=bomber' +
          '&era=' +
          this.rank +
          '&isSquadronVehicle=true'
      ).then((res) => res.json())
      const eventVehiclesFetch = fetch(
        'https://www.wtvehiclesapi.sgambe.serv00.net/api/vehicles?' +
          'country=' +
          this.nation +
          '&type=fighter' +
          '&type=assault' +
          '&type=bomber' +
          '&era=' +
          this.rank +
          '&isPremium=false' +
          '&isSquadronVehicle=false' +
          '&excludeEventVehicles=true' +
          '&excludeKillstreak=true'
      )
        .then((res) => res.json())
        .then((data) => {
          // Szűrés azokra a járművekre, ahol az "event" paraméter null
          return data.filter((vehicle) => vehicle.event !== null)
        })
      Promise.all([premiumVehiclesFetch, squadronVehiclesFetch, eventVehiclesFetch])
        .then(([premiumData, squadronData, regularData]) => {
          // Az adatokat egyesítjük egyetlen tömbbe
          this.vehicles = [...premiumData, ...squadronData, ...regularData]
        })
        .catch((err) => console.log(err.message))
    },
    getPremiumGroundTreeAllVehicles() {
      const premiumVehiclesFetch = fetch(
        'https://www.wtvehiclesapi.sgambe.serv00.net/api/vehicles?' +
          'country=' +
          this.nation +
          '&type=light_tank' +
          '&type=medium_tank' +
          '&type=heavy_tank' +
          '&type=tank_destroyer' +
          '&type=spaa' +
          '&era=' +
          this.rank +
          '&isPremium=true'
      ).then((res) => res.json())
      //squadron
      const squadronVehiclesFetch = fetch(
        'https://www.wtvehiclesapi.sgambe.serv00.net/api/vehicles?' +
          'country=' +
          this.nation +
          '&type=light_tank' +
          '&type=medium_tank' +
          '&type=heavy_tank' +
          '&type=tank_destroyer' +
          '&type=spaa' +
          '&era=' +
          this.rank +
          '&isSquadronVehicle=true'
      ).then((res) => res.json())
      const eventVehiclesFetch = fetch(
        'https://www.wtvehiclesapi.sgambe.serv00.net/api/vehicles?' +
          'country=' +
          this.nation +
          '&type=light_tank' +
          '&type=medium_tank' +
          '&type=heavy_tank' +
          '&type=tank_destroyer' +
          '&type=spaa' +
          '&era=' +
          this.rank +
          '&isPremium=false' +
          '&isSquadronVehicle=false' +
          '&excludeEventVehicles=true' +
          '&excludeKillstreak=true'
      )
        .then((res) => res.json())
        .then((data) => {
          // Szűrés azokra a járművekre, ahol az "event" paraméter null
          return data.filter((vehicle) => vehicle.event !== null)
        })
      Promise.all([premiumVehiclesFetch, squadronVehiclesFetch, eventVehiclesFetch])
        .then(([premiumData, squadronData, regularData]) => {
          // Az adatokat egyesítjük egyetlen tömbbe
          this.vehicles = [...premiumData, ...squadronData, ...regularData]
        })
        .catch((err) => console.log(err.message))
    },
    getPremiumHeliTreeAllVehicles() {
      const premiumVehiclesFetch = fetch(
        'https://www.wtvehiclesapi.sgambe.serv00.net/api/vehicles?' +
          'country=' +
          this.nation +
          '&type=attack_helicopter' +
          '&type=utility_helicopter' +
          '&era=' +
          this.rank +
          '&isPremium=true'
      ).then((res) => res.json())
      //squadron
      const squadronVehiclesFetch = fetch(
        'https://www.wtvehiclesapi.sgambe.serv00.net/api/vehicles?' +
          'country=' +
          this.nation +
          '&type=attack_helicopter' +
          '&type=utility_helicopter' +
          '&era=' +
          this.rank +
          '&isSquadronVehicle=true'
      ).then((res) => res.json())
      const eventVehiclesFetch = fetch(
        'https://www.wtvehiclesapi.sgambe.serv00.net/api/vehicles?' +
          'country=' +
          this.nation +
          '&type=attack_helicopter' +
          '&type=utility_helicopter' +
          '&era=' +
          this.rank +
          '&isPremium=false' +
          '&isSquadronVehicle=false' +
          '&excludeEventVehicles=true' +
          '&excludeKillstreak=true'
      )
        .then((res) => res.json())
        .then((data) => {
          // Szűrés azokra a járművekre, ahol az "event" paraméter null
          return data.filter((vehicle) => vehicle.event !== null)
        })
      Promise.all([premiumVehiclesFetch, squadronVehiclesFetch, eventVehiclesFetch])
        .then(([premiumData, squadronData, regularData]) => {
          // Az adatokat egyesítjük egyetlen tömbbe
          this.vehicles = [...premiumData, ...squadronData, ...regularData]
        })
        .catch((err) => console.log(err.message))
    },
    getPremiumBoatTreeAllVehicles() {
      const premiumVehiclesFetch = fetch(
        'https://www.wtvehiclesapi.sgambe.serv00.net/api/vehicles?' +
          'country=' +
          this.nation +
          '&type=ship' +
          '&type=light_cruiser' +
          '&type=heavy_boat' +
          '&type=barge' +
          '&era=' +
          this.rank +
          '&isPremium=true'
      ).then((res) => res.json())
      //squadron
      const squadronVehiclesFetch = fetch(
        'https://www.wtvehiclesapi.sgambe.serv00.net/api/vehicles?' +
          'country=' +
          this.nation +
          '&type=ship' +
          '&type=light_cruiser' +
          '&type=heavy_boat' +
          '&type=barge' +
          '&era=' +
          this.rank +
          '&isSquadronVehicle=true'
      ).then((res) => res.json())
      const eventVehiclesFetch = fetch(
        'https://www.wtvehiclesapi.sgambe.serv00.net/api/vehicles?' +
          'country=' +
          this.nation +
          '&type=ship' +
          '&type=light_cruiser' +
          '&type=heavy_boat' +
          '&type=barge' +
          '&era=' +
          this.rank +
          '&isPremium=false' +
          '&isSquadronVehicle=false' +
          '&excludeEventVehicles=true' +
          '&excludeKillstreak=true'
      )
        .then((res) => res.json())
        .then((data) => {
          // Szűrés azokra a járművekre, ahol az "event" paraméter null
          return data.filter((vehicle) => vehicle.event !== null)
        })
      Promise.all([premiumVehiclesFetch, squadronVehiclesFetch, eventVehiclesFetch])
        .then(([premiumData, squadronData, regularData]) => {
          // Az adatokat egyesítjük egyetlen tömbbe
          this.vehicles = [...premiumData, ...squadronData, ...regularData]
        })
        .catch((err) => console.log(err.message))
    },
    getPremiumShipTreeAllVehicles() {
      const premiumVehiclesFetch = fetch(
        'https://www.wtvehiclesapi.sgambe.serv00.net/api/vehicles?' +
          'country=' +
          this.nation +
          '&type=destroyer' +
          '&type=frigate' +
          '&type=heavy_cruiser' +
          '&type=battlecruiser' +
          '&type=battleship' +
          '&era=' +
          this.rank +
          '&isPremium=true'
      ).then((res) => res.json())
      //squadron
      const squadronVehiclesFetch = fetch(
        'https://www.wtvehiclesapi.sgambe.serv00.net/api/vehicles?' +
          'country=' +
          this.nation +
          '&type=destroyer' +
          '&type=frigate' +
          '&type=heavy_cruiser' +
          '&type=battlecruiser' +
          '&type=battleship' +
          '&era=' +
          this.rank +
          '&isSquadronVehicle=true'
      ).then((res) => res.json())
      const eventVehiclesFetch = fetch(
        'https://www.wtvehiclesapi.sgambe.serv00.net/api/vehicles?' +
          'country=' +
          this.nation +
          '&type=destroyer' +
          '&type=frigate' +
          '&type=heavy_cruiser' +
          '&type=battlecruiser' +
          '&type=battleship' +
          '&era=' +
          this.rank +
          '&isPremium=false' +
          '&isSquadronVehicle=false' +
          '&excludeEventVehicles=true' +
          '&excludeKillstreak=true'
      )
        .then((res) => res.json())
        .then((data) => {
          // Szűrés azokra a járművekre, ahol az "event" paraméter null
          return data.filter((vehicle) => vehicle.event !== null)
        })
      Promise.all([premiumVehiclesFetch, squadronVehiclesFetch, eventVehiclesFetch])
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
