<template>
  <v-data-table :headers="headers" :items="desserts" sort-by="date" class="elevation-1">
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

            <v-card-text>
              <v-container>
                <v-form ref="form">
                  <v-text-field
                    dense
                    clearable
                    :label="label.name_product"
                    :rules="rules.nameProductRules"
                    v-model="livingCost.name"
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
                        v-model="livingCost.datePay"
                        :label="label.date"
                        prepend-inner-icon="mdi-calendar"
                        persistent-hint
                        readonly
                        v-on="on"
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      v-model="livingCost.datePay"
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
                    v-model="livingCost.price"
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
                        v-model="livingCost.payer"
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
                    v-model="livingCost.receiver"
                    :items="listMemberUser"
                    :chips="true"
                    :multiple="true"
                    label="label"
                    item-text="name"
                    item-value="id"
                  >
                    <template v-slot:selection="{ item }">
                      <v-chip>
                        <span>{{ item.name }}</span>
                      </v-chip>
                    </template>
                  </v-select>

                  <v-textarea clearable auto-grow :label="label.detail" v-model="livingCost.detail"></v-textarea>
                </v-form>
              </v-container>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="close">{{button.cancel}}</v-btn>
              <v-btn color="blue darken-1" text @click="saveLivingCost()">{{button.save}}</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-toolbar>
      <!-- show snackbars -->
      <v-snackbar v-model="flag.snackbar.flag" :color="flag.snackbar.color" right bottom>
        {{flag.snackbar.message}}
        <v-btn color="white" text @click="snackbar.flag = false">{{button.cancel}}</v-btn>
      </v-snackbar>
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
import { label, button, messages } from "@/const";
export default {
  data: () => ({
    homeMember: [],
    livingCost: {
      name: "",
      payer: "",
      price: 0,
      datePay: new Date().toISOString().substr(0, 10),
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
      { text: label.date, value: "date" },
      { text: label.payer, value: "payer" },
      { text: label.price, value: "price" },
      { text: label.edit, value: "edit", sortable: false }
    ],
    desserts: [],
    editedIndex: -1,
    editedItem: {
      name: "",
      date: 0,
      payer: 0,
      price: 0
    },
    defaultItem: {
      name: "",
      date: 0,
      payer: 0,
      price: 0
    }
  }),
  computed: {
    formTitle() {
      return this.editedIndex === -1 ? label.addNew : label.edit;
    },
    computedDateFormatted() {
      this.livingCost.datePay = this.formatDate(this.dateSelect.date);
      return this.formatDate(this.dateSelect.date);
    },
    listMemberUser() {
      let listMember = new Array();
      this.homeMember.map((item) => {
        listMember.push({
          id: item.id,
          name: item.name
        })
      })
      return listMember.filter(Boolean)
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
      this.desserts = [
        {
          name: "Frozen Yogurt",
          date: 159,
          payer: "Truong",
          price: 24
        },
        {
          name: "Ice cream sandwich",
          date: 237,
          payer: "Son",
          price: 37
        },
        {
          name: "Eclair",
          date: 262,
          payer: "Truong",
          price: 23
        },
        {
          name: "Cupcake",
          date: 305,
          payer: "Truong",
          price: 67
        },
        {
          name: "Gingerbread",
          date: 356,
          payer: "Son",
          price: 49
        },
        {
          name: "Jelly bean",
          date: 375,
          payer: "Truong",
          price: 94
        },
        {
          name: "Lollipop",
          date: 392,
          payer: "Son",
          price: 98
        },
        {
          name: "Honeycomb",
          date: 408,
          payer: "Son",
          price: 87
        },
        {
          name: "Donut",
          date: 452,
          payer: "Truong",
          price: 51
        },
        {
          name: "KitKat",
          date: 518,
          payer: "Son",
          price: 65
        }
      ];
    },
    editItem(item) {
      this.editedIndex = this.desserts.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.flag.dialog = true;
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
      this.livingCost.payer = item.name;
      this.livingCost.payerId = item.id;
    },
    //save living cost
    saveLivingCost() {
      const token = localStorage.getItem("tweetr-token")
      if(this.livingCost.name !== "" || this.livingCost.price > 0 || this.livingCost.payer != "") {
        axios.post('cost/create_cost', this.livingCost, {
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
      this.livingCost= {
        name: "",
        payer: "",
        price: 0,
        datePay: new Date().toISOString().substr(0, 10),
        detail: "",
        receiver: []
      }
    }
  }
};
</script>