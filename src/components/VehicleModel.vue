<template>
  <!--egy darab jármű kártya -->
  <div class="vehicleCard" @click="addToListAs(picked)" v-tooltip.top="$t('hints.addToList')">
    <!--<div class="hoverTip">Add to the list</div>-->
    <img v-if="data.images" :src="data.images.techtree" alt="Vehicle Image" />
    <!--<div class="name">{{ data.identifier }}</div> -->
    <!--<div class="name">{{ shortVersionTranslatedName }}</div>-->
    <div class="name">{{ translatedName }}</div>
    <div class="type">Rank {{ data.era }}</div>
    <div v-if="data.on_marketplace" class="type">Market</div>
    <div v-else-if="data.is_pack" class="type">Pack</div>
    <div v-else-if="data.ge_cost" class="type">{{ data.ge_cost }} GE</div>
    <div v-else class="type hidden"><br /></div>
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
  components: {},
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
      picked: 'vehicleCost',
      type: '',
      saleText: '',
      isRemovable: false,
      slPrice: 0,
      gePrice: 0
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
      await this.getVehicleData()
      //ellenőrzés hogy a járműdata nem üres-e
      if (!this.vehiclesData || Object.keys(this.vehiclesData).length === 0) {
        toast.error('Failed to fetch vehicle data!') // Hibaüzenet toast $t('hints.add_error')
        return
      }

      //vehicle type selection for the sales: is it TT/Prem/Squadron
      if (this.data.squadron_vehicle == true) {
        this.type = 'SQ'
      } else if (this.data.is_premium == true) {
        this.type = 'PR'
      } else this.type = 'TT'

      //eventes járműnek az sl költsége maradjon 0 (mivel vagy kupon vagy fix beaktiválódik)
      if (this.vehiclesData.event == null) {
        this.slPrice = this.vehiclesData.value
      }

      //Market/pack -> geCost=0
      //on_market == true || ispack==true
      if (!(this.vehiclesData.on_marketplace == true || this.vehiclesData.is_pack == true)) {
        this.gePrice = this.vehiclesData.ge_cost
        // console.log(this.vehiclesData.isMarket, this.vehiclesData.is_pack);
      }

      const vehicle = {
        id: this.data.identifier,
        //shortName: this.shortVersionTranslatedName,
        longName: this.translatedName,
        nation: this.data.country,
        isMarket: this.vehiclesData.on_marketplace, //lehet nem is kell
        isEvent: this.vehiclesData.event, //lehet nem is kell
        isPrem: this.vehiclesData.is_premium,
        geCost: this.gePrice,
        slCost: this.slPrice,
        basicCrewTrainingCost: this.vehiclesData.train1_cost,
        expertCrewTrainingCost: this.vehiclesData.train2_cost,
        rpCost: this.vehiclesData.req_exp,
        originalRpCost: this.vehiclesData.req_exp,
        listOption: listOption,
        vehicleType: this.type,
        saleText: this.saleText,
        release_date: this.data.release_date || 0,
        totalSL: 0,
        totalGe: 0,
        isRemovable: false
      }

      let vehiclesPrices = JSON.parse(sessionStorage.getItem('vehicleData') || '[]')

      // Ellenőrizzük, hogy a vehiclesPrices egy tömb-e
      if (!Array.isArray(vehiclesPrices)) {
        vehiclesPrices = [] // Ha nem tömb, inicializáljuk üres tömbként
      }

      // Ellenőrizzük, hogy a jármű már benne van-e
      if (vehiclesPrices.some((v) => v.id === vehicle.id)) {
        toast.error(this.$t('hints.add_error'))
      } else {
        vehiclesPrices.push(vehicle)
        sessionStorage.setItem('vehicleData', JSON.stringify(vehiclesPrices))
        toast.success(this.$t('hints.addSuccesfull'))
      }
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
        //FIXME
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
  margin: 2px;
  font-weight: bold;
  text-wrap: balance;
}
.type {
  font-weight: lighter;
  font-size: smaller;
}
.vehicleCard {
  cursor: pointer;
  min-height: 210px;
  padding-top: 10px;
  padding-bottom: 5px;
}
button {
  margin-bottom: 5px;
}
.red {
  background-color: red;
}
</style>
