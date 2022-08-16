<template>
  <div class="flex flex-wrap justify-between">
    <div @click="$router.push({ name: 'single', params: { id: obj.id } })" :id="obj.id" class="w-full lg:w-1/4 p-4 my-3" v-for="obj of pizzas" :key="obj.id">
      <img :src="obj.images[1]" alt="">
      <div>
        <p :value="title" class="text-2xl font-medium">{{ obj.title }}</p>
        <p class="text-sm h-24 my-3">{{ obj.desc }}</p>
        <div class="flex items-center justify-between">
          <p class="text-2xl font-medium">от {{ obj.price }} тг.</p>
          <button class="text-main bg-orange-100 py-2 px-4 rounded-full" @click.stop="sendOrder(obj.id)">Выбрать</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: "PizzaList",
  data() {
    return {
      i: 1,
      pizzas: [],
      orders: [],
      pizzaSize: 1,
      curID: this.$route.params.id - 1,
      ingList: [],
      totalIngPrice: 0,
      totalSizePrice: 0,
      totalPrice: 0,
      currentUser: localStorage.getItem('loggedUser'),
      title: null
      
    }
  },
  async mounted() {
    let res = await axios.get('http://localhost:3001/pizza')
    this.pizzas = res.data;
    let orders = await axios.get('http://localhost:3001/orders')
    this.orders = orders.data;
  },
  methods: {
    async sendOrder(e) {
      let mainBlock = parseInt(e) - 1
      
      console.log(mainBlock)
      console.log(this.pizzas[mainBlock].title)
      let indexOrder = this.orders.findIndex(order => order.status === false && order.user_login == this.currentUser )
      
      if(indexOrder !== -1) {
        let newOrder = {
          title: this.pizzas[mainBlock].title,
          price: parseInt(this.pizzas[mainBlock].price),
          ingridients: this.ingList,
          image: this.pizzas[mainBlock].images[1]
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
              title: this.pizzas[mainBlock].title,
          price: parseInt(this.pizzas[mainBlock].price),
          ingridients: this.ingList,
          image: this.pizzas[mainBlock].images[1]
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
