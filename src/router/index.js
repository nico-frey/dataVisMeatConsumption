import { createRouter, createWebHistory } from "vue-router"
import Home from "../views/Home.vue"
import SwissEmission from "../views/SwissEmission.vue"

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/swiss-emission",
    name: "SwissEmission",
    component: SwissEmission,
    props: true,
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
