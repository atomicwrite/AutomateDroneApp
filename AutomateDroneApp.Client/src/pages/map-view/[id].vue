<template>
  <div class="mt-8 mb-20 mx-auto max-w-fit">
    <h1 class="mb-4 text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-50 sm:text-4xl">Map Editor</h1>

    <div v-if="mode !== 'ZigZag'" class="  grid-rows-3 gap-4">

      <label class="block text-gray-700 text-sm font-bold mb-2">Pick a shape type</label>
      <button v-if="mode === 'none'" class="btn" @click="selectOption('Rectangle')">Rectangle</button>
      <button v-if="mode === 'none'" class="btn" @click="selectOption('Custom')">Custom</button>
      <button v-if="mode !== 'none' && mode !== 'Rectangle'" class="btn" @click="undoSelection">Undo</button>
      <button v-if="mode !== 'none'" class="btn" @click="finishSelection">Next</button>
    </div>
    <div v-if="mode === 'ZigZag'">
      <button class="btn" v-if="!ZigZagoptions" @click="showZigZagOptions">Show Options</button>
      <button class="btn" v-else @click="hideZigZagOptions">Hide Options</button>
      <p>Click the start and ending points for the drone. Use the options to fine tune.</p>
      <button class="btn" v-if="!ZigZagoptions" @click="GenerateZigZag">Generate</button>
    </div>
    <div v-if="mode === 'ZigZag'" class="gap-4 font-bold w-1/2">

      <div v-if="ZigZagoptions">
        <input type="number" class="w-full" v-model="StartLat">,
        <input type="number" class="w-full" v-model="StartLon">
        <button class="w-full bg-blue hover:bg-blue-dark btn   font-bold py-2 px-4 mb-4 rounded"
                @click="setStartLatLong">Set Start lat/lon From Click
        </button>
      </div>
      <div v-if="ZigZagoptions">
        <input type="number" class="w-full" v-model="StopLat">,
        <input type="number" class="w-full" v-model="StopLon">

        <button class="w-full bg-blue hover:bg-blue-dark btn   font-bold py-2 px-4 mb-4 rounded"
                @click="setStopLatLong">Set Stop lat/lon From Click
        </button>
      </div>
      <div v-if="ZigZagoptions">
        <label> Scan</label>
        <label>H:<input type="number" v-model="distance"></label>
        <label>V:<input type="number" v-model="distanceVertical"></label>
      </div>

    </div>

    <GoogleMap v-show="mode !=='none'"
               map-type-id="satellite"
               :scale-control="true"
               ref="mapRef"
               api-key="AIzaSyD2qrcgqg_Atb_-4SoIcHKqLE-m9PpIAC0"
               style="width: 80vw; height: 80vh"

               :zoom="15"
    >

    </GoogleMap>

  </div>
</template>

<script setup lang="ts">
const mapRef = ref<any>(null)
import {computed, onMounted, ref, watch} from "vue"
import {useAuth, useClient, useFormatters} from "@servicestack/vue"
import {AwsUrlRequest, CreateDronePath, QueryS3FileItems, S3FileItem} from "@/dtos"
import {useHead} from "@unhead/vue"
import {useRoute, useRouter} from "vue-router";
import {GoogleMap} from 'vue3-google-map'

const router = useRouter();
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
const hideZigZagOptions = function () {
  ZigZagoptions.value = false;
}

const showZigZagOptions = function () {
  ZigZagoptions.value = true;
}
const setStartLatLong = async function (e: any) {
  subMode.value = "setStartLatLong"
}
const setStopLatLong = async function (e: any) {
  subMode.value = "setStopLatLong"

}

async function getLatLongs() {
  const items: any[] = []
  const vertices = zigZagLine.value.getPath();
  for (let i = 0; i < vertices.length; i++) {
    const item = vertices.getAt(i);
    const ll = {
      lat: item.lat(),
      lng: item.lng(),
      altitude: item.elevation
    };
    items.push(ll)
  }
  return items;

  // const elevator = mapRef.value.api.ElevationService();
  // const results = await elevator
  //     .getElevationForLocations({
  //       locations: vertices,
  //     });
  // const items: any[] = [];
  // for (let i = 0; i < results.results; i++) {
  //   const xy = vertices[i]
  //   const ll = {
  //     lat: xy.lat(),
  //     lng: xy.lng(),
  //     altitude: xy.elevation
  //   };
  // }
  //return items;
}

const GenerateZigZag = async function (event: any) {
//CreateDroneMap
  let latLongs = await getLatLongs();
  debugger;
  const urlResponse = await client.api(new CreateDronePath({

    droneProjectId: +(route.params as any)?.id,
    name: mapName.value,
    latLngs: latLongs

  }))
  if (urlResponse.succeeded) {
    const id = urlResponse.response?.id;
    router.push({name: '/drone-maps', params: {id: id}})

  }
}


watch([() => mapRef.value?.ready], async ([ready]) => {

  if (!ready) return;
  const urlResponse = await client.api(new AwsUrlRequest({id: (route.params as any)?.id, fileType: 'kmz'}))
  if (urlResponse.succeeded) {
    const kmzLayer = new mapRef.value.api.KmlLayer(urlResponse.response?.url);
    kmzLayer.setMap(mapRef.value.map);

    const flightPathContainer = new mapRef.value.api.Polyline({

      strokeColor: "#324480",
      strokeOpacity: 1.0,
      strokeWeight: 2,
    });
    flightPathContainer.setMap(mapRef.value.map);
    polyLineRef.value = flightPathContainer;
    mapRef.value.map.addListener('click', mouseClick);

  }

})

function createPolygonFromRectangle(rectangle: any) {
  const bounds = rectangle.getBounds();

  const north = bounds.getNorthEast().lat();
  const east = bounds.getNorthEast().lng();
  const south = bounds.getSouthWest().lat();
  const west = bounds.getSouthWest().lng();

  const polygon = new mapRef.value.api.Polygon({
    geodesic: true,
    paths: [
      {lat: north, lng: west},
      {lat: north, lng: east},
      {lat: south, lng: east},
      {lat: south, lng: west}
    ]
  });

  return polygon;
}

function createPolygonFromPolyline(polyline: any) {
  let polygon = new mapRef.value.api.Polygon({
    paths: polyline.getPath(),
    // Add additional options if required.
    // fillColor: '#FF0000',
    // fillOpacity: 0.35,
    // strokeColor: '#FF0000',
    // strokeOpacity: 0.8,
    // strokeWeight: 2,
  });
  return polygon;
}

const finishSelection = async function () {
  if (polyGonRef.value) {
    polyGonRef.value.setMap(null)
    polyGonRef.value.removeListener('click')
  }

  switch (mode.value) {
    case "Rectangle":
      polyGonRef.value = createPolygonFromRectangle(rectangle.value)
      rectangle.value.setMap(null);
      break;
    case "Custom":
      if (polyGonRef.value) {
        polyGonRef.value.setMap(null)
      }
      polyGonRef.value = createPolygonFromPolyline(polyLineRef.value)
      polyLineRef.value.setMap(null);
      break;
    default:
      return;
  }

  polyGonRef.value.setMap(mapRef.value.map)
  polyGonRef.value.addListener('click', polyGonClick);
  mode.value = "ZigZag"
  subMode.value = 'setStartLatLong'

}
const rectangle = ref<any>(null)

const undoSelection = async function () {
  switch (mode.value) {


    case "Rectangle":

      await removeRectangle()
      break;
    case "Custom":
      const path = polyLineRef.value?.getPath();
      if (path) {
        path.pop();
        polyLineRef.value?.setPath(path);
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
  const path = polyLineRef.value?.getPath();

  // Because path is an MVCArray, we can simply append a new coordinate
  // and it will automatically appear.
  path.push(event.latLng);

  // Add a new marker at the new plotted point on the polyline.
  new mapRef.value.api.Marker({
    position: event.latLng,
    title: "#" + path.getLength(),
    map: mapRef.value.map
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

async function polyGonClick(event: any) {
  let lat = event.latLng.lat();
  let long = event.latLng.lng();

  switch (mode.value) {
    case "ZigZag":


      switch (subMode.value) {
        case 'setStartLatLong':
          StartLat.value = lat;
          StartLon.value = long;
          if (StartMarker.value) {
            StartMarker.value.setMap(null);
          }
          StartMarker.value = new mapRef.value.api.Marker({
            position: event.latLng,
            title: "Drone Start",
            map: mapRef.value.map,
          });
          StartMarker.value.setMap(mapRef.value.map)
          subMode.value = 'none';
          if (StopLat.value === 0.0 && StopLon.value === 0.0) {
            subMode.value = 'setStopLatLong';
          }
          break;
        case 'setStopLatLong':
          StopLat.value = lat;
          StopLon.value = long;
          if (StopMarker.value) {
            StopMarker.value.setMap(null);
          }
          StopMarker.value = new mapRef.value.api.Marker({
            position: event.latLng,
            title: "Drone Stop",
            map: mapRef.value.map,
          });
          break;


      }
  }
}

async function mouseClick(event: any) {

  switch (mode.value) {
    case "Custom":
      addLatLng(event);
      break;
    case "Rectangle":
      DrawRectangle(event);
      break;
    case "ZigZag":

  }


}

async function loadedMetadata() {

}


function reset() {

}

const zigZagLine = ref<any>(null)

watch([
  () => StartLat.value,
  () => StartLon.value,
  () => StopLat.value,
  () => StopLon.value,
  () => distance.value,
  () => distanceVertical.value
], async ([startLat, startLon, endLat, endLon, horiztonal, vertical]) => {
  if (!(
      startLat !== 0.0
      && startLon !== 0.0
      && endLat !== 0.0
      && endLon !== 0.0
      && distance.value > 5
      && distanceVertical.value > 5)) {
    return;
  }
  const line = generateZigZagPath(
      {lat: startLat, lng: startLon},
      {lat: endLat, lng: endLon},
      polyGonRef.value, horiztonal, vertical)

  if (zigZagLine.value) {
    zigZagLine.value.setMap(null);
  }
  debugger;
  zigZagLine.value = new mapRef.value.api.Polyline({
    path: line,

    strokeColor: '#FF0000',
    strokeOpacity: 1.0,
    strokeWeight: 2
  });

  zigZagLine.value.setMap(mapRef.value.map);
});
onMounted(refresh)

async function refresh() {
  const api = await client.api(new QueryS3FileItems({id: (route.params as any)?.id}))
  if (api.succeeded) {

  }
}

interface LatLng {
  lat: number;
  lng: number;
}

function isAbove(point1: any, point2: any) {
  return point1.lat > point2.lat;
}

function generateZigZagPath(start: LatLng, end: LatLng, polygon: any, horizontalStepFeet: number, verticalStepFeet: number): LatLng[] {
  const path: LatLng[] = [start];
  let currentPoint = {...start};
  let isGoingUp = !isAbove(end, start);
  let bearing = getBearingAcrossPolygon(currentPoint, polygon);
  //&& path.length < 1000
  while (haversineDistance(currentPoint, end) > horizontalStepFeet) {
    // Recalculate bearing to the opposite side of the polygon

    console.log(`Bearing is ${bearing}`)
    // Try to move horizontally
    let nextPoint = moveHorizontally(currentPoint, bearing, horizontalStepFeet);
    console.log(`Next Point is ${nextPoint.lat},${nextPoint.lng}`)
    // Check if the next point is inside the polygon
    if (mapRef.value.api.geometry.poly.containsLocation(nextPoint, polygon)) {
      console.log(`  Point was added  ${nextPoint.lat},${nextPoint.lng}`)
      path.push(nextPoint);
      currentPoint = nextPoint;
    } else {
      bearing = invertBearingDegrees(bearing);
      console.log(`Next Point was past wall`)
      // If we've hit the edge, move vertically
      nextPoint = moveVertically(currentPoint, verticalStepFeet, isGoingUp);
      console.log(`Next Vertical Point was  ${nextPoint.lat},${nextPoint.lng}`)
      // Check if the vertical move is inside the polygon
      if (mapRef.value.api.geometry.poly.containsLocation(nextPoint, polygon)) {
        path.push(nextPoint);
        console.log(`Vertical Point was added  ${nextPoint.lat},${nextPoint.lng}`)
        currentPoint = nextPoint;

        console.log(`Bearing is ${bearing}`)
      } else {
        console.log(`No Moves Left`)
        break;
      }
    }

  }
  if (haversineDistance(currentPoint, end) > horizontalStepFeet / 3280.84) {
    // Add end point
    path.push(end);
  }
  return path;
}

function getBearingAcrossPolygon(start: LatLng, polygon: any): number {
  const bounds = new mapRef.value.api.LatLngBounds();
  polygon.getPath().forEach((point: any) => bounds.extend(point));

  // Get the easternmost and westernmost points of the polygon
  let westPoint = start;
  let eastPoint = start;

  polygon.getPath().forEach((point: any) => {
    if (point.lng < westPoint.lng) westPoint = point;
    if (point.lng > eastPoint.lng) eastPoint = point;
  });

  // Determine which point (east or west) is farther from the start point
  const distanceToWest = haversineDistance(start, westPoint);
  const distanceToEast = haversineDistance(start, eastPoint);

  // Choose the farther point and calculate the bearing
  const targetPoint = distanceToWest > distanceToEast ? westPoint : eastPoint;
  let bearing = getBearing(start, targetPoint);

  // Normalize the bearing to either 90 (east) or 270 (west)
  bearing = bearing > 180 ? 270 : 90;

  return bearing;
}

function moveHorizontally(start: LatLng, bearing: number, distanceFeet: number): LatLng {
  return destinationPoint(start, bearing, distanceFeet);
}

function moveVertically(start: LatLng, distanceFeet: number, isNorth: boolean): LatLng {
  const bearing = !isNorth ? 0 : 180;
  return destinationPoint(start, bearing, distanceFeet);
}

function moveDiagonally(start: LatLng, bearing: number, horizontalFeet: number, verticalFeet: number, isNorth: boolean): LatLng {
  const horizontalComponent = destinationPoint(start, bearing, horizontalFeet);
  const verticalBearing = isNorth ? 0 : 180;
  return destinationPoint(horizontalComponent, verticalBearing, verticalFeet);
}

function invertBearingDegrees(bearing) {
  let invertedBearing = bearing + 180;
  if (invertedBearing >= 360) {
    invertedBearing -= 360;
  }
  return invertedBearing;
}

function calculateNewLatLng(lat, lng, bearing, distanceInFeet) {
  const R = 3958.8; // Earth Radius in Miles
  const distanceInMiles = distanceInFeet / 5280; // Convert distance to miles
  const bearingRad = bearing * Math.PI / 180; // Convert bearing to radians
  const latRad = lat * Math.PI / 180; // Convert latitude to radians
  const lonRad = lng * Math.PI / 180; // Convert longitude to radians

  const lat2 = Math.asin(Math.sin(latRad) * Math.cos(distanceInMiles / R) +
      Math.cos(latRad) * Math.sin(distanceInMiles / R) * Math.cos(bearingRad));

  const lon2 = lonRad + Math.atan2(Math.sin(bearingRad) * Math.sin(distanceInMiles / R) * Math.cos(latRad),
      Math.cos(distanceInMiles / R) - Math.sin(latRad) * Math.sin(lat2));

  return {
    lat: lat2 * 180 / Math.PI,
    lng: lon2 * 180 / Math.PI,
  }
}

function destinationPoint(start: LatLng, bearing: number, distanceFeet: number): LatLng {
  return calculateNewLatLng(start.lat, start.lng, bearing, distanceFeet);
  const R = 20925721; // Earth radius in feet
  const d = distanceFeet / R;
  const lat1 = toRadians(start.lat);
  const lon1 = toRadians(start.lng);
  const brng = toRadians(bearing);

  const lat2 = Math.asin(Math.sin(lat1) * Math.cos(d) +
      Math.cos(lat1) * Math.sin(d) * Math.cos(brng));
  const lon2 = lon1 + Math.atan2(Math.sin(brng) * Math.sin(d) * Math.cos(lat1),
      Math.cos(d) - Math.sin(lat1) * Math.sin(lat2));

  return {lat: toDegrees(lat2), lng: toDegrees(lon2)};
}


// Helper function to calculate bearing between two points
function getBearing(start: any, end: any) {
  const startLat = toRadians(start.lat);
  const startLng = toRadians(start.lng);
  const endLat = toRadians(end.lat);
  const endLng = toRadians(end.lng);

  const y = Math.sin(endLng - startLng) * Math.cos(endLat);
  const x = Math.cos(startLat) * Math.sin(endLat) -
      Math.sin(startLat) * Math.cos(endLat) * Math.cos(endLng - startLng);
  const bearing = (toDegrees(Math.atan2(y, x)) + 360) % 360;
  return bearing;
}


// Helper function to calculate haversine distance between two points
function haversineDistance(point1: any, point2: any) {
  const R = 20902231; // Earth radius in feet
  const dLat = toRadians(point2.lat - point1.lat);
  const dLon = toRadians(point2.lng - point1.lng);
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRadians(point1.lat)) * Math.cos(toRadians(point2.lat)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRadians(degrees: any) {
  return degrees * Math.PI / 180;
}

function toDegrees(radians: any) {
  return radians * 180 / Math.PI;
}

// Usage example
// const start = {lat: 37.7749, lng: -122.4194};
// const end = {lat: 37.7847, lng: -122.4094};
// const polygon = new mapRef.value.api.Polygon({ /* your polygon definition */});
// const horizontalStepFeet = 100; // Adjust based on your needs
// const verticalStepFeet = 50; // Adjust based on your needs
//
// const zigZagPath = generateZigZagPath(start, end, polygon, horizontalStepFeet, verticalStepFeet);
//
// // Create a polyline with the zig-zag path
// const polyline = new mapRef.value.api.Polyline({
//   path: zigZagPath,
//   geodesic: true,
//   strokeColor: '#FF0000',
//   strokeOpacity: 1.0,
//   strokeWeight: 2
// });
//
// // Add the polyline to the map
// polyline.setMap(map);
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