export default {
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