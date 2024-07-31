<template>
  <div class="mt-8 mb-20 mx-auto max-w-fit">

    <h1 class="mb-4 text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-50 sm:text-4xl">Kmz Files</h1>

    <AutoQueryGrid type="S3FileItem"  >

      <template #id="{ id }">
        <span class="font-semibold text-gray-900 dark:text-gray-50" v-html="id"></span>
      </template>

      <template #geometryFile="{ geometryFile }">

        <div class="flex items-center justify-center space-x-4">
<!--          <a-->
<!--              class="inline-flex items-center px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"-->
<!--              :href="`/api/DownloadRequest?id=${geometryFile.id}`"-->
<!--          >-->
<!--            Download-->
<!--          </a>-->
          <RouterLink
              class="inline-flex items-center px-4 py-2 bg-green-500 text-white text-sm font-medium rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
         
              :to="{name:'/map-view/[id]',params:{ id: geometryFile.id}}"
          >
            View on Map
          </RouterLink>
        </div>
      </template>

    </AutoQueryGrid>
    <AutoEditForm v-show="false"   type="UpdateS3FileItem" />
    <!--    v-on:done="close" v-on:save="close"-->
    <!--    <AutoEditForm v-if="coupon" type="UpdateCoupon" v-model="coupon"  />-->


  </div>
</template>

<script setup lang="ts">
import {ref} from "vue"

</script>