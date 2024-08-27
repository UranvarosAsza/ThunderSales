<template>
  <!--egy darab jármű kártya -->

  <div v-if="vehicles.length">
    <img :src="vehicles[0].images.techtree" />
    <p class="name">{{ identifier }}</p>
    <p>Rank {{ rank }}</p>
    <p>{{ nation }}</p>

    <div v-if="vehicles[0].ge_cost">Price: {{ vehicles[0].ge_cost }} GE</div>
    <div v-else>Price: {{ vehicles[0].value }} Sl</div>
    <!--
    <div>Expert crew price: {{ vehicles[0].value }} Sl</div>
   
    <button @click="openCloseListOptions">Add to list as:</button>
    <div>{{ this.showPopupListComputed }}</div>
    <div :class="this.showPopupListComputed ? showPopup : hidePopup" @click="openCloseListOptions">
      ASD
    </div> -->
  </div>
</template>

<script>
import vehicleTranslationsEN from '@/assets/vehicleTranslationsEN.json'

export default {
  props: {
    identifier: String,
    rank: Number,
    nation: String,
    branch: String
  },
  data() {
    return {
      vehicles: [],
      showPopupListComputed: false,
      translatedName: ''
    }
  },
  mounted() {
    this.getVehicleData()
  },
  methods: {
    getVehicleData() {
      fetch('https://www.wtvehiclesapi.sgambe.serv00.net/api/vehicles/' + this.identifier)
        .then((res) => res.json())
        .then((data) => {
          this.vehicles = [data] // Az egyetlen objektumot egy tömbbe tesszük
        })
        .catch((err) => console.log(err.message))
    },

    openCloseListOptions() {
      this.showPopupListComputed = !this.showPopupListComputed
      console.log('popupcomputed: ' + showPopupListComputed)
    },

    translateVehicleNames(vehicleName) {
      // kell remaster hogy a csv-t dolgozza fel ( units.csv)
      const translatedName = vehicleTranslationsEN[vehicleName]
      return translatedName || vehicleName
    }
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

.showPopup {
  color: white;
  font-size: 20;
  text-align: left;
}
.hidePopup {
  display: none;
}
</style>
