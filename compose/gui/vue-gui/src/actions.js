export const wholeProjectActions = [
    {acceptsServiceNames: true, icon: "mdi-wrench", tooltip: "Build", click: 'build'},
    {acceptsServiceNames: true, icon: "mdi-arrow-up-bold", tooltip: "Up", click: 'up'},
    {acceptsServiceNames: false, icon: "mdi-arrow-down-bold", tooltip: "Down", click: 'down'},
    {acceptsServiceNames: true, icon: "mdi-pause", tooltip: "Pause", click: 'pause'},
    {acceptsServiceNames: true, icon: "mdi-play-pause", tooltip: "Unpause", click: 'unpause'},
    {acceptsServiceNames: true, icon: "mdi-play", tooltip: "Start", click: 'start'},
    {acceptsServiceNames: true, icon: "mdi-stop", tooltip: "Stop", click: 'stop'},
    {acceptsServiceNames: true, icon: "mdi-restart", tooltip: "Restart", click: 'restart'},
    {acceptsServiceNames: true, icon: "mdi-download", tooltip: "Pull", click: 'pull'},
    {acceptsServiceNames: true, icon: "mdi-close-octagon", tooltip: "Kill", click: 'kill'},
    {acceptsServiceNames: true, icon: "mdi-delete", tooltip: "Remove", click: 'rm'},

    {acceptsServiceNames: true, icon: "mdi-delete-1", tooltip: "Stop and Remove", click: 'stop-rm'},
    {acceptsServiceNames: true, icon: "mdi-delete-2", tooltip: "Kill and Remove", click: 'kill-rm'},
    {acceptsServiceNames: true, icon: "mdi-delete-3", tooltip: "Build and Restart", click: 'build-restart'},
    {acceptsServiceNames: true, icon: "mdi-delete-4", tooltip: "Build and Up", click: 'build-up'},
];
