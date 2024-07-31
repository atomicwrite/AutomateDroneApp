<template>
  <div class="mt-8 mb-20 mx-auto max-w-fit">

    <h1 class="mb-4 text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-50 sm:text-4xl">Projects</h1>

    <AutoQueryGrid type="DroneProject" >
      <template #id="{ id }">
        <span class="font-semibold text-gray-900 dark:text-gray-50" v-html="id"></span>
      </template>
      <template #name="{ name }">
        <span class="font-semibold text-gray-900 dark:text-gray-50" v-html="name"></span>
      </template>
       
    </AutoQueryGrid>
<!--    v-on:done="close" v-on:save="close"-->
<!--    <AutoEditForm v-if="coupon" type="UpdateCoupon" v-model="coupon"  />-->

     

  </div>
</template>

<script setup lang="ts">
import { ref } from "vue"
 
</script>