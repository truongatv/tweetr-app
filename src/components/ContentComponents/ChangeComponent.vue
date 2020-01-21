<template>
    <HomeMember v-if="componentName == item.home_member" />
    <Profile v-else-if="componentName == item.profile" />
    <PersonalFee v-else-if="componentName == item.personal_fee" />
    <HomeFee v-else-if="componentName == item.home_fee" />
</template>

<script>
import {component} from "../../const"
import HomeMember from "@/components/ContentComponents/HomeMember"
import Profile from "@/components/ContentComponents/Profile"
import PersonalFee from '@/components/ContentComponents/PersonalFee'
import HomeFee from '@/components/ContentComponents/HomeFee'

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
        PersonalFee,
        HomeFee
    },
    created() {
        this.item = component
    },
}
</script>