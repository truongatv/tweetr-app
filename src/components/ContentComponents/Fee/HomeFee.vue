<template>
  <div>
    <v-expansion-panels v-model="panel" popout focusable multiple>
      <!-- general -->
      <v-expansion-panel>
        <v-expansion-panel-header>
          {{$t('labels.general')}}
          <template v-slot:actions>
            <v-icon color="primary">$expand</v-icon>
          </template>
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <HomeFeeDetail 
            :living_cost_data="living_cost_data"
          >
          </HomeFeeDetail>
        </v-expansion-panel-content>
      </v-expansion-panel>
      <!-- detail -->
      <v-expansion-panel>
        <v-expansion-panel-header>
          {{$t('labels.detail_information')}}
          <template v-slot:actions>
            <v-icon color="primary">$expand</v-icon>
          </template>
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <ListCost
            :headers="headers"
            :living_cost_data="living_cost_data"
          ></ListCost>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
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
import HomeFeeDetail from "@/components/LivingCostComponents/HomeFeeDetail";

import FeeCommon from "@/scripts/feeCommon";
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
      panel: [1],
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
    ListCost,
    HomeFeeDetail
  }
};
</script>
