<template>
  <div class="lesson-list">
    <h2>After School Activities</h2>
    <div v-for="lesson in lessons" :key="lesson.id" class="lesson-item">
      <h3>{{ lesson.title }}</h3>
\    </div>
  </div>
</template>

<script>
export default {
  name: "LessonList",
  props: {
    lessons: {
      type: Array,
      required: true,
    },
  },
};
</script>

<style>
body {
  background-color: #577099;
  font-family: 'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif;
  margin: 0; 
  text-align: center;
}

.sort {
  text-align: left;
  padding-left: 35px;
  flex-grow: 1;
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
  padding-left: 0.5px;
  width: 70%;
  background-color: #92BBFF;
  height: 130px;
  align-items: center;
  overflow: hidden;
}

.activity-item img {
  width: 100%;
  height: 100%;
  background-color: #92BBFF;
  object-fit: cover;
}

.activity-item .activity-details {
  padding: 3px;
  font-family: 'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif;
}

.activity-item h2 {
  font-size: 15pt;
  font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
  text-align: center;
  margin: auto;
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

.checkout-button {
  background-color: #66B266;
  color: white;
  border: none;
  border-radius: 10px;
  padding: 10px 20px;
  font-size: 18px;
  cursor: pointer;
  display: flex;
  align-items: right;
  margin-left: auto;
}

.checkout-button:disabled {
  background-color: #7a7a7a;
  cursor: not-allowed;
}

.checkout .checkout-container {
  max-width: 600px;
  margin: 20px auto;
  background-color: #ffffff;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.checkout .checkout-container input {
  width: 70%;
  padding: 5px;
  margin-bottom: 10px;
  border: 3px solid #ccc;
  border-radius: 5px;
}

.checkout .checkout-container button {
  background-color: #66B266;
  color: white;
  border: none;
  border-radius: 10px;
  padding: 10px 20px;
  font-size: 18px;
  cursor: pointer;
  display: block;
  margin-top: 10px;
  margin-left: auto;
}

.checkout .checkout-container button[disabled] {
  background-color: gray;
  cursor: not-allowed;
  color: #ccc; 
}

.cart-item {
  border: 1px solid #ccc;
  padding: 10px;
  margin-bottom: 10px;
  background-color: #f9f9f9;
}
</style>
