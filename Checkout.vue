<template>
  <div class="checkout-container">
    <!-- Checkout form content -->
    <form>
      <div class="form-group">
        <label for="name">Name:</label>
        <input type="text" id="name" name="name" required>
      </div>
      <div class="form-group">
        <label for="email">Email:</label>
        <input type="email" id="email" name="email" required>
      </div>
      <div class="form-group">
        <label for="address">Address:</label>
        <input type="text" id="address" name="address" required>
      </div>
      <div class="form-group">
        <label for="city">City:</label>
        <input type="text" id="city" name="city" required>
      </div>
      <div class="form-group">
        <label for="zip">ZIP Code:</label>
        <input type="text" id="zip" name="zip" required>
      </div>
      <button class="submit-button">Submit Order</button>
    </form>
  </div>
</template>

<script>
export default {
  // JavaScript logic for Checkout component
}
</script>

<style scoped>
/* Styles specific to Checkout.vue */
.checkout-container {
  max-width: 400px;
  margin: 0 auto;
}

.form-group {
  margin-bottom: 20px;
}

label {
  display: block;
  font-weight: bold;
}

input {
  width: 100%;
  padding: 8px;
  border-radius: 5px;
  border: 1px solid #ccc;
}

.submit-button {
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 5px;
  padding: 10px 20px;
  cursor: pointer;
}

.submit-button:hover {
  background-color: #0056b3;
}
</style>
