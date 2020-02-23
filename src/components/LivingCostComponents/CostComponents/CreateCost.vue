<template>
    <ValidationObserver ref="obs" v-slot="{ invalid }" tag="form" slim>
        <v-dialog v-model="dialogFlag" max-width="500px">
            <template v-slot:activator="{ on }">
                <v-btn color="primary" dark class="mb-2" v-on="on">{{label.add_new}}</v-btn>
            </template>
            <v-card>
                <v-card-title>
                    <span class="headline">{{ formTitle }}</span>
                </v-card-title>
                <!-- start add new cost living or edit cost living -->
                <v-card-text>
                    <v-container>
                        <v-form>
                            <ValidationProvider :name="label.name_product" rules="required" v-slot="{validated, errors}">
                                <v-text-field
                                    dense
                                    clearable
                                    :label="label.name_product"
                                    v-model="living_cost.name"
                                    :error-messages="errors"
                                    :success="validated"
                                ></v-text-field>
                            </ValidationProvider>
                            <v-menu
                                v-model="dateSelect"
                                :close-on-content-click="false"
                                transition="scale-transition"
                                offset-y
                                max-width="290px"
                                min-width="290px"
                            >
                                <template v-slot:activator="{ on }">
                                    <ValidationProvider :name="label.date_pay" rules="required" v-slot="{validated, errors}">
                                        <v-text-field
                                            v-model="living_cost.date_pay"
                                            :label="label.date_pay"
                                            prepend-inner-icon="mdi-calendar"
                                            persistent-hint
                                            readonly
                                            v-on="on"
                                            :success="validated"
                                            :error-messages="errors"
                                        ></v-text-field>
                                    </ValidationProvider>
                                </template>
                                <v-date-picker
                                    v-model="living_cost.date_pay"
                                    no-title
                                    @input="dateSelect = false"
                                ></v-date-picker>
                            </v-menu>
                            <ValidationProvider :name="label.price" rules="required|min_value:1" v-slot="{validated, errors}">
                                <v-text-field
                                    type="number"
                                    prefix="$"
                                    dense
                                    clearable
                                    :label="label.price"
                                    v-model="living_cost.price"
                                    :success="validated"
                                    :error-messages="errors"
                                ></v-text-field>
                            </ValidationProvider>
                            <!-- payer user -->
                            <ValidationProvider :name="label.payer" rules="required" v-slot="{validated, errors}">
                                <v-autocomplete
                                    v-model="living_cost.payer"
                                    :items="home_member"
                                    chips
                                    :label="label.payer"
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
                            <ValidationProvider :name="label.beneficiary" rules="required" v-slot="{validated, errors}">
                                <v-select
                                    v-model="living_cost.receiver"
                                    :items="listMemberUser"
                                    :chips="true"
                                    :multiple="true"
                                    :label="label.beneficiary"
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
                            <v-textarea clearable auto-grow :label="label.detail" v-model="living_cost.detail"></v-textarea>
                        </v-form>
                    </v-container>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="close">{{button.cancel}}</v-btn>
                    <v-btn color="blue darken-1" text @click="saveLivingCost(edit)" :disabled="invalid">{{button.save}}</v-btn>
                </v-card-actions>
                <!-- end add new cost living or edit cost living -->
            </v-card>
        </v-dialog>
    </ValidationObserver>
</template>

<script>
import { label, button, messages } from "@/static/define/const";
import {
    ValidationProvider,
    ValidationObserver
} from 'vee-validate'
export default {
    props: {
        living_cost : {
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
            label: label,
            button: button,
            dateSelect: false,
            flag: {
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
            return this.editedIndex === -1 ? label.add_new : label.edit;
        },
        listMemberUser() {
            let listMember = new Array();
            this.home_member.map((item) => {
                listMember.push(item
                )
            })
            return listMember
        },
        computedDateFormatted() {
            this.living_cost.date_pay = this.formatDate(this.dateSelect.date);
            return this.formatDate(this.dateSelect.date);
        },
        dialogFlag : {
            get() {
                return this.dialog
            },
            async set(newValue) {
                await this.$bus.emit('closeDialog', newValue)
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
                this.home_member = response.data.data
            })
    },
    methods: {
        async close() {
            this.$bus.emit('closeDialog', false)
            this.$refs.obs.errors = {};
        },
            //save living cost
        saveLivingCost(edit) {
            const token = localStorage.getItem("tweetr-token")
            if(this.living_cost.name !== "" && this.living_cost.price > 0 && this.living_cost.payer_name != "") {
                if(!edit) {
                    axios.post('cost/create_cost', this.living_cost, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                    })
                    .then(response => {
                        //send emit to parent 
                        this.living_cost.id = response.data.data.living_cost_id
                        this.$bus.emit('saveLivingCost', this.living_cost)
                        this.close()
                        this.flag.snackbar = {
                            flag: true,
                            message: messages.success.add_done,
                            color: "success"
                        }
                        this.$refs.obs.reset()
                    })
                    .catch(error => {
                        this.flag.snackbar = {
                            flag: true,
                            message: messages.success.add_fail,
                            color: "error"
                        }
                        console.log(error.response)
                    })
                } else {
                    axios.put('cost/update_cost', this.living_cost, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                    })
                    .then(response => {
                        //send emit to parent 
                        this.$bus.emit('saveLivingCost', this.living_cost)
                        this.close()
                        this.flag.snackbar = {
                            flag: true,
                            message: messages.success.edit_done,
                            color: "success"
                        }
                    })
                    .catch(error => {
                        this.flag.snackbar = {
                            flag: true,
                            message: messages.success.edit_fail,
                            color: "error"
                        }
                        console.log(error.response)
                    })
                }
            } else {
                this.flag.snackbar = {
                flag: true,
                message: messages.error.required,
                color: "error"
                }
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