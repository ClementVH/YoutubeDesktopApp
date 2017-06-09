import { Injectable } from '@angular/core';

const electron: any = (<any> window).require("electron");

@Injectable()
export class IpcService {

  constructor() { }

  registerEvent(event: string, cb: Function) {
    electron.ipcRenderer.on(event, cb);
  }

  setfullscreen() {
			electron.ipcRenderer.send('ytd-fullscreen');
  }

  unSetfullscreen() {
			electron.ipcRenderer.send('ytd-unfullscreen');
  }

  toggleFullscreen() {
			electron.ipcRenderer.send('ytd-toggle-fullscreen');
  }

}
