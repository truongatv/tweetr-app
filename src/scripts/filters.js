import Vue from "vue";
Vue.filter("currency", (value, currency) => {
  if (value >= 0) {
    let val = (value/1).toFixed(2).replace('.', ',')
    if(currency == 2) val = val + " VND"
    else if(currency == 3) val = val + " USD"
    else val = val + " 円"

    return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
  }
  return null;
});