<template>
  <v-container style="height: 100%">
    <div class="scroll-wrapper">
      <div class="scroll-panel">
        <h1>Docker-Compose GUI</h1>

        <div v-if="isLoading">
          <v-overlay>
            <v-progress-circular
              indeterminate
              color="primary"
              :size="80"
            ></v-progress-circular>
          </v-overlay>
        </div>

        <div v-else-if="error">
          <v-banner elevation="2">
            {{ error }}
          </v-banner>
        </div>

        <div v-else style="width: 500px">
          <div class="item">
            {{ project.name }}

            <div class="float-right">
              <v-btn icon color="green" @click="startProject()">
                <v-icon>mdi-play</v-icon>
              </v-btn>
              <v-btn icon color="red" @click="stopProject()">
                <v-icon>mdi-stop</v-icon>
              </v-btn>
              <v-btn icon color="orange">
                <v-icon>mdi-refresh</v-icon>
              </v-btn>
              <v-btn icon color="blue">
                <v-icon>mdi-cog-outline</v-icon>
              </v-btn>
            </div>
          </div>

          <div>
            <div v-for="service in project.services" :key="service.name">
              <div class="item sub">
                {{ service.name }}

                <div class="float-right">
                  <v-btn icon color="green" @click="startService(service.name)">
                    <v-icon>mdi-play</v-icon>
                  </v-btn>
                  <v-btn icon color="red" @click="stopService(service.name)">
                    <v-icon>mdi-stop</v-icon>
                  </v-btn>
                  <v-btn
                    icon
                    color="orange"
                    @click="restartService(service.name)"
                  >
                    <v-icon>mdi-refresh</v-icon>
                  </v-btn>
                  <v-btn icon color="blue" @click="buildService(service.name)">
                    <v-icon>mdi-cog-outline</v-icon>
                  </v-btn>
                </div>
              </div>

              <div v-for="container in service.containers" :key="container.id">
                <div class="item sub-sub">
                  {{ container.name }}

                  <pre>{{ container }}</pre>

                  <div class="float-right">
                    <v-btn
                      icon
                      color="red"
                      @click="stopContainer(container.id)"
                    >
                      <v-icon>mdi-stop</v-icon>
                    </v-btn>
                    <v-btn
                      icon
                      color="orange"
                      @click="restartContainer(container.id)"
                    >
                      <v-icon>mdi-refresh</v-icon>
                    </v-btn>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </v-container>
</template>

<script>
import axios from "axios";
export default {
  name: "HelloWorld",

  data: () => ({
    isLoading: true,
    error: null,
    project: null,
  }),

  mounted() {
    this.getAllData();
  },

  methods: {
    getAllData() {
      this.isLoading = true;
      axios.get("/api/project").then(
        (response) => {
          this.project = response.data;
          this.isLoading = false;
        },
        (error) => {
          this.error = error;
          this.isLoading = false;
        }
      );
    },

    startProject() {
      this.isLoading = true;
      axios.post("/api/project/start").then(
        () => {
          this.isLoading = false;
          this.getAllData();
        },
        (error) => {
          this.isLoading = false;
          this.error = error;
        }
      );
    },

    stopProject() {
      this.isLoading = true;
      axios.post("/api/project/stop").then(
        () => {
          this.isLoading = false;
          this.getAllData();
        },
        (error) => {
          this.isLoading = false;
          this.error = error;
        }
      );
    },

    startService(name) {
      this.isLoading = true;
      axios.post("/api/service/" + name + "/start").then(
        () => {
          this.isLoading = false;
          this.getAllData();
        },
        (error) => {
          this.isLoading = false;
          this.error = error;
        }
      );
    },

    stopService(name) {
      this.isLoading = true;
      axios.post("/api/service/" + name + "/stop").then(
        () => {
          this.isLoading = false;
          this.getAllData();
        },
        (error) => {
          this.isLoading = false;
          this.error = error;
        }
      );
    },

    restartService(name) {
      this.isLoading = true;
      axios.post("/api/service/" + name + "/restart").then(
        () => {
          this.isLoading = false;
          this.getAllData();
        },
        (error) => {
          this.isLoading = false;
          this.error = error;
        }
      );
    },

    buildService(name) {
      this.isLoading = true;
      axios.post("/api/service/" + name + "/build").then(
        () => {
          this.isLoading = false;
          this.getAllData();
        },
        (error) => {
          this.isLoading = false;
          this.error = error;
        }
      );
    },

    stopContainer(name) {
      this.isLoading = true;
      axios.post("/api/container/" + name + "/stop").then(
        () => {
          this.isLoading = false;
          this.getAllData();
        },
        (error) => {
          this.isLoading = false;
          this.error = error;
        }
      );
    },

    restartContainer(name) {
      this.isLoading = true;
      axios.post("/api/container/" + name + "/restart").then(
        () => {
          this.isLoading = false;
          this.getAllData();
        },
        (error) => {
          this.isLoading = false;
          this.error = error;
        }
      );
    },
  },
};
</script>

<style lang="scss" scoped>
.scroll-wrapper {
  width: 100%;
  height: 100%;
  position: relative;

  .scroll-panel {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    overflow: auto;
  }
}

.item {
  padding: 16px 24px;
  font-size: 16px;
  line-height: 16px;

  &.sub {
    margin-left: 24px;
  }

  &.sub-sub {
    margin-left: 48px;
  }

  .v-btn {
    margin-top: -10px;
  }
}
</style>