<template>
  <div id="app">
    <!-- Header -->
    <header>
      <!-- Header content -->
      <h1>{{ sitename }}</h1>
      <input type="text" v-model="search" @input="searchLessons(search)" placeholder="Search">
      <!-- Sorting dropdown -->
      <div class="sort">
        <label for="sortSelect">Sort by:</label>
        <select id="sortSelect" v-model="selectedSort" @change="sortProducts">
          <!-- Sorting options -->
          <option value="all">All</option>
          <option value="title">Subject (Ascending)</option>
          <option value="titleDesc">Subject (Descending)</option>
          <option value="location">Location (Ascending)</option>
          <option value="locationDesc">Location (Descending)</option>
          <option value="availableInventory">Available Spaces</option>
          <option value="priceLowtoHigh">Price: Low to High</option>
          <option value="priceHightoLow">Price: High to Low</option>
        </select>
      </div>
      <!-- Checkout button -->
      <button class="checkout-button" @click="showCheckout" :disabled="cart.length === 0">
        <span class="cart-icon fas fa-cart-plus"></span>
        Checkout ({{ cartItemCount }})
      </button>
    </header>

    <!-- Main content -->
    <main>
      <!-- Display LessonList or Checkout component based on showActivity -->
      <LessonList v-if="showActivity" :sortedProducts="sortedProducts" @add-to-cart="addToCart" />
      <Checkout v-else @show-activity="showActivity = true" />
      
      <!-- Other main content -->
      <div class="other-content">
        <h2>Featured Activities</h2>
        <!-- Add featured activities carousel or other promotional content -->
        <!-- For example: -->
        <div class="carousel">
          <!-- Carousel items go here -->
        </div>
        <!-- Additional content sections can be added here -->
      </div>
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
      sitename: "After School Activities",
      showActivity: true,
      activities: [], // Placeholder for activities data
      selectedSort: [],
      search: '',
      cart: [],
      sortedProducts: [],
      order: {
        name: '',
        number: ''
      },
      cartItems: [],
    };
  },
  created() {
    // Fetch activities data from the server or initialize it here
    console.log("Requesting data from server");
    fetch('http://localhost:4000/collection/lessons')
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch activities data');
        }
        return response.json();
      })
      .then(data => {
        this.activities = data;
        this.sortProducts(); // Call sortProducts after activities data is fetched
        console.log(data);
      })
      .catch(error => {
        console.error('Error fetching activities data:', error);
      });
  },
  methods: {
    sortProducts() {
      let activitiesArray = this.activities.slice(0);

      switch (this.selectedSort) {
        case 'title':
          activitiesArray.sort((a, b) => a.title.localeCompare(b.title)); // shows
          break;
        case 'titleDesc':
          activitiesArray.sort((a, b) => b.title.localeCompare(a.title));
          break;
        case 'location':
          activitiesArray.sort((a, b) => a.location.localeCompare(b.location));
          break;
        case 'locationDesc':
          activitiesArray.sort((a, b) => b.location.localeCompare(a.location));
          break;
        case 'availableInventory':
          activitiesArray.sort((a, b) => a.availableInventory - b.availableInventory);
          break;
        case 'priceLowtoHigh':
          activitiesArray.sort((a, b) => a.price - b.price);
          break;
        case 'priceHightoLow':
          activitiesArray.sort((a, b) => b.price - a.price);
          break;
        default:
          break;
      }

      if (this.search.trim() !== '') {
        activitiesArray = activitiesArray.filter(activity =>
          activity.title.toLowerCase().includes(this.search.toLowerCase()) ||
          activity.location.toLowerCase().includes(this.search.toLowerCase())
        );
      }
      this.sortedProducts = activitiesArray;
    },
    addToCart(activity) {
      if (this.canAddToCart(activity) && activity.availableInventory > 0) {
        // Update the local cart
        this.cart.push(activity._id); // activity has an _id property

        // Add the item to the cartItems list for display purposes
        this.cartItems.push({
          id: activity._id,
          title: activity.title,
          image: activity.image,
        });

        // Decrease the available inventory of the activity
        activity.availableInventory--;

        // Send a POST request to the server to update the database
        fetch(`http://localhost:4000/collection/cart`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id: activity._id,
            title: activity.title,
            image: activity.image,
          })
        })
          .then(response => {
            if (response.ok) {
              console.log("Item added to cart successfully");
            } else {
              console.log("Failed to add item to cart");
            }
          })
          .catch(error => {
            console.error("Error adding item to cart:", error);
          });
      }
    },
    canAddToCart(activity) {
      // Check if the activity is already in the cart
      return !this.cart.includes(activity._id) && activity.availableInventory > 0;
    },
    showCheckout() {
      this.showActivity = false;
    },
    searchLessons(search) {
      this.search = search;
      this.sortProducts();
    }
  },
  computed: {
    cartItemCount() {
      return this.cart.length;
    }
  },
  watch: {
    selectedSort() {
      this.sortProducts();
    }
  }
};
</script>

<style scoped>
/* Styles specific to App.vue */
#app {
  font-family: Arial, sans-serif;
  margin: 0;
  padding: 0;
}

header {
  background-color: #333;
  color: #fff;
  padding: 20px;
}

h1 {
  margin: 0;
}

.sort {
  display: inline-block;
  margin-left: 20px;
}

.sort select {
  padding: 5px;
}

.sort label {
  color: #fff;
}

.sort select,
.checkout-button {
  font-size: 14px;
}

.checkout-button {
  background-color: #4CAF50;
  border: none;
  color: white;
  padding: 10px 20px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin-left: 20px;
  cursor: pointer;
}

.checkout-button:disabled {
  background-color: #aaa;
  cursor: not-allowed;
}

.cart-icon {
  margin-right: 5px;
}

main {
  padding: 20px;
}

.other-content {
  margin-top: 20px;
}

/* .carousel { */
  /* Styles for the featured activities carousel */
/* } */
</style>
