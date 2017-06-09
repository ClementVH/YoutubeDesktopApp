import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { IpcService } from "app/services/ipc.service";
import { SocketService } from "app/services/socket.service";
import { VideoService } from "app/services/video.service";

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AppRoutingModule
  ],
  providers: [IpcService, SocketService, VideoService],
  bootstrap: [AppComponent]
})
export class AppModule { }
