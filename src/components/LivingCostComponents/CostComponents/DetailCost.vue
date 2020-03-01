<template>
    <td :colspan="10">
        <v-container>
            <h4>{{$t('labels.cost_detail')}}</h4>
            <v-row align="center">
                <!-- receiver -->
                <v-col cols="4" >
                    <v-subheader>{{$t('labels.beneficiary')}}</v-subheader>
                </v-col>
                <v-col cols="8">
                    <v-card-text>
                        <v-chip v-for="i in item.receiver" :key="i.id" ma-1>
                            {{i.name}}
                        </v-chip>
                    </v-card-text>
                </v-col>
                <!-- details -->
                <v-col cols="4" >
                    <v-subheader>{{$t('labels.detail')}}</v-subheader>
                </v-col>
                <v-col cols="8">
                    <v-textarea
                        :value="item.detail"
                        readonly
                    ></v-textarea>
                </v-col>
                <!-- created date   -->
                <v-col cols="4" >
                    <v-subheader>{{$t('labels.created')}}</v-subheader>
                </v-col>
                <v-col cols="8">
                    <v-text-field
                        :value="item.created_at"
                        readonly
                    ></v-text-field>
                </v-col>
                <!-- updated date  -->
                <v-col cols="4" >
                    <v-subheader>{{$t('labels.updated')}}</v-subheader>
                </v-col>
                <v-col cols="8">
                    <v-text-field
                        :value="item.updated_at"
                        readonly
                    ></v-text-field>
                </v-col>

            </v-row>
        </v-container>
    </td>
</template>

<script>
export default {
    props: {
        item: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
        }
    },
}
</script>