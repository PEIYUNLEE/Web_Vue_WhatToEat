<template>
  <div class="hello">aa
    <div class="food" v-for="parent,index in order" :key="index">
      <div>{{ index+1 }}</div>
      <ul>
        <li v-for="child,cindex in parent.food" :key="child.index">
          <div>{{ child.name }}</div>
          <div>數量：{{ child.count }}</div>
        </li>
        <li>
          <div>共計：{{ parent.info.totalPrice }}</div>
          <div>訂購人：{{ parent.info.name }}</div>
          <div>送達時間：{{ parent.info.time }}</div>
          <div>手機：{{ parent.info.TEL }}</div>
          <div>外送地址：{{ parent.info.address }}</div>
          <div>備註：{{ parent.info.message }}</div>
          <button v-on:click="Finish(index)">完成</button>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import db from "../db";

export default {
  name: "OrderManager",
  data() {
    return {
      order: [
        // {
        //   info:{
        //   name:'',
        //   address:'',
        //   TEL:'',
        //   time:'',
        //   totalPrice:0,
        //   message:''
        //   },
          // food:[]
        // }
      ],
      orderNumber:[]
    };
  },
  firestore() {
    return {
      docInfoRef: firebase
        .firestore()
        .collection("Restaurant")
        .doc("Info"),
      colOrderRef: firebase
        .firestore()
        .collection("Restaurant")
        .doc("Info")
        .collection("Order"),
    };
  },
  mounted: async function() {
    let doc = await this.$firestore.docInfoRef.get();
    this.orderNumber=doc.data().OrderNumber
    console.log(this.orderNumber)
    for (var i = 0; i < this.orderNumber.length; i++) {
      let doc = await this.$firestore.colOrderRef.doc('Order'+this.orderNumber[i]).collection('Info').doc('Info').get();
      if (doc.exists) {
        this.order.push({
          info:{
            name:doc.data().Name,
            address:doc.data().Adress,
            TEL:doc.data().TEL,
            time:doc.data().Time,
            totalPrice:doc.data().TotalPrice,
            message:doc.data().Message,
          },
          food:[]
        })
      }
      doc = await this.$firestore.colOrderRef.doc('Order'+this.orderNumber[i]).get();
      let foodCount=0;
      if (doc.exists) {
        foodCount=doc.data().FoodCount
      }
      for (var j = 1; j <= foodCount; j++) {
        let doc = await this.$firestore.colOrderRef.doc('Order'+this.orderNumber[i]).collection('Food').doc('Food'+j).get();
        if (doc.exists) {
          this.order[i].food.push({
            name:doc.data().Name,
            count:doc.data().Count,
          })
        }
      }
    }
  },
  methods: {
    Finish:async function (orderindex) {
      //刪除修改firebase資料
      this.$firestore.colOrderRef.doc('Order'+this.orderNumber[orderindex]).delete();
      //刪除render
      this.order.splice(orderindex, 1)
      //修改data
      this.orderNumber.splice(orderindex, 1)
      let setOrderCount = await this.$firestore.docInfoRef.set({
        OrderCount:this.order.length,
        OrderNumber:this.orderNumber
      }, { merge: true })
    }
  },
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
.food {
  border: 1px solid #000000;
  width: 100px;
}
</style>
