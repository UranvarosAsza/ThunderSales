<template>
  <div class="container-fluid">
    <div class="list-container">
      <h1>Here is your list:</h1>

      <DataTable
        :value="vehiclesPrices"
        rowGroupMode="subheader"
        groupRowsBy="nation"
        stripedRows
        class="vehicle-table"
        editMode="cell"
        @cell-edit-complete="onCellEditComplete"
        showGridlines
        removableSort
        :pt="{
          table: { style: 'min-width: 50rem' },
          column: {
            bodycell: ({ state }) => ({
              class: [{ '!py-0': state['d_editing'] }]
            })
          }
        }"
      >
        <template #header v-if="vehiclesPrices.length">
          <div class="headerButtons">
            <div style="text-align: left">
              <MultiSelect
                v-model="selectedColumns"
                :options="columns"
                optionLabel="header"
                placeholder="Add more columns"
              />
              <span class="vehicleTypeSwitch">
                Show vehicle's types
                <ToggleSwitch class="toggleSwitch" v-model="showVehicleTypes" />
              </span>
            </div>
            <div class="reduceButtons" style="text-align: right">
              <!-- 
                  <button @click="logVehicleData">Log</button>
              -->
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
        <Column field="totalSL" header="Total" sortable :sortFunction="sortByTotalSL">
          <template #body="slotProps">
            <span v-if="slotProps.data.totalGE > 0">
              {{ slotProps.data.totalGE.toLocaleString('hu-HU') }} Ge
            </span>
            <span v-if="slotProps.data.totalSL > 0">
              {{ slotProps.data.totalSL.toLocaleString('hu-HU') }} Sl
            </span>
          </template>
        </Column>
        <Column
          v-for="(col, index) in selectedColumns"
          :field="col.field"
          :header="col.header"
          :key="col.field + '_' + index"
          :sortable="col.sortable"
        >
          <template #body="slotProps">
            {{ slotProps.data[col.field] }}
          </template>
          <template v-if="col.field === 'rpCost'" #editor="slotProps">
            <InputNumber
              v-model="slotProps.data.rpCost"
              :min="0"
              :max="slotProps.data.originalRpCost"
              @change="validateRPValue(slotProps.data)"
              :showButtons="false"
            />
          </template>
        </Column>
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
        <template #groupheader="slotProps">
          <div class="flex items-center gap-2">
            <span>{{ setNationName(slotProps.data.nation) }} </span>
          </div>
        </template>
        <template #groupfooter="slotProps">
          <div class="flex justify-end font-bold w-full">
            Total Cost in Nation:
            {{ calculateNationTotal(slotProps.data.nation) }}
          </div>
        </template>
        <template #footer>
          <div style="text-align: left">
            <div v-if="vehiclesPrices.length" class="discount">
              <button @click="clearList">Clear list</button>
              <h2>
                Your total costs for all nations are:
                <span v-if="goldTotal > 0"> {{ goldTotal.toLocaleString('hu-HU') }} GE </span>
                <span v-if="grandTotal > 0"> {{ grandTotal.toLocaleString('hu-HU') }} SL </span>
              </h2>
              <div>
                Select the discount percentage:
                <button @click="calculateDiscountedPrice(discount)">Calculate</button>
                <label>
                  <input type="radio" v-model="discount" value="0.3" />
                  30%
                </label>
                <label>
                  <input type="radio" v-model="discount" value="0.5" />
                  50%
                </label>
                <div v-if="grandTotalDiscount">
                  <h2>
                    You need to save
                    {{ grandTotalGeDiscount.toLocaleString('hu-HU') }} GE
                    <span v-if="grandTotalDiscount">
                      and {{ grandTotalDiscount.toLocaleString('hu-HU') }} Sl
                    </span>
                    for a {{ discount * 100 }}% sale
                  </h2>
                </div>
              </div>

              <div style="text-align: left">
                <div>
                  You want to save the list for later?
                  <button
                    class="btn btn-secondary saveBtn"
                    label="Export"
                    @click="exportCSV($event)"
                  >
                    Export
                  </button>
                </div>
              </div>
            </div>
            <div class="fileUpload">
              Allready have a list? add it here:
              <input type="file" @change="handleFileUpload" class="form-label" />
            </div>
          </div>
        </template>
      </DataTable>
    </div>
  </div>
</template>

<script>
import { toast } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'
import updates from '@/assets/updates.json'
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
    // eslint-disable-next-line vue/no-reserved-component-names
    Select,
    InputNumber
  },
  data() {
    return {
      vehiclesPrices: [],
      grandTotal: 0,
      goldTotal: 0,
      discount: null,
      grandTotalDiscount: null,
      grandTotalGeDiscount: null,
      techTreeVehicleTotal: 0, //nem lehet benne a squadronjármű-ár és a prém-jármű ár
      crewsAndSquadronVehiclePrices: 0,
      selectedColumns: [],
      columns: [
        { field: 'slCost', header: 'Vehicle cost', sortable: true },
        { field: 'basicCrewTrainingCost', header: 'Basic Crew', sortable: true },
        { field: 'expertCrewTrainingCost', header: 'Expert Crew', sortable: true },
        { field: 'rpCost', header: 'RP Cost', sortable: true }
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

    this.setSaleText()
    this.vehiclesPrices.forEach((vehicle) => {
      this.computeSelectedPrice(vehicle)
    })
    this.calculateGrandTotal() // Ensure total is correct on load
  },
  methods: {
    logVehicleData() {
      const sessStorageVehiclePrices = this.getVehicleData()
      console.log('sessStorageVehiclePrices: ')
      console.log(sessStorageVehiclePrices)
    },
    getVehicleData() {
      return JSON.parse(sessionStorage.getItem('vehicleData')) || []
    },
    setVehicleData(data) {
      sessionStorage.setItem('vehicleData', JSON.stringify(data))
      this.vehiclesPrices = data // Frissítjük a lokális változót is
    },
    loadVehicles() {
      this.vehiclesPrices = this.getVehicleData()
    },
    onToggle(value) {
      this.selectedColumns = value
    },
    isColumnSelected(field) {
      return this.selectedColumns.some((col) => col.field === field)
    },
    sortByTotalSL(event) {
      event.data.sort((a, b) => {
        const value1 = a.totalSL || 0 // Ha nincs érték, akkor 0
        const value2 = b.totalSL || 0 // Ha nincs érték, akkor 0

        let result = 0
        if (value1 < value2) result = -1
        else if (value1 > value2) result = 1

        return event.order * result
      })
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
    parseCSV(fileContent) {
      const rows = fileContent.split('\n').map((row) => row.split(';'))
      const headers = rows[0]

      if (headers.includes('Vehicle') && headers.includes('Nation')) {
        const importedData = rows.slice(1).map((row) => ({
          id: row[headers.indexOf('id')],
          longName: row[headers.indexOf('Vehicle')],
          nation: row[headers.indexOf('Nation')],
          isMarket: row[headers.indexOf('Market')] === 'true',
          isEvent: row[headers.indexOf('Event')] === 'true',
          isPrem: row[headers.indexOf('Premium')] === 'true',
          geCost: parseInt(row[headers.indexOf('GE Cost')]) || 0,
          slCost: parseInt(row[headers.indexOf('SL cost')]) || 0,
          basicCrewTrainingCost: parseInt(row[headers.indexOf('Basic Crew')]) || 0,
          expertCrewTrainingCost: parseInt(row[headers.indexOf('Expert Crew')]) || 0,
          rpCost: parseInt(row[headers.indexOf('Rp Cost')]) || 0,
          listOption: row[headers.indexOf('List Option')],
          vehicleType: row[headers.indexOf('Vehicle Type')],
          saleText: row[headers.indexOf('Sale Text')] || '',
          release_date: row[headers.indexOf('Release Date')] || 0,
          totalPrice: parseInt(row[headers.indexOf('Total')]) || 0,
          isRemovable: row[headers.indexOf('Removable')] === 'true'
        }))

        // Tedd a feldolgozott adatokat a sessionStorage-ba
        const vehicleData = this.getVehicleData()
        const updatedData = [...vehicleData]
        importedData.forEach((vehicle) => {
          const exists = vehicleData.some((v) => v.id === vehicle.id)
          if (!exists) {
            updatedData.push(vehicle)
          }
        })
        updatedData.sort((a, b) => {
          if (a.nation < b.nation) return -1
          if (a.nation > b.nation) return 1
          if (a.longName < b.longName) return -1
          if (a.longName > b.longName) return 1
          return 0
        })
        this.setVehicleData(updatedData)
      } else {
        toast.error('CSV header does not match the expected format.')
        console.error('CSV header does not match the expected format.')
      }
      this.updateList()
      this.vehiclesPrices.forEach((vehicle) => {
        this.computeSelectedPrice(vehicle)
      })
    },
    exportCSV() {
      const vehicleData = this.getVehicleData()
      const csvHeaders = [
        'id',
        'Vehicle',
        'Nation',
        'Market',
        'Event',
        'Premium',
        'GE Cost',
        'SL cost',
        'Basic Crew',
        'Expert Crew',
        'Rp Cost',
        'List Option',
        'Vehicle Type',
        'Sale Text',
        'Release Date',
        'Total',
        'Removable'
      ]

      const csvRows = vehicleData.map((vehicle) => [
        vehicle.id,
        vehicle.longName,
        vehicle.nation,
        vehicle.isMarket || false,
        vehicle.isEvent || false,
        vehicle.isPrem || false,
        vehicle.geCost,
        vehicle.slCost,
        vehicle.basicCrewTrainingCost,
        vehicle.expertCrewTrainingCost,
        vehicle.rpCost,
        vehicle.listOption,
        vehicle.vehicleType,
        vehicle.saleText || '',
        vehicle.release_date || 0,
        vehicle.totalPrice,
        vehicle.isRemovable
      ])

      const csvContent = [csvHeaders.join(';'), ...csvRows.map((row) => row.join(';'))].join('\n')

      // Létrehozza és letölti a CSV fájlt
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
      const link = document.createElement('a')
      link.href = URL.createObjectURL(blob)
      link.setAttribute('download', 'vehicles.csv')
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    },
    onCellEditComplete(event) {
      let { originalEvent, data, newValue, field } = event

      if (field === 'rpCost') {
        if (this.isPositiveInteger(newValue) && newValue <= data.originalRpCost) {
          data[field] = newValue

          // Save the updated value to sessionStorage
          const vehicleData = this.getVehicleData()
          const vehicleIndex = vehicleData.findIndex((v) => v.id === data.id)
          if (vehicleIndex !== -1) {
            vehicleData[vehicleIndex].rpCost = newValue
            this.setVehicleData(vehicleData)
            console.log('RP cost updated successfully.')
          }

          // Esemény fókusz elvételhez
          if (originalEvent && originalEvent.target) {
            originalEvent.target.blur()
          }
        } else {
          event.preventDefault()
          console.log('RP cost must be between 0 and the original RP cost.')
        }
      } else {
        if (newValue.trim().length > 0) {
          data[field] = newValue
        } else {
          event.preventDefault()
        }
      }
    },
    isPositiveInteger(val) {
      let str = String(val).trim()
      if (!str) return false
      str = str.replace(/^0+/, '') || '0'
      let n = Math.floor(Number(str))
      return n !== Infinity && String(n) === str && n >= 0
    },
    validateRPValue(vehicle) {
      console.log(vehicle)

      if (vehicle.rpCost < 0 || vehicle.rpCost > vehicle.originalRpCost) {
        // Show validation message or revert to the original value
        console.log('RP cost must be between 0 and the original RP cost.')
        vehicle.rpCost = vehicle.originalRpCost
      }
    },

    removeRemovableVehicles() {
      //ha a jármű removable akkor mehet ki a listából
      let vehiclesPrices = this.getVehicleData()
      vehiclesPrices = vehiclesPrices.filter((vehicle) => !vehicle.isRemovable)
      this.calculateGrandTotal()
      this.setVehicleData(vehiclesPrices)
    },
    setAllVehicleOptionToVehiclepirce() {
      //mindegyik list option-t vehiclePrice-ra teszi
      let vehiclesPrices = this.getVehicleData()
      for (let i = 0; i < vehiclesPrices.length; i++) {
        vehiclesPrices[i].listOption = 'vehicleCost'
      }
      vehiclesPrices.forEach((vehicle) => {
        this.computeSelectedPrice(vehicle)
      })
      this.calculateGrandTotal()
      this.setVehicleData(vehiclesPrices)
    },
    handleListOptionChange(vehicle) {
      // Find the vehicle in the sessionStorage and update its listOption
      let vehicleData = this.getVehicleData()
      // Find the specific vehicle by its ID or another unique identifier
      let index = vehicleData.findIndex((v) => v.id === vehicle.id)
      if (index !== -1) {
        // Update the listOption for the vehicle
        vehicleData[index].listOption = vehicle.listOption
        // Update sessionStorage with the modified vehicleData array
        this.setVehicleData(vehicleData)
      }
      this.computeSelectedPrice(vehicle)
      this.calculateGrandTotal()
    },
    removeFromList(vehicle) {
      // A megadott járművet töröljük
      let vehiclesPrices = this.getVehicleData()
      vehiclesPrices = vehiclesPrices.filter((v) => v.id !== vehicle.id)
      this.setVehicleData(vehiclesPrices)
      this.updateList() // Frissítjük a listát
    },
    clearList() {
      this.vehiclesPrices = [] //
      this.setVehicleData(this.vehiclesPrices)
      this.grandTotal = 0 // Reset grand total when list is cleared
      this.goldTotal = 0
    },
    updateList() {
      this.loadVehicles()
      this.calculateGrandTotal()
      this.setSaleText()
    },
    computeSelectedPrice(vehicle) {
      let vehicleData = this.getVehicleData()
      const index = vehicleData.findIndex((v) => v.id === vehicle.id)
      if (index !== -1) {
        const vehicleCostSL = vehicle.slCost
        const vehicleCostGE = vehicle.geCost
        const basicCrewTrainingCost = vehicle.basicCrewTrainingCost
        const expertCrewTrainingCost = vehicle.expertCrewTrainingCost

        switch (vehicle.listOption) {
          case 'expertCrew':
            vehicleData[index].totalSL =
              basicCrewTrainingCost + expertCrewTrainingCost + vehicleCostSL
            vehicleData[index].totalGE = vehicleCostGE
            break
          case 'basicCrew':
            vehicleData[index].totalSL = basicCrewTrainingCost + vehicleCostSL
            vehicleData[index].totalGE = vehicleCostGE
            break
          case 'vehicleCost':
            vehicleData[index].totalSL = vehicleCostSL
            vehicleData[index].totalGE = vehicleCostGE
            break
          default:
            vehicleData[index].totalSL = vehicleCostSL // Default érték
            vehicleData[index].totalGE = vehicleCostGE
        }

        // Update sessionStorage with the modified data
        this.setVehicleData(vehicleData)
        this.vehiclesPrices = vehicleData
      }
    },
    calculateNationTotal(nation) {
      let nationTotalGe = 0
      let nationTotalSl = 0
      let vehiclesPrices = this.getVehicleData()
      vehiclesPrices.forEach((vehicle) => {
        if (vehicle.nation === nation) {
          nationTotalSl += parseInt(vehicle.totalSL, 10) || 0 // Ensure it's a number
          nationTotalGe += parseInt(vehicle.totalGE, 10)
        }
      })

      let result = ''

      if (nationTotalGe !== 0) {
        result += nationTotalGe.toLocaleString('hu-HU') + ' GE '
      }

      if (nationTotalSl !== 0) {
        result += nationTotalSl.toLocaleString('hu-HU') + ' SL '
      }

      return result.trim()
    },
    calculateGrandTotal() {
      // kiszámolja az összesített jármű-crew összegeket discount előtt
      this.techTreeVehicleTotal = 0
      this.crewsAndSquadronVehiclePrices = 0
      this.goldTotal = 0

      let vehiclesPrices = this.getVehicleData()
      if (vehiclesPrices.length != 0) {
        vehiclesPrices.forEach((vehicle) => {
          switch (vehicle.vehicleType) {
            case 'TT':
              this.techTreeVehicleTotal += vehicle.slCost
              break
            case 'SQ':
              this.crewsAndSquadronVehiclePrices += vehicle.slCost
              break
            case 'PR':
              this.goldTotal += vehicle.totalGE
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
              //this.infoText = Calculated as: vehicle cost: ${this.vehicle.vehicleCostSL || 0}, basic crew cost: ${this.vehicle.basicCrewTrainingCost}, expert crew cost: ${this.vehicle.exptertCrewTrtainigCost}
              break
            case 'basicCrew':
              this.crewsAndSquadronVehiclePrices += vehicle.basicCrewTrainingCost
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
      }

      this.grandTotal = this.techTreeVehicleTotal + this.crewsAndSquadronVehiclePrices
      this.setVehicleData(vehiclesPrices)
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
    setNationName(nation) {
      return nation.charAt(0).toUpperCase() + nation.slice(1)
    },
    setSaleText() {
      //Végigmegy minegyiken, mountoláskor és update-kor
      //ha squadronjármű vagy a dátuma az utolsó 2 patch dátumánál korábbi akkor nem lesz leárazva
      let vehicleData = this.getVehicleData()
      vehicleData.forEach((vehicle) => {
        if (vehicle.vehicleType == 'SQ') {
          vehicle.saleText = ' This is a squadron vehicle, the discount does not apply'
          vehicle.isRemovable = true
        } else if (vehicle.release_date > updates.updates[2].start_date) {
          vehicle.saleText =
            ' This is a new vehicle, only vehicles introduced after ' +
            updates.updates[2].name +
            ' are discounted'
          vehicle.isRemovable = true
        }
      })
      // Update sessionStorage with the modified data
      this.setVehicleData(vehicleData)
    },
    calculateDiscountedPrice() {
      //FIXME wtf is this ?
      if (this.discount === null) {
        toast.error('Please select a discount percentage!')
        return
      }

      this.grandTotalDiscount =
        this.techTreeVehicleTotal * (1 - this.discount) + this.crewsAndSquadronVehiclePrices
      this.grandTotalGeDiscount = this.goldTotal * (1 - this.discount)
    }
  }
}
</script>

<style scoped>
.saveBtn,
fileUpload {
  margin-left: 5px;
}
.vehicleTypeSwitch {
  margin-left: 20px;
}
.vehicleTypeSwitch .toggleSwitch {
  vertical-align: middle !important;
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
