<template>
  <p class="rank">this is a rank {{ rank }}, for {{ nation }} {{ branch }}</p>
  <!--<p>Vehcicles of the techtree are going here</p>-->
  <div class="rank">
    <div class="techtree">
      <div>
        <VehicleModel
          class="card"
          :rank="rank"
          :nation="nation"
          :branch="branch"
          :isPlacedInTechTree="true"
        />
      </div>
    </div>
    <!--<p>Premium / event vehicles are going here</p>-->
    <div class="premtree">
      <div>
        <VehicleModel
          class="card"
          :rank="rank"
          :nation="nation"
          :branch="branch"
          :isPlacedInTechTree="false"
        />
      </div>
    </div>
  </div>
</template>

<script>
import VehicleModel from './VehicleModel.vue'

export default {
  components: {
    VehicleModel
  },
  props: {
    rank: String,
    nation: String,
    branch: Number
  },
  mounted() {
    //amikor a teier-ek mountolódnak  akkor kéne járműlistát lekérni
  }
}
</script>

<style scoped>
.rank {
  display: flex;
  gap: 20px;
  background-color: #242e33;
  background-color: #242e33;
  border-color: darkgray;
  border: 5px solid;
}
.techtree,
.premtree {
  display: flex;
  /* Kártyák tördelése több sorra */
  gap: 10px;
}
.techtree {
  display: flex;
  flex-wrap: wrap; /* Tördelés több sorba */

  align-items: flex-start;
  justify-content: flex-start;
  align-content: flex-start;
  gap: 10px;
  flex: 5;
  background-color: #242e33;
}
.premtree {
  justify-content: flex-start;
  align-items: flex-start;
  align-content: flex-start;
  flex: 2;
  background-color: #3c341b;
  display: flex;
  flex-wrap: wrap; /* Tördelés több sorba */
  gap: 10px;
}
.techtree .card {
  flex: 1 1 calc(20% - 10px);
}
.premtree .card {
  flex: 1 1 calc(50% - 10px);
}
.card :hover {
  background-color: #48687a;
}
</style>
