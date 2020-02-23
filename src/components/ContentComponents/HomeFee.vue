<template>
  <ListCost :headers="headers" :living_cost_data="living_cost_data"></ListCost>
</template>

<script>
import { label } from "@/static/define/const";
import ListCost from "../LivingCostComponents/ListCost";
export default {
  data: () => ({
    headers: [
      {
        text: label.name_product,
        align: "left",
        sortable: false,
        value: "name"
      },
      { text: label.date_pay, value: "date_pay" },
      { text: label.payer, value: "payer.name" },
      { text: label.price, value: "price" },
      { text: label.edit, value: "edit", sortable: false }
    ],
    living_cost_data: []
  }),
  components: {
    ListCost
  },
  created() {
    this.initialize()
    this.$bus.on('saveLivingCost', value => {
        this.initialize()
    })
    //search by date
    this.$bus.on('searchByDate', value => {
        this.searchByDate(value)
    })
  },
  methods: {
    initialize() {
      const token = localStorage.getItem("tweetr-token");
      axios
        .get("/cost/get_home_cost", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        .then(response => {
          this.living_cost_data = response.data.data;
        })
        .catch(error => {
          console.log(error.response);
        });
    },
    searchByDate(value) {
      //get date start and date end
      let date_pay_start =  value[0]
      let date_pay_end = value[0]
      if(typeof value[1] != 'undefined') {
        date_pay_end = value[1]
      }
      const token = localStorage.getItem('tweetr-token')
      axios
        .get('/cost/get_user_cost',{
          headers: {
            Authorization: `Bearer ${token}`
          },
          params: {
            date_pay_start: date_pay_start,
            date_pay_end: date_pay_end
          }
        })
        .then(response => {
          this.living_cost_data = response.data.data
        })
        .catch(error => {
          console.log(error.response)
        })
    }
  }
};
</script>