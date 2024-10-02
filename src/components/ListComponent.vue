<template>
  <div class="container-fluid">
    <div class="list-container">
      <h1>Here is your list:</h1>

      <DataTable
        :value="vehiclesPrices"
        ref="dt"
        rowGroupMode="subheader"
        groupRowsBy="nation"
        stripedRows
        class="vehicle-table"
        editMode="row"
        showGridlines
        @row-edit-save="onRowEditSave"
        :pt="{
          table: { style: 'min-width: 50rem' },
          column: {
            bodycell: ({ state }) => ({
              style: state['d_editing']
            })
          }
        }"
      >
        <template #header>
          <div style="text-align: left">
            <span>
              <button icon="pi pi-external-link" label="Export" @click="exportCSV($event)">
                Export
              </button>
              <div>
                Allready have a list? add it here: <input type="file" @change="handleFileUpload" />
              </div>
            </span>
            <div class="reduceButtons" style="text-align: right">
              <button
                label="Change to vehicle cost only"
                class="allToVehiclePriceButton"
                v-tooltip.top="'Sets all vechicle options to vehiclePrice'"
                @click="setAllVehicleOptionToVehiclepirce"
              >
                Change to vehicle cost only
              </button>
              <button
                label="Remove vehicles without discount"
                class="removeButton"
                v-tooltip.top="
                  'Removes all vehicles that won\'t get discounted (Squadron and Past 2 update\'s additions)'
                "
                @click="removeRemovableVehicles"
              >
                Remove vehicles without discount
              </button>
            </div>
            <div style="text-align: left">
              <MultiSelect
                v-model="selectedColumns"
                :options="columns"
                optionLabel="header"
                display="chip"
                placeholder="Add more columns"
              />
              <label>Show vehicletypes</label>
              <ToggleSwitch v-model="showVehicleTypes" />
            </div>
          </div>
        </template>
        <Column field="vehicle" header="Vehicle">
          <template #body="slotProps">
            {{ slotProps.data.longName }}
            <span v-if="showVehicleTypes">
              <div
                :class="[
                  'vehicle-type-label',

                  slotProps.data.vehicleType === 'TT' ? 'vehicle-tt' : '',
                  slotProps.data.vehicleType === 'SQ' ? 'vehicle-sq' : '',
                  slotProps.data.vehicleType === 'PR' ? 'vehicle-pr' : ''
                ]"
              >
                {{ slotProps.data.vehicleType }}
              </div>
            </span>

            <i
              class="pi pi-info-circle red"
              v-if="slotProps.data.isRemovable"
              v-tooltip.top="slotProps.data.saleText"
              style="margin-left: 5px"
            >
            </i>
          </template>
        </Column>
        <Column field="nation" header="Nation"></Column>
        <Column field="totalPrice" header="Total" sortable>
          <template #body="slotProps">
            {{ slotProps.data.totalPrice.toLocaleString('hu-HU') }}
          </template>
        </Column>
        <Column
          v-for="(col, index) of selectedColumns"
          :field="col.field"
          :header="col.header"
          :key="col.field + '_' + index"
        />

        <Column field="listOption" header="List Option">
          <template #body="slotProps">
            <Select
              v-model="slotProps.data.listOption"
              :options="listOptions"
              optionLabel="label"
              optionValue="value"
              class="w-full md:w-56"
              @change="handleListOptionChange(slotProps.data)"
            >
              <option value="vehicleCost">Vehicle Cost</option>
              <option value="basicCrew">Basic Crew</option>
              <option value="expertCrew">Expert Crew</option>
            </Select>
          </template>
        </Column>
        <Column field="delButton" header="">
          <template #body="slotProps">
            <button
              label="Remove vehicle"
              class="removeButton"
              @click="removeFromList(slotProps.data)"
            >
              Remove
            </button>
          </template>
        </Column>
        <Column
          :rowEditor="true"
          style="width: 10%; min-width: 8rem"
          bodyStyle="text-align:center { width: '150px' }"
        ></Column>
        <template #groupheader="slotProps">
          <div class="flex items-center gap-2">
            <span>{{ slotProps.data.nation }}</span>
          </div>
        </template>

        <template #groupfooter="slotProps">
          <div class="flex justify-end font-bold w-full">
            Total Cost in Nation:
            {{ calculateNationTotal(slotProps.data.nation).toLocaleString('hu-HU') }}
          </div>
        </template>
        <template #footer>
          <div v-if="vehiclesPrices.length" class="discount">
            <button @click="clearList">Clear list</button>
            <h2>
              Your total costs for all nations are: {{ grandTotal.toLocaleString('hu-HU') }} .
            </h2>
          </div>
        </template>
      </DataTable>
    </div>
  </div>
</template>

<script>
//import ListElement from './ListElement.vue'
import { toast } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import InputNumber from 'primevue/inputnumber'
import Select from 'primevue/select'
import MultiSelect from 'primevue/multiselect'
import ToggleSwitch from 'primevue/toggleswitch'

export default {
  components: {
    DataTable,
    Column,
    MultiSelect,
    ToggleSwitch,
    Select,
    InputNumber
  },
  data() {
    return {
      vehiclesPrices: [],
      inportedVehicleprices: [],
      grandTotal: 0,
      goldTotal: 0,
      discount: null,
      grandTotalDiscount: null,
      grandTotalGeDiscount: null,
      techTreeVehicleTotal: 0, //nem lehet benne a squadronjármű-ár és a prém-jármű ár
      crewsAndSquadronVehiclePrices: 0,
      selectedColumns: [],
      columns: [
        { field: 'slCost', header: 'Vehicle cost' },
        { field: 'basicCrewTrainingCost', header: 'Basic Crew' },
        { field: 'expertCrewTrainingCost', header: 'Expert Crew' },
        { field: 'rpCost', header: 'Rp Cost' }
      ],
      selectedListOption: '',
      listOptions: [
        { label: 'Vehicle Cost', value: 'vehicleCost' },
        { label: 'Basic Crew', value: 'basicCrew' },
        { label: 'Expert Crew', value: 'expertCrew' }
      ],
      showVehicleTypes: false
    }
  },
  watch: {
    vehicles: {
      handler(newVehicles) {
        sessionStorage.setItem('vehicleData', JSON.stringify(newVehicles))
        this.calculateGrandTotal()
      },
      deep: true
    },
    discount() {
      this.calculateDiscountedPrice()
    }
  },
  mounted() {
    this.loadVehicles()
    this.calculateGrandTotal() // Ensure total is correct on load
    this.vehiclesPrices.forEach((vehicle) => {
      this.computeSelectedPrice(vehicle)
    })

    //console.log(this.vehiclesPrices)
  },
  methods: {
    onToggle(value) {
      this.selectedColumns = value
    },
    handleFileUpload(event) {
      const file = event.target.files[0] // Feltöltött fájl kiválasztása
      if (file) {
        // Ellenőrzés, hogy a fájl CSV-e
        if (!file.name.endsWith('.csv')) {
          toast.error('Invalid file format. Please upload a CSV file.')
          return
        }
        const reader = new FileReader()
        reader.onload = (e) => {
          const csv = e.target.result // CSV tartalom
          this.parseCSV(csv) // CSV feldolgozása
        }
        reader.readAsText(file) // Fájl beolvasása szövegként
      }
    },
    handleListOptionChange(vehicle) {
      // Find the vehicle in the sessionStorage and update its listOption
      const vehicleData = JSON.parse(sessionStorage.getItem('vehicleData')) || []

      // Find the specific vehicle by its ID or another unique identifier
      const index = vehicleData.findIndex((v) => v.id === vehicle.id)
      if (index !== -1) {
        // Update the listOption for the vehicle
        vehicleData[index].listOption = vehicle.listOption
        // Update sessionStorage with the modified vehicleData array
        sessionStorage.setItem('vehicleData', JSON.stringify(vehicleData))
      }
      this.computeSelectedPrice(vehicle)
      this.calculateGrandTotal()
    },
    parseCSV(fileContent) {
      const rows = fileContent.split('\n').map((row) => row.split(','))
      const headers = rows[0]

      if (headers.includes('Vehicle') && headers.includes('Nation')) {
        const importedData = rows.slice(1).map((row) => ({
          longName: row[headers.indexOf('Vehicle')],
          nation: row[headers.indexOf('Nation')],
          totalPrice: parseInt(row[headers.indexOf('Total')]) || 0,
          slCost: parseInt(row[headers.indexOf('Vehicle cost')]) || 0,
          basicCrewTrainingCost: parseInt(row[headers.indexOf('Basic Crew')]),
          expertCrewTrainingCost: parseInt(row[headers.indexOf('Expert Crew')]),
          listOption: row[headers.indexOf('List Option')],
          rpCost: parseInt(row[headers.indexOf('Rp Cost')]) || 0,
          vehicleType: row[headers.indexOf('Vehicle Type')],
          saleText: row[headers.indexOf('Sale Text')] || ''
          //totalPrice: parseInt(row[headers.indexOf('Cost')], 10) || 0
        }))

        // Tedd a feldolgozott adatokat a sessionStorage-ba
        const vehicleData = JSON.parse(sessionStorage.getItem('vehicleData')) || []
        const updatedData = [...vehicleData, ...importedData]
        sessionStorage.setItem('vehicleData', JSON.stringify(updatedData))
      } else {
        toast.error('CSV header does not match the expected format.')
        console.error('CSV header does not match the expected format.')
      }
      this.updateList()
      this.vehiclesPrices.forEach((vehicle) => {
        this.computeSelectedPrice(vehicle)
      })
    },
    loadVehicles() {
      this.vehiclesPrices = JSON.parse(sessionStorage.getItem('vehicleData') || '[]')
    },
    exportCSV() {
      const vehicleData = JSON.parse(sessionStorage.getItem('vehicleData')) || []
      console.log(vehicleData)
      const csvHeaders = [
        'Vehicle',
        'Nation',
        'Total',
        'Vehicle cost',
        'Basic Crew',
        'Expert Crew',
        'List Option',
        'Rp Cost',
        'Vehicle Type',
        'Sale Text'
      ]

      const csvRows = vehicleData.map((vehicle) => [
        vehicle.longName,
        vehicle.nation,
        vehicle.totalPrice,
        vehicle.slCost,
        vehicle.basicCrewTrainingCost,
        vehicle.expertCrewTrainingCost,
        vehicle.listOption,
        vehicle.rpCost,
        vehicle.vehicleType,
        vehicle.saleText || ''
      ])

      const csvContent = [csvHeaders.join(','), ...csvRows.map((row) => row.join(','))].join('\n')

      // Létrehozza és letölti a CSV fájlt
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
      const link = document.createElement('a')
      link.href = URL.createObjectURL(blob)
      link.setAttribute('download', 'vehicles.csv')
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    },
    calculateNationTotal(nation) {
      let total = 0
      this.vehiclesPrices.forEach((vehicle) => {
        if (vehicle.nation === nation) {
          total += parseInt(vehicle.totalPrice, 10) || 0 // Ensure it's a number
        }
      })
      return total
    },
    onRowEditSave(event) {
      const editedVehicle = event.data
      const index = this.vehiclesPrices.findIndex((vehicle) => vehicle.id === editedVehicle.id)
      if (index !== -1) {
        this.vehiclesPrices.splice(index, 1, { ...this.vehiclesPrices[index], ...editedVehicle })
        // Frissítjük a megfelelő elemet
      }
      sessionStorage.setItem('vehicleData', JSON.stringify(this.vehiclesPrices))
      this.calculateGrandTotal() // Frissítjük az összértéket
    },

    removeFromList(vehicle) {
      // A megadott járművet töröljük
      this.vehiclesPrices = this.vehiclesPrices.filter((v) => v.id !== vehicle.id)
      sessionStorage.setItem('vehicleData', JSON.stringify(this.vehiclesPrices))
      this.updateList() // Frissítjük a listát
    },
    computeSelectedPrice(vehicle) {
      const vehicleCostSL = vehicle.slCost
      const basicCrewTrainingCost = vehicle.basicCrewTrainingCost
      const expertCrewTrainingCost = vehicle.expertCrewTrainingCost

      switch (vehicle.listOption) {
        case 'expertCrew':
          vehicle.totalPrice = basicCrewTrainingCost + expertCrewTrainingCost + vehicleCostSL
          vehicle.infoText =
            'Calculated as: vehicle cost: ${vehicleCostSL}, basic crew cost: ${basicCrewTrainingCost}, expert crew cost: ${expertCrewTrainingCost}'
          break
        case 'basicCrew':
          vehicle.totalPrice = basicCrewTrainingCost + vehicleCostSL
          vehicle.infoText =
            'Calculated as: vehicle cost: ${vehicleCostSL}, basic crew cost: ${basicCrewTrainingCost}'
          break
        case 'vehicleCost':
          vehicle.infoText = 'Calculated as: vehicle cost: ${vehicleCostSL}'
          vehicle.totalPrice = vehicleCostSL
          break
        default:
          vehicle.totalPrice = vehicleCostSL // Always ensure a default value
          vehicle.infoText = `Calculated as: vehicle cost: ${vehicleCostSL}`
        // console.log('No valid list option selected for', vehicle.id)
      }
    },
    // kiszámolja az összesített jármű-crew összegeket discount előtt
    calculateGrandTotal() {
      //console.log(this.vehiclesPrices)
      this.techTreeVehicleTotal = 0
      this.crewsAndSquadronVehiclePrices = 0
      this.goldTotal = 0

      this.vehiclesPrices.forEach((vehicle) => {
        //console.log(vehicle)
        switch (vehicle.vehicleType) {
          case 'TT':
            this.techTreeVehicleTotal += vehicle.slCost
            break
          case 'SQ':
            this.crewsAndSquadronVehiclePrices += vehicle.slCost
            break
          case 'PR':
            this.goldTotal += vehicle.geCost
            break
          default:
            toast.error('OOF! (vehicletype)')
            break
        }

        //listoption alapján a crew árak:
        switch (vehicle.listOption) {
          case 'expertCrew':
            this.crewsAndSquadronVehiclePrices +=
              vehicle.basicCrewTrainingCost + vehicle.expertCrewTrainingCost
            // this.crewsAndSquadronVehiclePrices += vehicle.basicCrewPrice + vehicle.expertCrewPrice
            //this.infoText = Calculated as: vehicle cost: ${this.vehicle.vehicleCostSL || 0}, basic crew cost: ${this.vehicle.basicCrewTrainingCost}, expert crew cost: ${this.vehicle.exptertCrewTrtainigCost}
            break
          case 'basicCrew':
            this.crewsAndSquadronVehiclePrices += vehicle.basicCrewTrainingCost
            //this.crewsAndSquadronVehiclePrices += vehicle.basicCrewPrice
            //this.infoText = Calculated as: vehicle cost: ${this.vehicle.vehicleCostSL || 0}, basic crew cost: ${this.vehicle.basicCrewTrainingCost}
            break
          case 'vehicleCost':
            //vehiclecost már kezelve van fent
            // this.infoText = Calculated as: vehicle cost: ${this.vehicle.vehicleCostSL || '(vehicle cost is in Ge or free (reserve))'}
            break
          default:
            console.log('list option error')
            console.log(vehicle.listOption)
        }
      })

      this.grandTotal = this.techTreeVehicleTotal + this.crewsAndSquadronVehiclePrices
    },
    updateTotalPrice(vehicleData) {
      const vehicle = this.vehiclesPrices.find((v) => v.vehicle_id === vehicleData.vehicleId)
      if (vehicle) {
        // Frissítjük a jármű adatait a JSON alapján
        vehicle.vehicleTotal = vehicleData.vehicleTotal
        vehicle.vehicleGoldPrice = vehicleData.vehicleGoldPrice
        vehicle.vehiclePrice = vehicleData.vehiclePrice
        vehicle.basicCrewPrice = vehicleData.basicCrewPrice
        vehicle.expertCrewPrice = vehicleData.expertCrewPrice
        vehicle.vehicleId = vehicleData.vehicleId
        vehicle.selectedOption = vehicleData.selectedOption
        vehicle.vehicleType = vehicleData.vehicleType
        this.calculateGrandTotal()
      }
    },
    clearList() {
      this.vehiclesPrices = [] //
      sessionStorage.setItem('vehicleData', JSON.stringify([]))
      this.grandTotal = 0 // Reset grand total when list is cleared
      this.goldTotal = 0
    },
    updateList() {
      this.loadVehicles()
      this.calculateGrandTotal()
    },
    calculateDiscountedPrice() {
      if (this.discount === null) {
        toast.error('Please select a discount percentage!')
        return
      }

      this.grandTotalDiscount =
        this.techTreeVehicleTotal * (1 - this.discount) + this.crewsAndSquadronVehiclePrices
      this.grandTotalGeDiscount = this.goldTotal * (1 - this.discount)
    },
    removeRemovableVehicles() {
      //ha a jármű removable akkor mehet ki a listából
      this.vehiclesPrices = this.vehiclesPrices.filter((vehicle) => !vehicle.isRemovable)
      this.calculateGrandTotal()
      // Frissítjük a sessionStorage-t is
      sessionStorage.setItem('vehicleData', JSON.stringify(this.vehiclesPrices))
    },
    setAllVehicleOptionToVehiclepirce() {
      //mindegyik list option-t vehiclePrice-ra tenni
      for (let i = 0; i < this.vehiclesPrices.length; i++) {
        this.vehiclesPrices[i].listOption = 'vehicleCost'
      }
      this.vehiclesPrices.forEach((vehicle) => {
        this.computeSelectedPrice(vehicle)
      })
      this.calculateGrandTotal()
      sessionStorage.setItem('vehicleData', JSON.stringify(this.vehiclesPrices))
    }
  }
}
</script>

<style scoped>
.p-datatable-column-sorted {
  background: inherit !important;
}

.hidden {
  display: none;
}
.red {
  color: red;
  font-size: 1.5em;
  vertical-align: sub;
}
.pi-info-circle {
  display: inline !important; /* vagy inline */
  margin-left: 5px; /* kis távolság a név és az ikon között */
}
.vehicle-type-label {
  display: inline-block;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.8em;
  color: white;
}
.container-fluid {
  margin: 0 auto;
}

.list-container {
  margin: 0 auto;
  padding: 20px;
  background-color: #f5f5f5;
  border-radius: 8px;
  text-align: center;
}

h1 {
  color: #2e4451;
}

.vehicle-table {
  width: 100%;
  border: 2px solid #2e4451;
  margin-bottom: 20px;
}

.vehicle-table > th,
.vehicle-table > td {
  border: 2px solid #2e4451;
  padding: 10px;
  text-align: left;
}

.vehicle-table th {
  background-color: #2e4451;
  color: white;
}

.vehicle-table td {
  background-color: #dbe4ff;
}

button {
  padding: 10px 20px;
  margin: 10px 0;
  background-color: #2e4451;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

button:hover {
  background-color: #22323b;
}

.clear-list-btn {
  margin-bottom: 20px;
}

.reduceButtons {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 20px;
}

.discount {
  display: inline-block;
  margin-top: 20px;
}

.discount h4 {
  display: inline;
}

.discount input {
  margin-right: 10px;
}
.reduceButtons {
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
}
.removeButton {
  flex: end;
  background-color: rgba(255, 0, 0, 0.72);
  margin-left: 20px;
  margin-bottom: 20px;
}
.removeButton:hover {
  background-color: red;
}
.allToVehiclePriceButton {
  background-color: rgba(0, 128, 0, 0.72);
  margin-bottom: 20px;
}
.allToVehiclePriceButton:hover {
  background-color: green;
}
.list-container h1 {
  color: black;
}
.list-container {
  max-width: 1799px;
  margin-top: 30px;
  margin-left: auto;
  margin-right: auto;
  padding: 20px;
  background-color: #f5f5f5;
  border-radius: 8px;
}

.vehicle-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
}

.vehicle-table th,
.vehicle-table td {
  border: 2px solid #2e4451;
  padding: 10px;
  text-align: left;
}

.vehicle-table th {
  background-color: #2e4451;
  color: #ffffff;
}

.vehicle-table td {
  background-color: #dbe4ff;
}

button {
  padding: 10px 20px;
  background-color: #2e4451;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

button:hover {
  background-color: #22323b;
}
.discount {
  display: inline;
}
.vehicle-tt {
  background-color: #416173; /* Kék háttér */
}

.vehicle-sq {
  background-color: #5c8655; /* Zöld háttér */
}

.vehicle-pr {
  background-color: #7f6c38; /* Arany háttér */
}
</style>
