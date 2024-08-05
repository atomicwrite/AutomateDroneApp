<template>
  <div class="mt-8 mb-20 mx-auto max-w-fit">

    <h1 class="mb-4 text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-50 sm:text-4xl">Projects</h1>

    <AutoQueryGrid type="DroneProject">
      <template #id="{ id, name }">

        <button class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded" @click="Delete(id)">
          Delete <span v-html="id"></span> {{ name }}
        </button>
      </template>
      <template #name="{ name,id }">

        <RouterLink
            class="inline-flex items-center px-4 py-2 bg-green-500 text-white text-sm font-medium rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"

            :to="`/createKmz?droneProjectId=${id}&create`"
        >
          Upload Kmz Layer to {{ name }}
        </RouterLink>


      </template>

    </AutoQueryGrid>
    <!--    v-on:done="close" v-on:save="close"-->
    <!--    <AutoEditForm v-if="coupon" type="UpdateCoupon" v-model="coupon"  />-->


  </div>
</template>

<script setup lang="ts">
import {ref} from "vue"

const Delete = async function (id: number) {
  if (confirm("This will delete all the maps and paths and reports associated with this project, are you sure")) {

  }
}
</script>