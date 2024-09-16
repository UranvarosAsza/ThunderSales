<template>
  <!--egy darab jármű kártya -->
  <div class="vehicleCard">
    <img v-if="data.images" :src="data.images.techtree" alt="Vehicle Image" />
    <!--<div class="name">{{ data.identifier }}</div>-->
    <!--<div class="name">{{ shortVersionTranslatedName }}</div>-->
    <div class="name">{{ translatedName }}</div>
    <div>Rank {{ data.era }}</div>
    <!--TODO ez a sorrend kell majd az öszzeadásba is-->
    <div v-if="data.on_marketplace" class="type">Market</div>
    <div v-else-if="data.is_pack" class="type">Pack</div>
    <div v-else-if="data.ge_cost" class="type">{{ data.ge_cost }} GE</div>
    <div v-else class="type"><br /></div>

    <!-- <div v-else>Price: {{ data.value }} Sl</div> -->
    <div class="lowerPart">
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
      //FIXME
      translatedName: '', // Hosszú név (_shop)
      shortVersionTranslatedName: '', // Rövid név (_1)
      basicCrew: 'basic',
      expertCrew: 'expert',
      vehicleCost: 'vehicle itself',
      picked: '',
      type: ''
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

      //vehicle type selection for the sales: is it TT/Prem/Squadron

      if (this.data.squadron_vehicle == true) {
        this.type = 'SQ'
      } else if (this.data.is_premium == true) {
        this.type = 'PR'
      } else this.type = 'TT'

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
        vehicleType: this.type, // lehet normal, squadron, premium
        totalPrice: 0
      }
      let vehiclesPrices = JSON.parse(sessionStorage.getItem('vehicleData') || '[]')
      vehiclesPrices.push(vehicle)
      sessionStorage.setItem('vehicleData', JSON.stringify(vehiclesPrices))
      toast.success('Vehicle added successfully!') // Sikeres értesítés toast
    },
    openCloseListOptions() {
      this.showPopupList = !this.showPopupList
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
        const variantKey = `${vehiclename}_0`

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
.hidden {
  display: none;
}
.name {
  font-weight: bold;
  text-wrap: balance;
}
.type {
  font-weight: lighter;
  font-size: smaller;
}
.vehicleCard {
  min-height: 185px;
  padding-top: 5px;
  padding-bottom: 5px;
}
button {
  margin-bottom: 5px;
}
</style>
