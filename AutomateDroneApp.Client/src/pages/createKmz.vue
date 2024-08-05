<template>
  <div class="mt-8 mb-20 mx-auto max-w-fit">

    <h1 class="mb-4 text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-50 sm:text-4xl">Kmz Files</h1>

    <AutoCreateForm type="CreateS3FileItem" formStyle="card" :model="newModel" @done="done" @save="save">


    </AutoCreateForm>


  </div>

</template>

<script setup lang="ts">
import {CreateS3FileItem, DroneProject, S3FileItem} from "@/dtos";
import {ref} from 'vue';

import {useRouter} from 'vue-router'
const router =  useRouter()
const done = async function () {
  alert("hi")
}

const save = async function (result: any) {
  debugger;
  //id: fixJson(geometryFile).id}
  router.push({name: '/map-view/[id]', params: {id: result.id}})
}

const newModel = ref<CreateS3FileItem>(new CreateS3FileItem({
  droneProjectId: 1
}))
</script>