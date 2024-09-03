<template>
  <!--egy darab jármű kártya -->
  <div>
    <img :src="data.images.techtree" />
    <div class="name">{{ data.identifier }}</div>
    <div>Rank {{ data.era }}</div>
    <div v-if="data.ge_cost && !data.is_pack && !data.on_marketplace">{{ data.ge_cost }} GE</div>
    <!-- <div v-else>Price: {{ data.value }} Sl</div> -->
    <div>
      <button @click="addToListAs(picked)">Add</button>
      <br />
      <select v-model="picked">
        <option value="basicCrew">Basic crew</option>
        <option value="expertCrew">Expert crew</option>
        <option value="vehicleCost">Just the vehicle</option>
      </select>
      <!--<button @click="getVehicleData">Add</button>-->
    </div>
  </div>
</template>

<script>
import vehicleTranslationsEN from '@/assets/vehicleTranslationsEN.json'

import { toast } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'

export default {
  props: {
    identifier: String,
    data: Object
  },
  data() {
    return {
      vehiclesData: {},
      showPopupList: false,
      translatedName: '',
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
     * lekéri az adott jármű részletes adatait a vehiclesData-ba
     *
     */
    async getVehicleData() {
      try {
        const res = await fetch(
          'https://www.wtvehiclesapi.sgambe.serv00.net/api/vehicles/' + this.identifier
        )
        const data = await res.json()
        this.vehiclesData = data
      } catch (err) {
        console.log(err.message)
      }
    },
    async addToListAs(listOption) {
      if (!listOption) {
        toast.error('Please select an option before adding!') // Hibaüzenet toast
        return
      }

      await this.getVehicleData()
      //ellenőrzés hogy a járműdata nem üres-e
      if (!this.vehiclesData || Object.keys(this.vehiclesData).length === 0) {
        toast.error('Failed to fetch vehicle data!') // Hibaüzenet toast
        return
      }
      const vehicle = {
        vehicle_id: this.data.identifier,
        nation: this.data.country,
        vehicleCostGe: this.data.ge_cost, //lehet nem is kell mivel a részletes lekérésben van benne a crew sl adat
        vehicleCostSL: this.data.value, // same
        basicCrewTrainingCost: this.vehiclesData.train1_cost,
        exptertCrewTrtainigCost: this.vehiclesData.train2_cost,
        aceCrewTrainingCost: this.vehiclesData.train3_cost_gold,
        listOption: listOption,
        totalPrice: 0
      }
      let vehicles = JSON.parse(sessionStorage.getItem('vehicleData') || '[]')
      vehicles.push(vehicle)
      sessionStorage.setItem('vehicleData', JSON.stringify(vehicles))
      toast.success('Vehicle added successfully!') // Sikeres értesítés toast
    },
    openCloseListOptions() {
      this.showPopupList = !this.showPopupList
      //console.log('popupcomputed: ' )
    },

    translateVehicleNames(vehicleName) {
      //kell remaster hogy a csv-t dolgozza fel ( units.csv)
      const translatedName = vehicleTranslationsEN[vehicleName]
      return translatedName || vehicleName
    }
  }
}
</script>

<style scoped>
.name {
  font-weight: bold;
}
.list {
  background-color: aliceblue;
}

select,
button {
  font-size: 14px;
  padding: 8px 10px;
  border-radius: 4px;
  border: 1px solid #ccc;
  margin-top: 5px;
  background-color: #f9f9f9;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
}
</style>
