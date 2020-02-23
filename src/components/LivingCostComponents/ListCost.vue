<template>
  <v-card>
    <v-card-title>
      {{label.sum_money}}: <strong> {{sumMoney}}</strong>
      <v-spacer></v-spacer>
      <!-- popup create, update living cost -->
      <CostPopup :living_cost="living_cost" :dialog="flag.dialog" :edit="flag.edit">
      </CostPopup>
    </v-card-title>
    <v-card-title>
      <v-text-field
        v-model="search"
        append-icon="mdi-magnify"
        label="Search"
        single-line
      ></v-text-field>
      <v-spacer></v-spacer>
      <v-menu
        ref="date_select"
        v-model="date_select"
        :close-on-content-click="false"
        :return-value.sync="dates"
        transition="scale-transition"
        offset-y
        max-width="290px"
        min-width="290px"
      >
        <template v-slot:activator="{ on }">
          <v-text-field
            v-model="dateRangeText"
            label="Picker in menu"
            readonly
            v-on="on"
          ></v-text-field>
        </template>
        <v-date-picker
          v-model="dates"
          type="month"
          no-title
          scrollable
          range
        >
          <v-spacer></v-spacer>
          <v-btn text color="primary" @click="date_select = false">Cancel</v-btn>
          <v-btn text color="primary" @click="searchByDate()">OK</v-btn>
        </v-date-picker>
      </v-menu>
    </v-card-title>
    <v-data-table 
      :headers="headers" 
      :sort-by="['date_pay']" 
      :sort-desc="[true]" 
      show-expand 
      :items="living_cost_data" 
      class="elevation-1"
      :search="search"
    >
      <template v-slot:item.payer.name="{ item }">
        <v-chip>{{ item.payer.name }}</v-chip>
      </template>
      <template v-slot:item.edit="{ item }">
        <v-icon v-if="currentUser.id == item.payer.id" small class="mr-2" @click="editItem(item)">mdi-pencil</v-icon>
        <v-icon v-if="currentUser.id == item.payer.id" small @click="deleteItem(item)">mdi-delete</v-icon>
      </template>
      <template v-slot:no-data>
        {{messages.alert.no_data}}
      </template>
      <template v-slot:expanded-item="{ item }">
        <DetailCost :item="item" />
      </template>
    </v-data-table>
  </v-card>
</template>

<script>
import { label, button, messages } from '@/static/define/const'
import CostPopup from './CostComponents/CreateCost'
import DetailCost from './CostComponents/DetailCost'
export default {
  props: {
    headers: {
      type: Array,
      required: true
    },
    living_cost_data: {
      type: Array,
      required: true
    }
  },
  components: {
    CostPopup,
    DetailCost
  },
  data: () => ({
    living_cost: {
      name: "",
      payer: {},
      price: "",
      date_pay: new Date().toISOString().substr(0, 10),
      detail: "",
      receiver: []
    },
    search: '',
    label: label,
    button: button,
    date_select: false,
    dates: [new Date().toISOString().substr(0, 7)],
    messages: messages,
    flag: {
      dialog: false,
      snackbar: {
        flag: false,
        message: "",
        color: "success"
      },
      edit: false
    },
    sort_by: 'date_pay'
  }),
  computed: {
    currentUser () {
      return this.$store.getters.getCurrentUserInfo
    },
    sumMoney () {
      let sum_money = 0;
      this.living_cost_data.map(item => {
        sum_money += item.price
      })
      return sum_money
    },
    //change array date to format date_month_start ~ date_month_end
    dateRangeText () {
      this.dates.sort()
      return this.dates.join(' ~ ')
    },
  },
  watch: {
    dialog(val) {
      val || this.close();
    }
  },
  created() {
    //listen event from children
    this.$bus.on('saveLivingCost', value => {
        // this.initialize()
        this.setDefaultLivingCost()
        //show snackbar
        this.flag.snackbar = {
          flag: true,
          message: messages.success.add_done,
          color: "success"
        }
    })

    this.$bus.on('closeDialog', value => {
      this.flag.dialog = value
      this.setDefaultLivingCost()
    })
  },
  methods: {
    //search data when select date month
    searchByDate() {
      // this.$bus.emit('searchByDate', false)
      this.$refs.date_select.save(this.dates)
      this.$bus.emit('searchByDate', this.dates)
    },
    editItem(item) {
      this.living_cost = Object.assign({}, item);
      this.flag.dialog = true;
      this.flag.edit = true
    },
    deleteItem(item) {
      const token = localStorage.getItem('tweetr-token')
      const index = this.living_cost_data.indexOf(item);
      if(confirm(messages.alert.are_you_sure_delete)) {
       axios
          .delete(
            "/cost/remove_cost/" + item.id,
            {
              headers: {
                Authorization: `Bearer ${token}`
              }
            }
          )
          .then(response => {
            if(response.data.data) {
              //show snackbar
              this.flag.snackbar = {
                flag: true,
                message: messages.success.remove_done,
                color: "success"
              }
            } else {
              //show snackbar
              this.flag.snackbar = {
                flag: true,
                message: messages.success.remove_fail,
                color: "error"
              }
            }
          });
        this.living_cost_data.splice(index, 1);
      }
    },

    //set default value living cost
    setDefaultLivingCost() {
      this.living_cost= {
          name: "",
          payer: {},
          price: "",
          date_pay: new Date().toISOString().substr(0, 10),
          detail: "",
          receiver: []
      }
    },
  }
};
</script>