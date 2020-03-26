export default {
    computed: {
        listCurrency() {
            let currency = new Array();
            currency.push(
                {
                    id: 1,
                    name: '円'
                },
                {
                    id: 2,
                    name: 'VND'
                },
                {
                    id: 3,
                    name: 'USD'
                }
            )
            return currency
        }
    },
    methods: {
        setStoreUser() {
            this.getUserInfo().then(response => {
                this.$store.commit("setCurrentUserInfo", response);
            });
        },
        getUserInfo() {
            const token = localStorage.getItem("tweetr-token");
            return axios
                .get("/account/profile", {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
                .then(response => {
                    return response.data.data[0];
                })
                .catch(error => { });
        }
    }
};