<template>
  <div id="app">
    <!-- Header -->
    <header>
      <!-- Header content -->
    </header>
    <main>
      <LessonList v-if="showActivity" :sortedProducts="sortedProducts" @add-to-cart="addToCart" />
      <Checkout v-else @show-activity="showActivity = true" />
      <!-- Other main content -->
    </main>
  </div>
</template>

<script>
import LessonList from './components/LessonList.vue';
import Checkout from './components/Checkout.vue';

export default {
  name: 'App',
  components: {
    LessonList,
    Checkout
  },
  data() {
    return {
      showActivity: false, // Flag to toggle between LessonList and Checkout
      sortedProducts: [], // Array to store lesson products
    };
  },
  methods: {
 addToCart(activity) {
    // Emit an event to notify the parent component that an activity has been added to the cart
    this.$emit('add-to-cart', activity);
  },
  canAddToCart(activity) {
    return activity.availableInventory > 0;
  }
  }
}
</script>

<style scoped>
/* Styles specific to App.vue */
</style>
