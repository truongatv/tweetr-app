<template>
    <td :colspan="10">
        <v-container>
            <h1>TITLE</h1>
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quasi
            laudantium possimus voluptatem, nobis facilis est, nostrum sequi
            modi delectus accusantium illum fuga, dicta magnam! Iure magnam
            eveniet quaerat ad earum.
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
    }
}
</script>