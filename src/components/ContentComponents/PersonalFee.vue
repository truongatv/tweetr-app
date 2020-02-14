<template>
  <v-data-table :headers="headers" :items="living_cost_data" sort-by="date" class="elevation-1">
    <template v-slot:top>
      <v-toolbar flat color="white">
        <v-toolbar-title>Tổng tiền:</v-toolbar-title>
        <v-divider class="mx-4" inset vertical></v-divider>
        <v-spacer></v-spacer>
        <v-dialog v-model="flag.dialog" max-width="500px">
          <template v-slot:activator="{ on }">
            <v-btn color="primary" dark class="mb-2" v-on="on">{{label.addNew}}</v-btn>
          </template>
          <CostPopup :living_cost="living_cost">
          </CostPopup>
        </v-dialog>
      </v-toolbar>
      <!-- show snackbars -->
      <v-snackbar v-model="flag.snackbar.flag" :color="flag.snackbar.color" right bottom>
        {{flag.snackbar.message}}
        <v-btn color="white" text @click="snackbar.flag = false">{{button.cancel}}</v-btn>
      </v-snackbar>
    </template>
    <template v-slot:item.payer_name="{ item }">
      <v-chip>{{ item.payer_name }}</v-chip>
    </template>
    <template v-slot:item.edit="{ item }">
      <v-icon small class="mr-2" @click="editItem(item)">mdi-pencil</v-icon>
      <v-icon small @click="deleteItem(item)">mdi-delete</v-icon>
    </template>
    <template v-slot:no-data>
      <v-btn color="primary" @click="initialize">Reset</v-btn>
    </template>
  </v-data-table>
</template>

<script>
import { label, button, messages } from '@/static/define/const'
export default {
  components: {
    CostPopup
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
        color: "#004D40"
      },
    },
    headers: [
      {
        text: label.name_product,
        align: "left",
        sortable: false,
        value: "name"
      },
      { text: label.date, value: "date_pay" },
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
  created() {
    this.initialize();
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
    },
    deleteItem(item) {
      const index = this.desserts.indexOf(item);
      confirm("Are you sure you want to delete this item?") &&
        this.desserts.splice(index, 1);
    }
  }
};
</script>