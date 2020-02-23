<template>
  <ListCost :headers="headers" :living_cost_data="living_cost_data"></ListCost>
</template>
<script>
import { label } from "@/static/define/const";
import ListCost from "../LivingCostComponents/ListCost";
export default {
  components: {
    ListCost
  },
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
  created() {
    this.initialize()
    this.$bus.on('saveLivingCost', value => {
        this.initialize()
    })
  },
  methods: {
    initialize() {
      const token = localStorage.getItem('tweetr-token')
      axios
        .get('/cost/get_user_cost', {
          headers: {
            Authorization: `Bearer ${token}`
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