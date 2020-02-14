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
          <v-card>
            <v-card-title>
              <span class="headline">{{ formTitle }}</span>
            </v-card-title>
            <!-- start add new cost living or edit cost living -->
            <v-card-text>
              <v-container>
                <v-form ref="form">
                  <v-text-field
                    dense
                    clearable
                    :label="label.name_product"
                    :rules="rules.nameProductRules"
                    v-model="living_cost.name"
                  ></v-text-field>
                  <v-menu
                    v-model="dateSelect"
                    :close-on-content-click="false"
                    transition="scale-transition"
                    offset-y
                    max-width="290px"
                    min-width="290px"
                  >
                    <template v-slot:activator="{ on }">
                      <v-text-field
                        v-model="living_cost.date_pay"
                        :label="label.date"
                        prepend-inner-icon="mdi-calendar"
                        persistent-hint
                        readonly
                        v-on="on"
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      v-model="living_cost.date_pay"
                      no-title
                      @input="dateSelect = false"
                    ></v-date-picker>
                  </v-menu>
                  <v-text-field
                    type="number"
                    prefix="$"
                    dense
                    clearable
                    :label="label.price"
                    v-model="living_cost.price"
                  ></v-text-field>
                  <!-- payer user -->
                  <v-menu offset-y>
                    <template v-slot:activator="{ on }">
                      <v-text-field
                        dense
                        clearable
                        auto-grow
                        :label="label.payer"
                        v-on="on"
                        v-model="living_cost.payer_name"
                      ></v-text-field>
                    </template>
                    <v-list>
                      <v-list-item
                        v-for="(item, index) in homeMember"
                        :key="index"
                        @click="selectPayer(item)"
                      >
                        <v-list-item-title>{{item.name}}</v-list-item-title>
                      </v-list-item>
                    </v-list>
                  </v-menu>
                  <!-- receiver -->
                  <v-select
                    v-model="living_cost.receiver"
                    :items="listMemberUser"
                    :chips="true"
                    :multiple="true"
                    :label="label.beneficiary"
                    item-text="name"
                    return-object
                  >
                    <template v-slot:selection="{ item }">
                      <v-chip>
                        <span>{{ item.name }}</span>
                      </v-chip>
                    </template>
                  </v-select>

                  <v-textarea clearable auto-grow :label="label.detail" v-model="living_cost.detail"></v-textarea>
                </v-form>
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="close">{{button.cancel}}</v-btn>
              <v-btn color="blue darken-1" text @click="saveLivingCost()">{{button.save}}</v-btn>
            </v-card-actions>
            <!-- end add new cost living or edit cost living -->
          </v-card>
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
  data: () => ({
    homeMember: [],
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
    dateSelect: false,
    rules: { 
      nameProductRules: [
        v => !!v || messages.error.required
      ],
    },
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
    living_cost_data: [],
    editedIndex: -1,
    editedItem: {
      name: "",
      date_pay: 0,
      payer_name: 0,
      price: 0
    },
    defaultItem: {
      name: "",
      date_pay: 0,
      payer_name: 0,
      price: 0
    }
  }),
  computed: {
    formTitle() {
      return this.editedIndex === -1 ? label.addNew : label.edit;
    },
    computedDateFormatted() {
      this.living_cost.date_pay = this.formatDate(this.dateSelect.date);
      return this.formatDate(this.dateSelect.date);
    },
    listMemberUser() {
      let listMember = new Array();
      this.homeMember.map((item) => {
        listMember.push(item
        )
      })
      console.log(listMember)
      return listMember
    }
  },
  mounted() {
     const token = localStorage.getItem("tweetr-token");
      axios
        .get("/home/home_member", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        .then(response => {
          this.homeMember = response.data.data
        })
  },
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
      // this.living_costs = [
      //   {
      //     name: "Frozen Yogurt",
      //     date: 159,
      //     payer: 'Truong',
      //     price: 24,
      //   },
      //   {
      //     name: "Ice cream sandwich",
      //     date: 237,
      //     payer: 'Son',
      //     price: 37
      //   },
      //   {
      //     name: "Eclair",
      //     date: 262,
      //     payer: 'Truong',
      //     price: 23
      //   },
      //   {
      //     name: "Cupcake",
      //     date: 305,
      //     payer: 'Truong',
      //     price: 67
      //   },
      //   {
      //     name: "Gingerbread",
      //     date: 356,
      //     payer: 'Son',
      //     price: 49
      //   },
      //   {
      //     name: "Jelly bean",
      //     date: 375,
      //     payer: 'Truong',
      //     price: 94
      //   },
      //   {
      //     name: "Lollipop",
      //     date: 392,
      //     payer: 'Son',
      //     price: 98
      //   },
      //   {
      //     name: "Honeycomb",
      //     date: 408,
      //     payer: 'Son',
      //     price: 87
      //   },
      //   {
      //     name: "Donut",
      //     date: 452,
      //     payer: 'Truong',
      //     price: 51
      //   },
      //   {
      //     name: "KitKat",
      //     date: 518,
      //     payer: 'Son',
      //     price: 65
      //   }
      // ];
      // get living costs data
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
      this.editedIndex = this.living_cost_data.indexOf(item);
      this.living_cost = Object.assign({}, item);
      // this.homeMember = this.living_cost.receiver
      this.flag.dialog = true;
      this.$forceUpdate()
    },
    deleteItem(item) {
      const index = this.desserts.indexOf(item);
      confirm("Are you sure you want to delete this item?") &&
        this.desserts.splice(index, 1);
    },
    close() {
      this.flag.dialog = false;
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      }, 300);
    },
    save() {
      if (this.editedIndex > -1) {
        Object.assign(this.desserts[this.editedIndex], this.editedItem);
      } else {
        this.desserts.push(this.editedItem);
      }
      this.close();
    },
    //format date time
    formatDate(date) {
      if (!date) return null;

      const [year, month, day] = date.split("-");
      return `${month}/${day}/${year}`;
    },
    // handle select payer
    selectPayer(item) {
      this.living_cost.payer_name = item.name;
      this.living_cost.payer_id = item.id;
    },
    //save living cost
    saveLivingCost() {
      const token = localStorage.getItem("tweetr-token")
      if(this.living_cost.name !== "" && this.living_cost.price > 0 && this.living_cost.payer_name != "") {
        axios.post('cost/create_cost', this.living_cost, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        .then(response => {
          this.setDefaultLivingCost()
          this.close()
          this.flag.snackbar = {
            flag: true,
            message: messages.success.addDone,
            color: "success"
          }
        })
      } else {
        this.flag.snackbar = {
          flag: true,
          message: messages.error.required,
          color: "error"
        }
      }
    },
    //set default value living cose
    setDefaultLivingCost() {
      this.living_cost= {
        name: "",
        payer_name: "",
        price: 0,
        date_pay: new Date().toISOString().substr(0, 10),
        detail: "",
        receiver: []
      }
    }
  }
};
</script>