<template>
  <v-data-table :headers="headers"  show-expand :items="living_cost_data" sort-by="date" class="elevation-1">
    <template v-slot:top>
      <v-toolbar flat color="white">
        <v-toolbar-title>Tổng tiền:</v-toolbar-title>
        <v-divider class="mx-4" inset vertical></v-divider>
        <v-spacer></v-spacer>
        <!-- popup create, update living cost -->
        <CostPopup :living_cost="living_cost" :dialog="flag.dialog" :edit="flag.edit">
        </CostPopup>
      </v-toolbar>
      <!-- show snackbars -->
      <v-snackbar v-model="flag.snackbar.flag" :color="flag.snackbar.color" right bottom>
        {{flag.snackbar.message}}
        <v-btn color="white" text @click="flag.snackbar.flag = false">{{button.cancel}}</v-btn>
      </v-snackbar>
    </template>
    <template v-slot:item.payer_name="{ item }">
      <v-chip>{{ item.payer_name }}</v-chip>
    </template>
    <template v-slot:item.edit="{ item }">
      <v-icon v-if="currentUser.id == item.payer_id" small class="mr-2" @click="editItem(item)">mdi-pencil</v-icon>
      <v-icon v-if="currentUser.id == item.payer_id" small @click="deleteItem(item)">mdi-delete</v-icon>
    </template>
    <template v-slot:no-data>
      <v-btn color="primary" @click="initialize">Reset</v-btn>
    </template>
    <template v-slot:expanded-item="{ item }">
      <DetailCost :item="item" />
    </template>
  </v-data-table>
</template>

<script>
import { label, button, messages } from '@/static/define/const'
import CostPopup from './../CostComponents/CreateCost'
import DetailCost from './../CostComponents/DetailCost'
export default {
  components: {
    CostPopup,
    DetailCost
  },
  data: () => ({
    living_cost: {
      name: "",
      payer_name: "",
      price: 0,
      date_pay: new Date().toISOString().substr(0, 10),
      detail: "",
      receiver: []
    },
    label: label,
    button: button,
    flag: {
      dialog: false,
      snackbar: {
        flag: false,
        message: "",
        color: "success"
      },
      edit: false
    },
    headers: [
      {
        text: label.name_product,
        align: "left",
        sortable: false,
        value: "name"
      },
      { text: label.date_pay, value: "date_pay" },
      { text: label.payer, value: "payer_name" },
      { text: label.price, value: "price" },
      { text: label.edit, value: "edit", sortable: false }
    ],
    living_cost_data: []
  }),
  watch: {
    dialog(val) {
      val || this.close();
    }
  },
  computed: {
    currentUser () {
      return this.$store.getters.getCurrentUserInfo
    }
  },
  created() {
    this.initialize();
    //listen event from children
    this.$bus.on('saveLivingCost', value => {
        this.initialize()
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
          payer_name: "",
          price: 0,
          date_pay: new Date().toISOString().substr(0, 10),
          detail: "",
          receiver: []
      }
    },
  }
};
</script>