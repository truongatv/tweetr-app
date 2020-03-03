<template>
  <div>
    <ListCost :headers="headers" :living_cost_data="living_cost_data"></ListCost>
    <!-- show snackbars -->
    <v-snackbar v-model="flag.snackbar.flag" :color="flag.snackbar.color">
      {{flag.snackbar.message}}
      <v-btn color="white" text @click="flag.snackbar.flag = false">{{$t('buttons.cancel')}}</v-btn>
    </v-snackbar>
  </div>
</template>

<script>
import ListCost from "../LivingCostComponents/ListCost";
export default {
  data(){
    const $t = this.$t.bind(this)
    return {
      headers: [
        {
          text: $t('labels.name_product'),
          align: "left",
          sortable: false,
          value: "name"
        },
        { text: $t('labels.date_pay'), value: "date_pay" },
        { text: $t('labels.payer'), value: "payer.name" },
        { text: $t('labels.price'), value: "price" },
        { text: $t('labels.edit'), value: "edit", sortable: false }
      ],
      living_cost_data: [],
      flag: {
          snackbar: {
            flag: false,
            message: "",
            color: "#004D40"
        }
      }
    }
  },
  components: {
    ListCost
  },
  created() {
    this.initialize()
    // this.$bus.on('saveLivingCost', value => {
    //     this.initialize()
    // })
    //show snackbar when create, update cost
    this.$bus.on("setSnackbar", value => {
      this.flag = value
    });
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