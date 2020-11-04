from fastapi import APIRouter, Request

from ..utils import get_project

service_router = APIRouter()


@service_router.post('/<name>/start')
def start_service(request: Request, name):
    get_project(request).up(service_names=[name])
    return True


@service_router.post('/<name>/stop')
def stop_service(request: Request, name):
    get_project(request).stop(service_names=[name])
    get_project(request).remove_stopped(service_names=[name])
    return True


@service_router.post('/<name>/restart')
def restart_service(request: Request, name):
    get_project(request).restart(service_names=[name])
    return True


@service_router.post('/<name>/build')
def build_service(request: Request, name):
    get_project(request).build(service_names=[name])
    return True


@service_router.post('/<name>/scale-up')
def scale_up_service(request: Request, name):
    get_project(request).up(service_names=[name], scale_override={name: 3})
    return True
