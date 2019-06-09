<template>
  <div class="app" id="app">
    <h1>{{msg}}</h1>
    <h3>{{restaurantName}}</h3>
    <p>{{restaurantAdress}}</p>
    <p>TEL：{{restaurantTEL}}</p>
    <p>外送時間：{{restaurantOpenTime}}</p>
    <div class="type" v-for="parent,index in type" :key="index">
      <h5>{{parent.name}}</h5>
      <div class="food" v-for="child,cindex in parent.food" :key="child.index">
        <ul>
          <li>
            <div></div>
            <div class="name">{{ child.name }}</div>
            <div class="price">NT${{ child.price }}</div>
            <div class="btn">
              <button v-on:click="Increase(index,cindex)">increase</button>
              <p>{{child.count}}</p>
              <button v-on:click="Decrease(index,cindex)">decrease</button>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <p>共計：NT$ {{ totalPrice }}</p>
    <div class="btn">
        <button v-on:click="Order">確認訂單</button>
    </div>
  </div>
</template>

      
<script>
import db from "../db";
import {mapState} from "vuex";


export default {
  name: "#app",
  data() {
    return {
      msg: "Welcome to Your Vue.js App",
      restaurantName: "",
      restaurantAdress: "",
      restaurantTEL: "",
      restaurantOpenTime: "",
      type: [
        // {
        //   name: "",
        //   food: [{ name: "", price: 0,count:0}]
        // }
      ],
    };
  },
  computed: mapState({
    totalPrice: state => state.totalPrice
  }),
  firestore() {
    return {
      // Collection
      docRestaurantRef: firebase.firestore().collection("Restaurant").doc("Info"),
      colTypeRef: firebase
        .firestore()
        .collection("Restaurant")
        .doc("Info")
        .collection("Menu"),
      colOrderRef: firebase
        .firestore()
        .collection("Restaurant")
        .doc("Info")
        .collection("Order")
    };
  },
  mounted: async function() {
    this.$store.state.totalPrice=0
    this.$store.state.order=[]
    //店家資料
    let doc = await this.$firestore.docRestaurantRef.get();
    if (doc.exists) {
      this.restaurantName = doc.data().Name;
      this.restaurantAdress = doc.data().Adress;
      this.restaurantTEL = doc.data().TEL;
      this.restaurantOpenTime = doc.data().OpenTime;
    }
    //餐點類型資料
    let querySnapshot = await this.$firestore.colTypeRef.get();
    let typearray = [];
    let i = 0;
    querySnapshot.forEach(docSnapshot => {
      typearray.push({
        name: docSnapshot.data().Name,
        food:[],
      });
    });
    this.type = typearray;
    //餐點細項資料
    const colTypeRef=this.$firestore.colTypeRef
    this.type.forEach(async function(item, index, array){
      querySnapshot = await colTypeRef.doc('Type'+(index+1)).collection('Food').get();
        let foodarray = [];
        querySnapshot.forEach(docSnapshot => {
        foodarray.push({
          name: docSnapshot.data().Name,
          price: docSnapshot.data().Price,
          count:0
        });
        item.food=foodarray
      });
    })
  },
  methods: {
    Increase: function (index,cindex) {
      this.type[index].food[cindex].count++
      this.$store.state.totalPrice+=this.type[index].food[cindex].price
    },
    Decrease: function (index,cindex) {
      let count=this.type[index].food[cindex].count
      if(count>0){
        count--
        this.type[index].food[cindex].count=count
        this.$store.state.totalPrice-=this.type[index].food[cindex].price
      }
    },
    Order: function () {
      this.type.forEach(item=>{
        item.food.forEach(item=>{
          if(item.count>0){
            this.$store.state.order.push({
              name:item.name,
              count:item.count,
              totalPrice:item.price*item.count
            })
          }
        });
      })
      if(this.$store.state.totalPrice==0)
        alert("請選擇餐點")
      else
        this.$router.push('/Order')
    }
  }
};
</script>


<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1,
h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
.type {
  border: 1px solid #000000;
  width: 200px;
}
.food {
  border: 1px solid #000000;
  width: 100px;
}
</style>
