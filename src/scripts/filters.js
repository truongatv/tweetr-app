import Vue from "vue";
Vue.filter("currency", value => {
  if (value >= 0) {
    let val = (value/1).toFixed(2).replace('.', ',')
    return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
  }
  return null;
});