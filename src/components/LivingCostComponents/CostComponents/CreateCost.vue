<template>
  <ValidationObserver ref="obs" v-slot="{ invalid }" tag="form" slim>
    <v-dialog v-model="dialogFlag" max-width="500px">
      <template v-slot:activator="{ on }">
        <v-btn color="primary" dark class="mb-2" v-on="on">{{ $t("labels.add_new") }}</v-btn>
      </template>
      <v-card>
        <v-card-title>
          <span class="headline">{{ formTitle }}</span>
        </v-card-title>
        <!-- start add new cost living or edit cost living -->
        <v-card-text>
          <v-container>
            <v-form>
              <ValidationProvider
                :name="$t('labels.name_product')"
                rules="required"
                v-slot="{ validated, errors }"
              >
                <v-text-field
                  dense
                  clearable
                  :label="$t('labels.name_product')"
                  v-model="living_cost.name"
                  :error-messages="errors"
                  :success="validated"
                ></v-text-field>
              </ValidationProvider>
              <!-- date pay  -->
              <v-menu
                v-model="date_select"
                :close-on-content-click="false"
                transition="scale-transition"
                offset-y
                max-width="290px"
                min-width="290px"
              >
                <template v-slot:activator="{ on }">
                  <ValidationProvider
                    :name="$t('labels.date_pay')"
                    rules="required"
                    v-slot="{ validated, errors }"
                  >
                    <v-text-field
                      v-model="living_cost.date_pay"
                      :label="$t('labels.date_pay')"
                      prepend-inner-icon="mdi-calendar"
                      persistent-hint
                      readonly
                      v-on="on"
                      :success="validated"
                      :error-messages="errors"
                    ></v-text-field>
                  </ValidationProvider>
                </template>
                <v-date-picker v-model="living_cost.date_pay" no-title @input="date_select = false"></v-date-picker>
              </v-menu>
              <!-- price  -->
              <ValidationProvider
                :name="$t('labels.price')"
                rules="required|min_value:1|max_value:99999999"
                v-slot="{ validated, errors }"
              >
                <v-text-field
                  type="number"
                  prefix="$"
                  dense
                  clearable
                  :label="$t('labels.price')"
                  v-model="living_cost.price"
                  :success="validated"
                  :error-messages="errors"
                ></v-text-field>
              </ValidationProvider>
              <!-- payer user -->
              <ValidationProvider
                :name="$t('labels.payer')"
                rules="required"
                v-slot="{ validated, errors }"
              >
                <v-autocomplete
                  v-model="living_cost.payer"
                  :items="home_member"
                  chips
                  :label="$t('labels.payer')"
                  item-text="name"
                  return-object
                  hide-details
                  hide-no-data
                  hide-selected
                  :success="validated"
                  :error-messages="errors"
                ></v-autocomplete>
              </ValidationProvider>
              <!-- receiver -->
              <ValidationProvider
                :name="$t('labels.beneficiary')"
                rules="required"
                v-slot="{ validated, errors }"
              >
                <v-select
                  v-model="living_cost.receiver"
                  :items="listMemberUser"
                  :chips="true"
                  :multiple="true"
                  :label="$t('labels.beneficiary')"
                  item-text="name"
                  return-object
                  :success="validated"
                  :error-messages="errors"
                >
                  <template v-slot:selection="{ item }">
                    <v-chip>
                      <span>{{ item.name }}</span>
                    </v-chip>
                  </template>
                </v-select>
              </ValidationProvider>
              <ValidationProvider
                :name="$t('labels.bill')"
                rules="image"
                v-slot="{ validated, errors }"
              >
                <v-file-input
                  multiple
                  prepend-icon="mdi-camera"
                  :label="$t('labels.bill')"
                  accept="image/png, image/jpeg, image/bmp"
                  :placeholder="$t('labels.select_image')"
                  chips
                  v-model="files"
                  @change="onFileChange"
                  @click:clear="removeImage"
                  :error-messages="errors"
                  :success="validated"
                />
              </ValidationProvider>
              <v-img v-if="living_cost.image" :src="living_cost.image" aspect-ratio="2">
                <v-row class="fill-height">
                  <v-btn dark icon absolute right top ripple @click="removeImage()">
                    <v-icon>mdi-close</v-icon>
                  </v-btn>
                </v-row>
              </v-img>

              <v-textarea
                clearable
                auto-grow
                :label="$t('labels.detail')"
                v-model="living_cost.detail"
              ></v-textarea>
            </v-form>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="close">{{ $t("buttons.cancel") }}</v-btn>
          <v-btn
            color="blue darken-1"
            text
            @click="saveLivingCost(edit)"
            :loading="loading"
            :disabled="invalid"
          >{{ $t("buttons.save") }}</v-btn>
        </v-card-actions>
        <!-- end add new cost living or edit cost living -->
      </v-card>
    </v-dialog>
  </ValidationObserver>
</template>

<script>
import { ValidationProvider, ValidationObserver } from "vee-validate";
export default {
  props: {
    living_cost: {
      type: Object,
      required: true
    },
    dialog: {
      type: Boolean,
      required: true
    },
    edit: {
      type: Boolean,
      required: true
    }
  },
  components: {
    ValidationObserver,
    ValidationProvider
  },
  data() {
    return {
      home_member: [],
      date_select: false,
      flag: {
        snackbar: {
          flag: false,
          message: "",
          color: "#004D40"
        }
      },
      files: null, 
      loading: false
    };
  },
  computed: {
    formTitle() {
      return this.edit === false
        ? this.$t("labels.add_new")
        : this.$t("labels.edit");
    },
    listMemberUser() {
      let listMember = new Array();
      this.home_member.map(item => {
        listMember.push(item);
      });
      return listMember;
    },
    computedDateFormatted() {
      this.living_cost.date_pay = this.formatDate(this.date_select.date);
      return this.formatDate(this.date_select.date);
    },
    dialogFlag: {
      get() {
        return this.dialog;
      },
      async set(newValue) {
        this.files = null;
        await this.$bus.emit("closeDialog", newValue);
        this.$refs.obs.reset();
        // this.$nextTick(() => {
        //     this.$refs.obs.reset(); // reset remain error message
        // });
      }
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
        this.home_member = response.data.data;
      });
  },
  methods: {
    async close() {
      this.files = null;
      this.$bus.emit("closeDialog", false);
      this.$refs.obs.errors = {};
    },
    //save living cost
    saveLivingCost(edit) {
      const token = localStorage.getItem("tweetr-token");
      if (
        this.living_cost.name !== "" &&
        this.living_cost.price > 0 &&
        this.living_cost.payer_name != ""
      ) {
        let formData = new FormData();
        if (this.files) {
          formData.append("file", this.files[0]);
        } else {
          formData.append("file", this.files);
        }
        formData.append("living_cost", JSON.stringify(this.living_cost));
        //set wait loading response from api
        this.loading = true
        if (!edit) {
          axios
            .post("cost/create_cost", formData, {
              headers: {
                Authorization: `Bearer ${token}`,
                "content-type": "multipart/form-data"
              }
            })
            .then(response => {
              //send emit to parent
              this.living_cost.id = response.data.data.living_cost_id;
              this.$bus.emit("saveLivingCost", this.living_cost);
              this.close();
              this.flag.snackbar = {
                flag: true,
                message: this.$t("messages.success.add_done"),
                color: "success"
              };
            })
            .catch(error => {
              this.flag.snackbar = {
                flag: true,
                message: this.$t("messages.success.add_fail"),
                color: "error"
              };
              this.$bus.emit("setSnackbar", this.flag);
            })
            .then(() => {
              //    reset validate
              this.$refs.obs.reset();
              this.$bus.emit("setSnackbar", this.flag);
            });
        } else {
          axios
            .put("cost/update_cost", formData, {
              headers: {
                Authorization: `Bearer ${token}`,
                "content-type": "multipart/form-data"
              }
            })
            .then(response => {
              //send emit to parent
              this.$bus.emit("saveLivingCost", this.living_cost);
              this.close();
              this.flag.snackbar = {
                flag: true,
                message: this.$t("messages.success.edit_done"),
                color: "success"
              };
            })
            .catch(error => {
              this.flag.snackbar = {
                flag: true,
                message: this.$t("messages.success.edit_fail"),
                color: "error"
              };
            })
            .then(() => {
              //    reset validate
              this.$refs.obs.reset();
              this.$bus.emit("setSnackbar", this.flag);
            });
        }
      } else {
        this.flag.snackbar = {
          flag: true,
          message: this.$t("messages.error.required"),
          color: "error"
        };
      }
    },
    // handle select payer
    selectPayer(item) {
      this.living_cost.payer_name = item.name;
      this.living_cost.payer_id = item.id;
    },
    //format date time
    formatDate(date) {
      if (!date) return null;

      const [year, month, day] = date.split("-");
      return `${month}/${day}/${year}`;
    },
    //handle chose image
    onFileChange(files) {
      if (files && files.length > 0) {
        const extend_file = files[0].type;
        const image_extend = "image/png, image/jpeg, image/bmp";
        if (image_extend.search(extend_file) > -1) {
          this.files = files;
          this.createImage(files[0]);
        }
      } else {
        this.removeImage();
      }
    },
    createImage(file) {
      var image = new Image();
      var reader = new FileReader();
      var vm = this;

      reader.onload = e => {
        vm.living_cost.image = e.target.result;
      };
      reader.readAsDataURL(file);
    },
    removeImage() {
      this.files = null;
      this.living_cost.image = "";
    }
  }
};
</script>
