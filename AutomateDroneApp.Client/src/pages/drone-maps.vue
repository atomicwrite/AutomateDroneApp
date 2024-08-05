<template>
  <div class="mt-8 mb-20 mx-auto max-w-fit">
    <AutoQueryGrid type="DronePath">

      <template #id="{ id }">
        <span class="font-semibold text-gray-900 dark:text-gray-50">{{ id }}</span>
      </template>
      <template #name="{ name }">
        <span class="font-semibold text-gray-900 dark:text-gray-50">{{ name }}</span>
      </template>

      <template #s3DronePathFile="{ s3DronePathFile }">

        <button
            class="inline-flex items-center px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            @click="DownloadFile(s3DronePathFile.id)"
        >
          Download
        </button>
      </template>

    </AutoQueryGrid>
  </div>
</template>

<script setup lang="ts">
const mapRef = ref<any>(null)
import {computed, onMounted, ref, watch} from "vue"
import {useAuth, useClient, useFormatters} from "@servicestack/vue"
import {AwsUrlRequest, QueryS3FileItems, S3FileItem} from "@/dtos"
import {useHead} from "@unhead/vue"
import {useRoute, useRouter} from "vue-router";
import {GoogleMap} from 'vue3-google-map'

useHead({title: 'Map Editor'})

const StartLon = ref(0.0)
const StopLon = ref(0.0)
const StartLat = ref(0.0)
const StopLat = ref(0.0)

const StartMarker = ref<any>(null)
const distance = ref(32.8084)
const distanceVertical = ref(32.8084)
const StopMarker = ref<any>(null)
const ZigZagoptions = ref(false)
const create = ref(false)
const editId = ref()
const edit = ref()
const bookings = ref<S3FileItem[]>([])
const mode = ref('none')
const subMode = ref('none')
const client = useClient()
const {currency} = useFormatters()
const {hasRole} = useAuth()
const canDelete = computed(() => hasRole('Manager'))
const route = useRoute();
const mapName = ref("map")
const polyLineRef = ref<any>(null)
const polyGonRef = ref<any>(null)
const DownloadFile = async function (s3DronePathFileId:number) {
  debugger;
  const urlResponse = await client.api(new AwsUrlRequest({id: s3DronePathFileId, fileType: 'drone-path'}))
  if (urlResponse.succeeded) {
    (window as any).location = urlResponse.response?.url
  }else
  {
    alert(urlResponse.error?.message)
  }


}
</script>
 