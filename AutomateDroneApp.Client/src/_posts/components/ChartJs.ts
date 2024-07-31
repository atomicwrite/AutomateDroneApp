import { ref, onMounted, defineComponent, h } from "vue"
import { addScript } from "@servicestack/client"

const loadJs = addScript('https://cdn.jsdelivr.net/npm/chart.js/dist/chart.umd.min.js')

declare var Chart:any

export default defineComponent({
    props:['type','data','options'],
    setup(props) {
        const chart = ref()
        onMounted(async () => {
            await loadJs

            const options = props.options || {
                responsive: true,
                legend: {
                    position: "top"
                }
            }
            new Chart(chart.value, {
                type: props.type || "bar",
                data: props.data,
                options,
            })

        })
        //<div><canvas ref="chart"></canvas></div>
        return () => h('div', {}, [h('canvas', { ref: chart })])
    }
})