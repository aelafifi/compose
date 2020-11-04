<template>
  <v-app>
    <v-app-bar v-if="project" app color="indigo" dark>
      <v-app-bar-nav-icon></v-app-bar-nav-icon>

      <v-toolbar-title v-text="project.name"></v-toolbar-title>

      <v-spacer></v-spacer>

      <template v-for="action in wholeProjectActions">
        <IconButtonWithTooltip
            :key="action.tooltip" :icon="action.icon" :iconClass="action.iconClass" :tooltip="action.tooltip"
            @click.ctrl.exact="performRequest(project, 'runAction', action.click, undefined, true)"
            @click.exact="performRequest(project, 'runAction', action.click)"></IconButtonWithTooltip>
      </template>
    </v-app-bar>

    <v-main>
      <v-container v-if="project" style="height: 100%">
        <v-row no-gutters style="height: 100%">
          <v-col>
            <v-toolbar class="elevation-0 mt-4">
              <v-text-field v-model="search.searchText" label="Search"></v-text-field>

              <template v-if="selectedServices.length > 0">
                <span class="mx-5"></span>
                <span class="mx-3">With Selected:</span>

                <template v-for="action in wholeProjectActions">
                  <IconButtonWithTooltip
                      v-if="action.acceptsServiceNames && action.visible(project)"
                      :key="action.tooltip" :icon="action.icon" :iconClass="action.iconClass" :tooltip="action.tooltip"
                      @click.ctrl.exact="performRequest(project, 'runAction', action.click, selectedServices, true)"
                      @click.exact="performRequest(project, 'runAction', action.click, selectedServices)"></IconButtonWithTooltip>
                </template>
              </template>
            </v-toolbar>

            <v-simple-table>
              <template v-slot:default>
                <thead>
                <tr>
                  <th style="width: 1px">
                    <v-checkbox :indeterminate="isIndeterminate" :value="isAllSelected"
                                @change="selectionCahnged($event)"></v-checkbox>
                  </th>
                  <th class="text-left" colspan="2">Name</th>
                  <th class="text-left">Image</th>
                  <th class="text-left">Command</th>
                  <th class="text-left">State</th>
                  <th class="text-left">Ports</th>
                  <th></th>
                </tr>
                </thead>
                <tbody>
                <template v-for="service in project.services">
                  <tr v-if="search.matchesSearch(service.name) || search.matchingSearch(service.containers, 'name').length > 0"
                      :key="service.name">
                    <td style="width: 1px">
                      <v-checkbox v-model="selectedServices" :value="service.name"></v-checkbox>
                    </td>
                    <td colspan="2">
                      <strong>{{ service.name }}</strong>
                    </td>
                    <td class="text-right" colspan="5">
                      <template v-for="action in wholeProjectActions">
                        <IconButtonWithTooltip
                            v-if="action.acceptsServiceNames && action.visible(service)"
                            :key="action.tooltip" :icon="action.icon" :iconClass="action.iconClass" :tooltip="action.tooltip"
                            @click.ctrl.exact="performRequest(project, 'runAction', action.click, [service.name], true)"
                            @click.exact="performRequest(project, 'runAction', action.click, [service.name])"></IconButtonWithTooltip>
                      </template>
                    </td>
                  </tr>
                  <tr v-for="container in search.matchingSearch(service.containers, 'name')" :key="container.id">
                    <td colspan="2">
                      <span style="display: inline-block; width: 60px"></span>
                    </td>
                    <td>{{ container.name }}</td>
                    <td>{{ container.image }}</td>
                    <td>{{ container.human_readable_command }}</td>
                    <td>
                      {{ container.human_readable_state }}
                      <v-icon v-if="container.is_restarting">mdi-sync</v-icon>
                    </td>
                    <td>{{ container.human_readable_ports }}</td>
                    <td class="text-right">
                      <v-btn icon @click="performRequest2(container.top(), topResponse)">
                        <v-icon>mdi-format-list-bulleted-triangle</v-icon>
                      </v-btn>

                      <v-btn icon @click="performRequest2(container.logs())">
                        <v-icon>mdi-math-log</v-icon>
                      </v-btn>

                      <!--<v-menu>
                        <template v-slot:activator="{ on, attrs }">
                          <v-btn v-bind="attrs" v-on="on" icon>
                            <v-icon>mdi-menu-down</v-icon>
                          </v-btn>
                        </template>
                        <v-list>
                          <v-list-item link>Start</v-list-item>
                          <v-list-item link>Stop</v-list-item>
                          <v-list-item link>Restart</v-list-item>
                          <v-list-item link>Pause</v-list-item>
                          <v-list-item link>Unpause</v-list-item>
                          <v-list-item link>Kill</v-list-item>
                          <v-list-item link>Remove</v-list-item>
                          <v-list-item link @click="container.logs()">Logs</v-list-item>
                        </v-list>
                      </v-menu>-->
                    </td>
                  </tr>
                </template>
                </tbody>
              </template>
            </v-simple-table>

            <v-dialog v-model="topDialog" max-width="60%" scrollable>
              <v-card>
                <v-card-title>Top Results</v-card-title>
                <v-divider></v-divider>
                <v-card-text style="height: 300px">
                  <v-simple-table v-if="topData">
                    <thead>
                    <tr>
                      <th v-for="title in topData.Titles" :key="title">
                        {{ title }}
                      </th>
                    </tr>
                    </thead>
                    <thead>
                    <tr v-for="(row, i) in topData.Processes" :key="i">
                      <th v-for="(item, j) in row" :key="j">{{ item }}</th>
                    </tr>
                    </thead>
                  </v-simple-table>
                </v-card-text>
                <v-divider></v-divider>
                <v-card-actions>
                  <v-btn color="blue darken-1" text @click="topDialog = false">
                    Close
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-col>
          <!-- <v-col>
            <HelloWorld />
          </v-col> -->
        </v-row>
      </v-container>

      <v-overlay :value="isLoading">
        <v-progress-circular indeterminate size="64"></v-progress-circular>
      </v-overlay>

      <v-dialog v-model="streamOverlay.shown" max-width="60%" persistent scrollable>
        <v-card>
          <v-card-title class="headline"> Project Events</v-card-title>
          <v-card-text style="height: 60vh">
            <v-simple-table>
              <thead>
              <tr>
                <th>Service</th>
                <th>Container</th>
                <th>Action</th>
                <th>Health Status</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="(event, i) in streamOverlay.data" :key="i">
                <td>{{ event.service }}</td>
                <td>{{ event.container.name }}</td>
                <td>{{ event.action }}</td>
                <td>{{ event.container.human_readable_health_status }}</td>
              </tr>
              </tbody>
            </v-simple-table>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="red darken-1" text @click="streamOverlay.dismisser()">
              Dismiss
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-main>
  </v-app>
</template>

<script>
// import HelloWorld from "./components/HelloWorld";
import axios from "axios";
// import io from "socket.io-client";
import {Project} from "./models/project";
import {observableFromRequest} from "./models/utils";
import IconButtonWithTooltip from "./components/parts/IconButtonWithTooltip";
import {wholeProjectActions} from "./actions";
import {SearchManager} from "./search";
import {streamOverlay} from "@/stream-overlay";

function listen(url, listeners) {
  const source = new EventSource(url);
  for (let key in listeners) {
    source.addEventListener(key, listeners[key]);
  }
  return source;
}

export default {
  name: "App",

  components: {
    IconButtonWithTooltip,
  },

  data: () => ({
    isLoading: true,
    error: null,
    success: null,
    project: null,

    topDialog: false,
    topData: null,

    selectedServices: [],
    isIndeterminate: false,
    isAllSelected: false,
    search: new SearchManager(),

    streamOverlay: new streamOverlay(),

    wholeProjectActions
  }),

  mounted() {
    this.getAllData();
    const app = this;

    listen("/api/project/stream", {
      message(event) {
        const project = JSON.parse(event.data);
        app.project = new Project(project);
      },
      complete() {
      },
      error(/*error*/) {
      },
    });
  },

  methods: {
    getAllData() {
      const requester = () => axios.get("/api/project/");
      const observable = observableFromRequest(requester);
      return this.performRequest2(observable, (data) => {
        this.project = new Project(data);
      });
    },

    performRequest(object, method, ...args) {
      return this.performRequest2(object[method](...args));
    },

    performRequest2(observable, callback) {
      if (this.subscription$) {
        this.subscription$.unsubscribe();
      }

      this.isLoading = true;

      this.subscription$ = observable.subscribe(
          (response) => {
            if (callback) {
              callback(response.data);
            }
            this.success = true;
            this.isLoading = false;
          },
          (error) => {
            this.error = error;
            this.isLoading = false;
          }
      );
    },

    selectionCahnged(value) {
      if (value) {
        this.selectedServices = this.project.services
            .filter((service) => {
              return (
                  this.search.matchesSearch(service.name) ||
                  this.search.matchingSearch(service.containers).length > 0
              );
            })
            .map((s) => s.name);
      } else {
        this.selectedServices = [];
      }
    },

    hasSelection() {
      return this.selectedServices.length > 0;
    },

    selectionOrUndefined() {
      return this.hasSelection() ? this.selectedServices : undefined;
    },

    topResponse(data) {
      this.topDialog = true;
      this.topData = data;
    },

    testStream() {
      this.streamOverlay.show();
      const _app = this;
      const source = listen("/api/project/events", {
        message(event) {
          _app.streamOverlay.add(JSON.parse(event.data));
        },
        error(error) {
          console.warn(error);
          _app.streamOverlay.hide().reset();
          this.close();
        },
      });
      this.streamOverlay.dismisser = () => {
        source.close();
        this.streamOverlay.hide().reset();
      };
    },
  },

  watch: {
    selectedServices(newValue) {
      if (newValue.length == 0) {
        this.isAllSelected = false;
        this.isIndeterminate = false;
      } else if (newValue.length == this.project.services.length) {
        this.isAllSelected = true;
        this.isIndeterminate = false;
      } else {
        this.isAllSelected = false;
        this.isIndeterminate = true;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
</style>