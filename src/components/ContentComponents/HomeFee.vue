<template>
  <ListCost v-if="isLoaded" :headers="headers" :living_cost_data="living_cost_data"></ListCost>
</template>

<script>
import { label, button } from "@/static/define/const";
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
  computed: {
    isLoaded() {
      return Object.keys(this.living_cost_data).length > 0;
    }
  },
  created() {
    this.initialize();
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
          console.log(this.living_cost_data);
        })
        .catch(error => {
          console.log(error.response);
        });
    }
  }
};
</script>