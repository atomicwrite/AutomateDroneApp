<template>
  <div class="mt-8 mb-20 mx-auto max-w-fit">
    <h1 class="mb-4 text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-50 sm:text-4xl">Map Editor</h1>
    <div>
      <label class="block text-gray-700 text-sm font-bold mb-2">Pick a shape type</label>
      <button v-if="mode === 'none'" class="btn" @click="selectOption('Rectangle')">Rectangle</button>
      <button v-if="mode === 'none'" class="btn" @click="selectOption('Custom')">Custom</button>
      <button v-if="mode !== 'none'" class="btn" @click="undoSelection">Undo</button>
      <button v-if="mode !== 'none'" class="btn" @click="finishSelection">Finish</button>
    </div>
    <GoogleMap v-show="mode !=='none'"
               map-type-id="satellite"

               ref="mapRef"
               api-key="AIzaSyD2qrcgqg_Atb_-4SoIcHKqLE-m9PpIAC0"
               style="width: 80vw; height: 80vh"
               :center="center"
               :zoom="15"
    >
      <Marker :options="{ position: center }"/>
    </GoogleMap>

  </div>
</template>

<script setup lang="ts">
const mapRef = ref<any>(null)
import {computed, ref, watch, onMounted} from "vue"
import {useClient, useAuth, useFormatters} from "@servicestack/vue"
import {AwsUrlRequest, AwsUrlResponse, QueryS3FileItems, S3FileItem} from "@/dtos"
import {useHead} from "@unhead/vue"
import {useRoute} from "vue-router";

useHead({title: 'Map Editor'})
import {GoogleMap, Marker} from 'vue3-google-map'

const create = ref(false)
const editId = ref()
const edit = ref()
const bookings = ref<S3FileItem[]>([])
const mode = ref('none')
const client = useClient()
const {currency} = useFormatters()
const {hasRole} = useAuth()
const canDelete = computed(() => hasRole('Manager'))
const route = useRoute();
const polyRef = ref<any>(null)

watch([() => mapRef.value?.ready], async ([ready]) => {

  if (!ready) return;
  const urlResponse = await client.api(new AwsUrlRequest({id: 5}))
  if (urlResponse.succeeded) {
    const kmzLayer = new mapRef.value.api.KmlLayer(urlResponse.response?.url);
    kmzLayer.setMap(mapRef.value.map);

    const flightPathContainer = new mapRef.value.api.Polyline({

      strokeColor: "#324480",
      strokeOpacity: 1.0,
      strokeWeight: 2,
    });
    flightPathContainer.setMap(mapRef.value.map);
    polyRef.value = flightPathContainer;
    mapRef.value.map.addListener('click', mouseClick);
  }

})

const finishSelection = async function () {

}
const rectangle = ref<any>(null)

const undoSelection = async function () {
  switch (mode.value) {
    case "Rectangle":
      debugger;
      await removeRectangle()
      break;
    case "Custom":
      const path = polyRef.value?.getPath();
      if (path) {
        path.pop();
        polyRef.value?.setPath(path);
      }
      break;
    default:
      return;
  }

}

const selectOption = async function (option: string) {
  mode.value = option;
}

async function removeRectangle() {

  if (rectangle.value) {
    rectangle.value?.setMap(null);
  }
}

function addLatLng(event: any) {
  const path = polyRef.value?.getPath();

  // Because path is an MVCArray, we can simply append a new coordinate
  // and it will automatically appear.
  path.push(event.latLng);

  // Add a new marker at the new plotted point on the polyline.
  new mapRef.value.api.Marker({
    position: event.latLng,
    title: "#" + path.getLength(),
    map: mapRef.value,
  });
}

function DrawRectangle(event: any) {
  if (rectangle.value)
    return
  const bounds = {
    north: event.latLng.lat() + 0.01,
    south: event.latLng.lat(),
    east: event.latLng.lng() + 0.01,
    west: event.latLng.lng()
  };


  rectangle.value = new mapRef.value.api.Rectangle({
    bounds: bounds,
    editable: true,
    draggable: true
  });

  rectangle.value?.setMap(mapRef.value.map);
}

async function mouseClick(event: any) {

  switch (mode.value) {
    case "Custom":
      addLatLng(event);
      break;
    case "Rectangle":
      DrawRectangle(event);
      break;
  }


}

async function loadedMetadata() {

}


function reset() {

}


onMounted(refresh)

async function refresh() {
  const api = await client.api(new QueryS3FileItems({id: (route.params as any)?.id}))
  if (api.succeeded) {

  }
}


const center = {lat: 40.689247, lng: -74.044502}

</script>
<style>
.btn {
  background-color: #0084ff;
  border: none;
  color: white;
  padding: 15px 32px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin: 4px 2px;
  cursor: pointer;
}
</style>