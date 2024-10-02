<template>
  <!--egy darab jármű kártya -->
  <div class="vehicleCard" @click="addToListAs(picked)" v-tooltip.top="'Add to the list'">
    <!--<div class="hoverTip">Add to the list</div>-->
    <img v-if="data.images" :src="data.images.techtree" alt="Vehicle Image" />
    <!--<div class="name">{{ data.identifier }}</div>-->
    <!--<div class="name">{{ shortVersionTranslatedName }}</div>-->
    <div class="name">{{ translatedName }}</div>
    <div class="type">Rank {{ data.era }}</div>
    <!--TODO ez a sorrend kell majd az öszzeadásba is-->
    <div v-if="data.on_marketplace" class="type">Market</div>
    <div v-else-if="data.is_pack" class="type">Pack</div>
    <div v-else-if="data.ge_cost" class="type">{{ data.ge_cost }} GE</div>
    <div v-else class="type hidden"><br /></div>
    <!--<div v-if="!data.release_date" class="red">aaaaaaa</div>-->

    <!-- <div v-else>Price: {{ data.value }} Sl</div>
    <div class="lowerPart">
      <button @click="addToListAs(picked)">Add</button>
    </div> -->
  </div>
</template>

<script>
import { toast } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'
import apiParams from '@/assets/apiParams.json'
import updates from '@/assets/updates.json'

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
      isRemovable: false
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
        toast.error('Failed to fetch vehicle data!') // Hibaüzenet toast
        return
      }

      //vehicle type selection for the sales: is it TT/Prem/Squadron
      if (this.data.squadron_vehicle == true) {
        this.type = 'SQ'
      } else if (this.data.is_premium == true) {
        this.type = 'PR'
      } else this.type = 'TT'

      this.setSaleText()

      const vehicle = {
        vehicleAddDate: this.data.release_date || 0,
        id: this.data.identifier,
        shortName: this.shortVersionTranslatedName,
        longName: this.translatedName,
        nation: this.data.country,
        geCost: this.data.ge_cost, //lehet nem is kell mivel a részletes lekérésben van benne a crew sl adat
        slCost: this.data.value, // same
        basicCrewTrainingCost: this.vehiclesData.train1_cost,
        expertCrewTrainingCost: this.vehiclesData.train2_cost,
        aceCrewTrainingCost: this.vehiclesData.train3_cost_gold,
        isEvent: this.vehiclesData.event,
        isRemovable: this.isRemovable,
        saleText: this.saleText,
        listOption: listOption,
        vehicleType: this.type,
        rpCost: this.vehiclesData.req_exp,
        totalPrice: 0
      }

      let vehiclesPrices = JSON.parse(sessionStorage.getItem('vehicleData') || '[]')

      // Ellenőrizzük, hogy a jármű már benne van-e
      if (vehiclesPrices.some((v) => v.id === vehicle.id)) {
        toast.error('Vehicle is already in the list.')
      } else {
        vehiclesPrices.push(vehicle)
        vehiclesPrices.sort((a, b) => {
          // Először a nation szerint rendezünk
          if (a.nation < b.nation) return -1
          if (a.nation > b.nation) return 1

          // Ha a nation megegyezik, akkor a longName szerint rendezünk
          if (a.longName < b.longName) return -1
          if (a.longName > b.longName) return 1

          return 0
        })
        sessionStorage.setItem('vehicleData', JSON.stringify(vehiclesPrices))
        toast.success('Vehicle added successfully!')
      }
    },
    openCloseListOptions() {
      this.showPopupList = !this.showPopupList
    },
    setSaleText() {
      //ha squadronjármű vagy a dátuma az utolsó 2 patch dátumánál korábbi akkor nem lesz leárazva
      if (this.type == 'SQ') {
        this.saleText = ' This is a squadron vehicle, the discount does not apply'
        this.isRemovable = true
      } else if (this.data.release_date > updates.updates[2].start_date) {
        this.saleText =
          ' This is a new vehicle, only vehicles introduced after ' +
          updates.updates[2].name +
          ' are discounted'
        this.isRemovable = true
      }
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
