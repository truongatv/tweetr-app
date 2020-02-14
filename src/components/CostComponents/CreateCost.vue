<template>
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
</template>

<script>
import { label, button, messages } from "@/static/define/const";
export default {
    props: {
        living_cost : {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            homeMember: [],
            label: label,
            button: button,
            rules: { 
                nameProductRules: [
                    v => !!v || messages.error.required
                ],
            },
            dateSelect: false,
            flag: {
                dialog: false,
                snackbar: {
                    flag: false,
                    message: "",
                    color: "#004D40"
                },
            },
        }
    },
    computed: {
        formTitle() {
            return this.editedIndex === -1 ? label.addNew : label.edit;
        },
        listMemberUser() {
            let listMember = new Array();
            this.homeMember.map((item) => {
                listMember.push(item
                )
            })
            console.log(listMember)
            return listMember
        },
        computedDateFormatted() {
            this.living_cost.date_pay = this.formatDate(this.dateSelect.date);
            return this.formatDate(this.dateSelect.date);
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
    methods: {
        close() {
            this.flag.dialog = false;
            // setTimeout(() => {
            //     this.editedItem = Object.assign({}, this.defaultItem);
            //     this.editedIndex = -1;
            // }, 300);
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
    },
}
</script>