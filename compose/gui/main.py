from os.path import dirname, join, abspath

import uvicorn
from fastapi import FastAPI
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles

from .API.container import container_router
from .API.project import project_router
from .API.service import service_router
from ..project import Project

app = FastAPI()


@app.get('/')
def homepage():
    return HTMLResponse(open(join(abspath(dirname(__file__)), "vue-gui/dist/index.html")).read())


app.include_router(project_router, prefix="/api/project", tags=['Project'])
app.include_router(service_router, prefix="/api/services", tags=['Service'])
app.include_router(container_router, prefix="/api/containers", tags=['Container'])

app.mount("/", StaticFiles(directory=join(abspath(dirname(__file__)), "vue-gui/dist")), name="static")


def main(project_: Project, options: dict, toplevel_options: dict):
    app.state.project = project_
    app.state.toplevel_options = toplevel_options
    port = options['--port'] if options['--port'] is not None else '8787'
    uvicorn.run(app, host="127.0.0.1", port=int(port), debug=True)
