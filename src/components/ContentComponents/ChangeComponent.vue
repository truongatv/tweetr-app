<template>
    <HomeMember v-if="componentName == item.home_member_component" />
    <Profile v-else-if="componentName == item.profile" />
    <PersonalFee v-else-if="componentName == item.personal_fee_component" />
</template>

<script>
import {item} from "../../const"
import HomeMember from "@/components/ContentComponents/HomeMember"
import Profile from "@/components/ContentComponents/Profile"
import PersonalFee from '@/components/ContentComponents/PersonalFee'

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
        Profile,
        PersonalFee
    },
    created() {
        this.item = item
    },
}
</script>