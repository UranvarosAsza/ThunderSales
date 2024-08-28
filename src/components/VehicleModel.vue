<template>
  <!--egy darab jármű kártya -->
  <div>
    <img :src="data.images.techtree" />
    <div class="name">{{ data.identifier }}</div>
    <div>Rank {{ data.era }}</div>
    <div v-if="data.ge_cost && !data.is_pack && !on_marketplace">{{ data.ge_cost }} GE</div>
    <!-- <div v-else>Price: {{ data.value }} Sl</div> -->
    <list class="list">
      <button class="list" @click="addToListAs(data.identifier, picked)">Add</button>
      <br />
      <select v-model="picked">
        <option class="list" value="basicCrew">Basic crew</option>
        <option class="list" value="expertCrew">Expert crew</option>
        <option class="list" value="vehicleCost">Just the vehicle</option>
      </select>
    </list>
  </div>
</template>

<script>
import vehicleTranslationsEN from '@/assets/vehicleTranslationsEN.json'

export default {
  props: {
    identifier: String,
    data: Array
  },
  data() {
    return {
      vehiclesData: [],
      showPopupList: false,
      translatedName: '',
      basicCrewTrainingCost: 10000,
      exptertCrewTrtainigCost: 200000,
      vehiclePrice: 300000,
      basicCrew: 'basic',
      expertCrew: 'expert',
      vehicleCost: 'vehicle itself',
      picked: ''
    }
  },
  computed: {
    //showPopupListComputed
  },
  mounted() {},
  methods: {
    /**
     * lekéri az adott jármű részletes adatait egy tömbbe
     *
     */
    //TODO ezt majd a külön oldalas megjelenítésbe átpakolni
    getVehicleData() {
      fetch('https://www.wtvehiclesapi.sgambe.serv00.net/api/vehicles/' + this.identifier)
        .then((res) => res.json())
        .then((data) => {
          this.vehiclesData = [data] // Az egyetlen objektumot egy tömbbe tesszük
        })
        .catch((err) => console.log(err.message))
    },
    addToListAs(identifier, listOption) {
      //hozzáadja a listához csak a járműként, basic, expert crew-val
      const vehicle = {
        vehicle_id: this.data.identifier,
        vehicleCostGe: this.data.ge_cost, //lehet nem is kell mivel a részletes lekérésben van benne a crew sl adat
        vehicleCostSL: this.data.value, // same
        listOption: listOption
      }
      let vehicles = JSON.parse(sessionStorage.getItem('vehicleData') || '[]')
      vehicles.push(vehicle)
      sessionStorage.setItem('vehicleData', JSON.stringify(vehicles))
      console.log(vehicles)
    },
    openCloseListOptions() {
      this.showPopupList = !this.showPopupList
      //console.log('popupcomputed: ' )
    },

    translateVehicleNames(vehicleName) {
      //TODO kell remaster hogy a csv-t dolgozza fel ( units.csv)
      const translatedName = vehicleTranslationsEN[vehicleName]
      return translatedName || vehicleName
    }
  }
}
</script>

<style scoped>
.name {
  font-size: larger;
  font-weight: bold;
}
.list {
  background-color: aliceblue;
}
</style>
