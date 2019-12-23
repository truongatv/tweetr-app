<template>
  <div>
    <ChangeComponent :componentName="getComponentName" />
  </div>
</template>

<script>
import ChangeComponent from "@/components/ContentComponents/ChangeComponent"
export default {
  components: {
    ChangeComponent
  },
  computed: {
    getComponentName() {
      return this.$store.getters.currentComponent;
    }
  }
};
</script>