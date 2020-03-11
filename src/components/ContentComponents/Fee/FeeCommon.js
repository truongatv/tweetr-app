export default {
    created() {
        this.initialize();
        //show snackbar when create, update cost
        this.$bus.on("setSnackbar", value => {
            this.flag = value;
        });
        //search by date
        this.$bus.on("searchByDate", value => {
            this.searchByDate(value);
        });
    },
    methods: {
        initialize() {
            const token = localStorage.getItem("tweetr-token");
            axios
                .get(this.uri, {
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
            let date_pay_start = value[0];
            let date_pay_end = value[0];
            if (typeof value[1] != "undefined") {
                date_pay_end = value[1];
            }
            const token = localStorage.getItem("tweetr-token");
            axios
                .get(this.uri, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    },
                    params: {
                        date_pay_start: date_pay_start,
                        date_pay_end: date_pay_end
                    }
                })
                .then(response => {
                    this.living_cost_data = response.data.data;
                })
                .catch(error => {
                    console.log(error.response);
                });
        }
    }
};