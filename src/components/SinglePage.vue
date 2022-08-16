<template>
  <div class="block lg:flex items-start justify-start px-4 lg:px-0">
    <div class="w-full lg:w-1/3 h-96 flex items-center justify-center">
      <img v-if="pizzaSize === 0" class="w-2/3" :src="pizzas[curID].images[0]" alt="">
      <img v-if="pizzaSize === 1" class="w-3/4" :src="pizzas[curID].images[1]" alt="">
      <img v-if="pizzaSize === 2" class="w-full" :src="pizzas[curID].images[2]" alt="">
    </div>
    <div>
      <h1 class="text-2xl font-medium mb-5">{{ pizzas[curID].title }}</h1>
      <p>{{ pizzas[curID].desc }}</p>
      <div class="flex mt-5 justify-between w-full lg:w-1/2 bg-slate-200 p-2 rounded-xl mx-auto">
        <p @click="pizzaSize = 0, setPizzaPrice()" :class="{ 'bg-white rounded-2xl' : pizzaSize === 0 }" class="hover:cursor-pointer p-2">Маленькая</p>
        <p @click="pizzaSize = 1, setPizzaPrice()" :class="{ 'bg-white rounded-2xl' : pizzaSize === 1 }" class="hover:cursor-pointer p-2">Средняя</p>
        <p @click="pizzaSize = 2, setPizzaPrice()" :class="{ 'bg-white rounded-2xl' : pizzaSize === 2 }" class="hover:cursor-pointer p-2">Большая</p>
      </div>
      <div class="flex justify-between flex-wrap">
        <div @click="addIng(ing)" :class="{ 'border border-main' : ingList.includes(ing) }" class="w-th mt-5 p-3 shadow-xl rounded-xl" 
          v-for="ing of pizzas[curID].ingridients" :key="ing">
          <img class="w-full" :src="ing.image" alt="">
          <p class="text-center text-sm mb-4">{{ ing.title }}</p>
          <p class="text-center text-lg font-semibold">{{ ing.price }}</p>
        </div>
      </div>
      <button @click="sendOrder()" class="bg-main text-white rounded-xl p-2 w-1/2 block mx-auto mt-5">Добавить в корзину {{ totalPrice }}</button>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: "SinglePage",
  data() {
    return {
      pizzas: [],
      orders: [],
      pizzaSize: 1,
      curID: this.$route.params.id - 1,
      ingList: [],
      totalIngPrice: 0,
      totalSizePrice: 0,
      totalPrice: 0,
      currentUser: localStorage.getItem('loggedUser'),
      
    }
  },
  async mounted() {
    let res = await axios.get('http://localhost:3001/pizza')
    this.pizzas = res.data;
    let orders = await axios.get('http://localhost:3001/orders')
    this.orders = orders.data;

    this.totalSizePrice = Number(this.pizzas[this.curID].price) + 1000
    this.totalPrice = this.totalSizePrice
  },
  methods: {
    addIng(item) {
      this.ingList.push(item)
      this.totalIngPrice = this.totalIngPrice + parseInt(item.price)
      this.totalPrice = this.totalIngPrice + this.totalSizePrice
    },
    setPizzaPrice() {
      if (this.pizzaSize === 0) {
        this.totalSizePrice = Number(this.pizzas[this.curID].price)
      } else if (this.pizzaSize === 1) {
        this.totalSizePrice = Number(this.pizzas[this.curID].price) + 1000
      } else {
        this.totalSizePrice = Number(this.pizzas[this.curID].price) + 2000
      }
      this.totalPrice = this.totalIngPrice + this.totalSizePrice
    },
    async sendOrder() {
      let indexOrder = this.orders.findIndex(order => order.status === false && order.user_login == this.currentUser)
      
      if(indexOrder !== -1) {
        let newOrder = {
          title: this.pizzas[this.curID].title,
          price: this.totalPrice,
          ingridients: this.ingList,
          image: this.pizzas[this.curID].images[1]
        }
        this.orders[indexOrder].products.push(newOrder)
        this.orders[indexOrder].products.forEach(element => {
          this.orders[indexOrder].totalOfProducts = this.orders[indexOrder].totalOfProducts + element.price
        });

        await axios.put('http://localhost:3001/orders/' + this.orders[indexOrder].id, this.orders[indexOrder])
      } else {
        let obj = {
          products: [
            {
              title: this.pizzas[this.curID].title,
              price: this.totalPrice,
              ingridients: this.ingList,
              image: this.pizzas[this.curID].images[1]
            }
          ],
          totalOfProducts: 0,
          user_login: localStorage.getItem('loggedUser'),
          status: false
        }
        await axios.post('http://localhost:3001/orders', obj)
      }
        this.$router.go()
      } 
  }
}
</script>