<template>
    <HomeMember v-if="componentName == item.home_member_component" />
    <Profile v-else-if="componentName == item.profile" />
</template>

<script>
import {item} from "../../const"
import HomeMember from "@/components/ContentComponents/HomeMember"
import Profile from "@/components/ContentComponents/Profile"

export default {
    props: {
        componentName : {
            type: String,
            required: true
        }
    },
    data() {
        return {
            item: {}
        }
    },
    components: {
        HomeMember,
        Profile
    },
    created() {
        this.item = item
    },
}
</script>