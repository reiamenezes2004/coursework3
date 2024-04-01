<template>
  <div class="activity-box">
    <!-- Loop through sortedProducts and display lesson items -->
    <div v-for="activity in sortedProducts" :key="activity.id" class="activity-item">
      <!-- Lesson item content -->
      <figure>
        <img :src="activity.image" alt="Activity Image">
      </figure>
      <div class="activity-details">
        <h2>{{ activity.title }}</h2>
        <p>{{ activity.location }}</p>
        <p>Available Spaces: {{ activity.availableInventory }}</p>
        <p class="activity-price">Price: AED {{ activity.price }}</p>
        <div>
          <span v-for="n in activity.rating" :key="n" class="star">★</span>
          <span v-for="n in 5 - activity.rating" :key="n" class="star">☆</span>
        </div>
        <button @click="addToCart(activity)" :disabled="!canAddToCart(activity)" :class="{ 'sold-out-button': !canAddToCart(activity) }" class="buy-button">
          {{ canAddToCart(activity) ? 'Add to cart' : 'All out!' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    sortedProducts: Array // Passed from parent component
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
.activity-box {
  display: flex;
  flex-wrap: wrap;
  padding-left: 35px;
}

.activity-item {
  box-sizing: border-box;
  width: 250px;
  margin: 10px;
  border: 5px solid #00007F;
  background-color: #92BBFF;
  border-radius: 32px;
  overflow: hidden;
  text-align: justify;
}

.activity-item figure {
  width: 70%;
  height: 130px;
  overflow: hidden;
}

.activity-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.activity-item .activity-details {
  padding: 3px;
}

.activity-item h2 {
  font-size: 15pt;
  text-align: center;
}

.activity-item button {
  background-color: #000033;
  border-radius: 10px;
  border: none;
  color: white;
  padding: 10px 10px;
  text-align: center;
  display: inline-block;
  font-size: 18px;
  margin: 4px 2px;
  cursor: pointer;
}

.buy-button.sold-out-button {
  background-color: #FF6666;
  cursor: not-allowed;
}

.star {
  color: gold;
}
</style>