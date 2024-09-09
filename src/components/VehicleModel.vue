<template>
  <!--egy darab jármű kártya -->
  <div>
    <img v-if="data.images" :src="data.images.techtree" alt="Vehicle Image" />
    <!--<div class="name">{{ data.identifier }}</div>-->
    <div class="name">{{ shortVersionTranslatedName }}</div>
    <!--<div>{{ translatedName   }}</div>-->
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
import { toast } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'
import apiParams from '@/assets/apiParams.json'

export default {
  props: {
    identifier: String,
    data: Object,
    lang: {
      type: String,
      default: 'en' // Alapértelmezett nyelv
    }
  },
  data() {
    return {
      vehiclesData: {},
      showPopupList: false,
      translatedName: '', // Hosszú név (_shop)
      shortVersionTranslatedName: '', // Rövid név (_1)
      basicCrew: 'basic',
      expertCrew: 'expert',
      vehicleCost: 'vehicle itself',
      picked: ''
    }
  },
  computed: {
    //showPopupListComputed
  },
  mounted() {
    this.getTranslatedName(this.lang, this.identifier)
  },
  methods: {
    /**
     * lekéri az adott jármű részletes adatait a vehiclesData-ba
     *
     */
    async getVehicleData() {
      try {
        const res = await fetch(apiParams.urlForOneVehicle + this.identifier)
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
        shortName: this.shortVersionTranslatedName,
        longName: this.translatedName,
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

    /**
     * Lekér két különböző fordítást: egy rövid (_1) és egy hosszú (_shop) verziót
     */
    getTranslatedName(lang, vehiclename) {
      const parsedCSVData = sessionStorage.getItem('parsedCSVData')

      if (parsedCSVData) {
        const csvData = JSON.parse(parsedCSVData)

        // Hosszú verzió (_shop)
        const shopKey = `${vehiclename}_shop`
        // Rövid verzió (_1)
        const variantKey = `${vehiclename}_1`

        // Hosszű név (_shop)
        if (csvData[shopKey]) {
          this.translatedName = csvData[shopKey][lang === 'fr' ? 'french' : 'english']
        } else {
          console.warn(`Nem található rövid fordítás a következőhöz: ${vehiclename}`)
          this.translatedName = vehiclename // Ha nincs fordítás, az eredeti név jelenik meg
        }

        // Rövid név (_1)
        if (csvData[variantKey]) {
          this.shortVersionTranslatedName =
            csvData[variantKey][lang === 'fr' ? 'french' : 'english']
        } else {
          console.warn(`Nem található hosszú fordítás a következőhöz: ${vehiclename}`)
          this.shortVersionTranslatedName = vehiclename // Ha nincs fordítás, az eredeti név jelenik meg
        }
      } else {
        console.error('Nincs CSV adat a sessionStorage-ban!')
      }
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
