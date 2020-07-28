<template>
  <v-simple-table v-if="is_loaded">
    <template v-slot:default>
      <thead>
        <tr>
          <th></th>
          <th>{{$t('labels.using_fee')}}</th>
          <th>{{$t('labels.money_to_pay')}}</th>
          <th>{{$t('labels.money_to_receive')}}</th>
          <th>{{$t('labels.spent')}}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(value) in getGeneralInfo" :key="value.id">
          <td>
            <v-chip>
              <v-avatar left>
                <v-img v-if="value.avatar" :src="value.avatar"></v-img>
                <v-img v-else src="@/static/avatar/default_avatar.png"></v-img>
              </v-avatar>
              {{ value.name }}
            </v-chip>
          </td>
          <td>
            <div v-for="(v, i) in value.used" :key="v.type">
              <v-chip
                :color="v.color"
                outlined
                label
                v-if="v.sum > 0"
                class="ma-1"
              >{{ v.sum | currency(i)}}</v-chip>
            </div>
          </td>
          <td>
            <div v-for="(v, i) in value.used" :key="v.type">
              <v-chip
                outlined
                label
                :color="v.color"
                v-if="v.sum - value.payed[i].sum > 0"
                class="ma-1"
              >{{v.sum - value.payed[i].sum | currency(i)}}</v-chip>
            </div>
          </td>
          <td>
            <div v-for="(v, i) in value.used" :key="v.type">
              <v-chip
                outlined
                label
                :color="v.color"
                v-if=" value.payed[i].sum - v.sum > 0"
                class="ma-1"
              >{{ value.payed[i].sum - v.sum | currency(i)}}</v-chip>
            </div>
          </td>
          <td>
            <div v-for="(v, i) in value.payed" :key="v.type">
              <v-chip
                outlined
                label
                :color="v.color"
                v-if="v.sum > 0"
                class="ma-1"
              >{{ v.sum | currency(i)}}</v-chip>
            </div>
          </td>
        </tr>
      </tbody>
    </template>
  </v-simple-table>
</template>
<script>
export default {
  props: {
    living_cost_data: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      home_member: {},
      is_loaded: false
    };
  },
  async created() {
    this.getListMember();
  },
  computed: {
    getGeneralInfo() {
      //reset data
      this.resetDataHomeMember();
      this.living_cost_data.map(value => {
        /**
         *cal used fee
         */
        //number of users using
        let number = value.receiver.length;
        // console.log(number)
        value.receiver.map(detail => {
          console.log(this.home_member[detail.id]);
          this.home_member[detail.id].used[value.currency_id].sum +=
            value.price / number;
        });
        /**
         * cal money need pay
         */
        this.home_member[value.payer.id].payed[value.currency_id].sum +=
          value.price;
      });
      return this.home_member;
    }
  },
  methods: {
    getListMember() {
      const token = localStorage.getItem("tweetr-token");
      axios
        .get("/home/home_member", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        .then(response => {
          // this.home_member = response.data.data;
          response.data.data.map(value => {
            this.home_member[value.id] = {
              id: value.id,
              name: value.name,
              email: value.email,
              avatar: value.avatar,
              used: {
                1: {
                  sum: 0,
                  type: 1,
                  color: "blue"
                },
                2: {
                  sum: 0,
                  type: 2,
                  color: "red"
                },
                3: {
                  sum: 0,
                  type: 3,
                  color: "cyan"
                }
              },
              payed: {
                1: {
                  sum: 0,
                  type: 1,
                  color: "blue"
                },
                2: {
                  sum: 0,
                  type: 2,
                  color: "red"
                },
                3: {
                  sum: 0,
                  type: 3,
                  color: "cyan"
                }
              }
            };
          });
          this.is_loaded = true;
        });
    },
    CalReceiver(detail) {
      //number of users using
      let number = detail.receiver.length;
      // console.log(number)
      detail.receiver.map(value => {
        this.home_member[value.id].used += detail.price / number;
      });
    },
    CalMoneyPayed(value) {
      this.home_member[value.payer.id].payed += value.price;
    },
    resetDataHomeMember() {
      let self = this;
      Object.keys(this.home_member).forEach(function(item) {
        self.home_member[item].used = {
          1: {
            sum: 0,
            type: 1,
            color: "blue"
          },
          2: {
            sum: 0,
            type: 2,
            color: "red"
          },
          3: {
            sum: 0,
            type: 3,
            color: "cyan"
          }
        };
        self.home_member[item].payed = {
          1: {
            sum: 0,
            type: 1,
            color: "blue"
          },
          2: {
            sum: 0,
            type: 2,
            color: "red"
          },
          3: {
            sum: 0,
            type: 3,
            color: "cyan"
          }
        };
      });
    }
  }
};
</script>