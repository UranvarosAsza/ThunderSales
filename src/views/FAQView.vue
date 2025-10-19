<template>
  <div class="faq-container">
    <h1>{{ $t('UI_FAQ.title') }}</h1>

    <div class="faq-item" v-for="(faq, index) in faqs" :key="index">
      <h3>{{ $t(`UI_FAQ.q${index + 1}`) }}</h3>
      <p>{{ $t(`UI_FAQ.a${index + 1}`) }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
// FAQ számok (hány kérdés van)
const faqs = Array.from({ length: 5 }, (_, i) => i)
</script>

<style scoped>
.faq-container {
  max-width: 800px;
  margin: 2rem auto;
  padding: 2rem;
  background-color: #2e4451;
  border-radius: 10px;
  color: white;
}

.faq-item {
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}

.faq-item:last-child {
  border-bottom: none;
}

h1 {
  text-align: center;
  margin-bottom: 2rem;
}

h3 {
  color: #4a9eff;
  margin-bottom: 0.5rem;
}

p {
  line-height: 1.6;
}
</style>
