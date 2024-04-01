<template>
  <div id="app">
    <header>
      <h1>{{ sitename }}</h1>
      <input
        type="text"
        v-model="search"
        @input="searchLessons"
        placeholder="Search"
      />
      <div class="sort">
        <label for="sortSelect">Sort by:</label>
        <select id="sortSelect" v-model="selectedSort" @change="sortProducts">
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
      <button
        class="checkout-button"
        @click="showCheckout"
        :disabled="cart.length === 0"
      >
        <span class="cart-icon fas fa-cart-plus"></span>
        Checkout ({{ cartItemCount }})
      </button>
    </header>
    <main>
      <div v-if="showActivity" class="activity-box">
        <div
          v-for="activity in sortedProducts"
          :key="activity.id"
          class="activity-item"
        >
          <figure>
            <img :src="activity.image" alt="Activity Image" />
          </figure>
          <div class="activity-details">
            <h2>{{ activity.title }}</h2>
            <p>{{ activity.location }}</p>
            <p>Available Spaces: {{ activity.availableInventory }}</p>
            <p class="activity-price">Price: AED {{ activity.price }}</p>
            <div>
              <span v-bind="n in activity.rating">★</span>
              <span v-bind="n in 5 - activity.rating">☆</span>
            </div>
            <lesson-list @addProduct="addToCart"></lesson-list>
            <checkout :cart="cart"></checkout>
            <button
              @click="addToCart(activity)"
              :disabled="!canAddToCart(activity)"
              :class="{ 'sold-out-button': !canAddToCart(activity) }"
              class="buy-button"
            >
              {{ canAddToCart(activity) ? "Add to cart" : "All out!" }}
            </button>
          </div>
        </div>
      </div>

      <div v-else>
        <div class="checkout-container">
          <h2>Checkout</h2>
          <p>
            <strong>Name:</strong>
            <input
              v-model.trim="order.name"
              @input="validateName"
              title="Enter your full name (letters only)"
              required
            />
          </p>
          <p>
            <strong>Number:</strong>
            <input
              v-model.trim="order.number"
              @input="validateNumber"
              title="Enter your phone number (numbers only)"
              required
            />
          </p>
          <button
            @click="submitForm"
            :disabled="!isFormValid"
            class="place-order-button"
          >
            Place Order!
          </button>
        </div>
      </div>

      <div v-if="!showActivity">
        <h2>Cart</h2>
        <div v-if="cartItems.length === 0">
          <p>Your Cart is Empty!</p>
        </div>
        <div
          v-for="cartItem in cartItems"
          :key="cartItem.id"
          class="activity-item"
        >
          <figure>
            <img :src="cartItem.image" alt="Activity Image" />
          </figure>
          <div class="activity-details">
            <h2>{{ cartItem.title }}</h2>
            <button
              style="cursor: pointer; color: red"
              @click="removeFromCart(cartItem)"
            >
              Delete Activity
            </button>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import LessonList from "./components/LessonList.vue";
import Checkout from "./components/Checkout.vue";

export default {
  name: "App",
  components: {
    LessonList,
    Checkout,
  },
  data() {
    return {
      sitename: "After School Activities",
      showActivity: true,
      activities: [],
      selectedSort: [],
      search: "",
      cart: [],
      sortedProducts: [],
      order: {
        name: "",
        number: "",
      },
      cartItems: [],
    };
  },
  created() {
    console.log("Fetching lessons data from server...");
    fetch("http://localhost:4000/collection/lessons")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch lessons data");
        }
        return response.json();
      })
      .then((data) => {
        this.activities = data;
        this.sortProducts();
        console.log("Lessons data fetched successfully:", data);
      })
      .catch((error) => {
        console.error("Error fetching lessons data:", error);
      });
  },
  methods: {
    addToCart: function (activity) {
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
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: activity._id,
            title: activity.title,
            image: activity.image,
          }),
        })
          .then((response) => {
            if (response.ok) {
              console.log("Item added to cart successfully");
            } else {
              console.log("Failed to add item to cart");
            }
          })
          .catch((error) => {
            console.error("Error adding item to cart:", error);
          });
      }
    },
    removeFromCart(cartItem) {
      // Find the index of the cart item in the cartItems array
      const index = this.cartItems.findIndex((item) => item.id === cartItem.id);

      // If the item is found, remove it from both cart and cartItems arrays
      if (index !== -1) {
        this.cart.splice(index, 1); // Remove from cart array
        this.cartItems.splice(index, 1); // Remove from cartItems array
        console.log("The lesson has been removed from the cart.");
      }
    },

    submitForm() {
      const order = {
        name: this.order.name,
        number: this.order.number,
        cartItems: this.cartItems,
      };

      fetch(`http://localhost:4000/collection/orders`, {
        method: "POST", // Use PUT method
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(order),
      })
        .then((response) => {
          if (response.ok) {
            console.log("Order placed successfully!");
            this.cartItems = [];
            this.updateInventory(order); // Call the updateInventory method after placing the order
            return response.json();
          } else {
            throw new Error("Failed to place order");
          }
        })
        .then((data) => {
          // Handle additional logic related to the response data if needed
        })
        .catch((error) => {
          console.error("Error placing order:", error);
        });
    },

    showCheckout() {
      this.showActivity = !this.showActivity;
    },
    canAddToCart: function (activity) {
      return activity.availableInventory > 0;
    },
    validateName() {
      this.order.name = this.order.name.replace(/[^A-Za-z]/g, "");
    },

    validateNumber() {
      this.order.number = this.order.number.replace(/[^0-9]/g, "");
    },
    updateCartItemCount() {
      this.$nextTick(() => {
        this.cartItemCount = this.cart.length;
      });
    },
  },
  computed: {
    cartItemCount: {
      get() {
        return this.cart.length || "";
      },
      set(value) {},
    },
    isFormValid: function () {
      return this.order.name && this.order.number;
    },
    allCartItems: function () {
      return this.cartItems
        .map((item) => ({ ...item, inCart: true }))
        .concat(
          this.cart.map((itemId) => {
            const activity = this.activities.find(
              (activity) => activity.id === itemId
            );
            return {
              id: activity.id,
              title: activity.title,
              image: activity.image,
              inCart: false,
            };
          })
        );
    },
  },
  watch: {
    search: "sortProducts",
    cart: "updateCartItemCount", // Watch for changes in the cart array
  },
};
</script>


