<template>
  <div>
    <ListCost
      :headers="headers"
      :living_cost_data="living_cost_data"
    ></ListCost>
    <!-- show snackbars -->
    <v-snackbar v-model="flag.snackbar.flag" :color="flag.snackbar.color">
      {{ flag.snackbar.message }}
      <v-btn color="white" text @click="flag.snackbar.flag = false">{{
        $t("buttons.cancel")
      }}</v-btn>
    </v-snackbar>
  </div>
</template>

<script>
import ListCost from "@/components/LivingCostComponents/ListCost";
import FeeCommon from "./FeeCommon";
export default {
  mixins: [FeeCommon],
  data() {
    const $t = this.$t.bind(this);
    return {
      headers: [
        {
          text: $t("labels.name_product"),
          align: "left",
          sortable: false,
          value: "name"
        },
        { text: $t("labels.date_pay"), value: "date_pay" },
        { text: $t("labels.payer"), value: "payer.name" },
        { text: $t("labels.price"), value: "price" },
        { text: $t("labels.edit"), value: "edit", sortable: false }
      ],
      living_cost_data: [],
      flag: {
        snackbar: {
          flag: false,
          message: "",
          color: "#004D40"
        }
      },
      uri: "/cost/get_home_cost"
    };
  },
  components: {
    ListCost
  }
};
</script>
