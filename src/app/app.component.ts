import { Component, AfterViewInit, OnInit, ViewChild, Renderer, ElementRef, NgZone, HostListener } from '@angular/core';
import * as io from 'socket.io-client';
import { SocketService } from "app/services/socket.service";
import { VideoService } from "app/services/video.service";
import { IpcService } from "app/services/ipc.service";

declare var fs;
declare var ytdl;

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css'],
	providers: [ SocketService, VideoService ]
})
export class AppComponent  implements AfterViewInit, OnInit{

	@ViewChild('video') video: ElementRef;

	constructor(private socketIOService: SocketService,
				private renderer: Renderer,
				private vs: VideoService,
				private ngZone: NgZone,
				private ipc: IpcService
				) {}

	ngOnInit() {

		this.vs.setVideo(this.video);

		let that = this;

		ytdl.getInfo('http://www.youtube.com/watch?v=' + "dsU8umNhXd4", {downloadUrl: true}, function(err, info) {
			let format = ytdl.chooseFormat(info.formats, {});
			that.playVideoFormUrl(format.url);
		});

		window.onresize = (e) =>
		{
			this.ngZone.run(() => {
				var vid = document.getElementsByTagName('video')[0];
				let w: any = window.innerWidth;
				let h: any = window.innerHeight;

				if (w/16 >= h/9) {
					vid.setAttribute('width', w);
					vid.setAttribute('height', 'auto');
				} else {
					vid.setAttribute('width', 'auto');
					vid.setAttribute('height', h);
				}
			});
		};

		this.ipc.registerEvent('ytd-pause', () => {
			console.log("HHHHHEEEELLLLOOOO");
			this.vs.pause();
		});
	}

	ngAfterViewInit() {
		//this.socketIOService.connect('http://youdesk.herokuapp.com', '')
		this.socketIOService.connect('http://localhost', '3000')

		this.socketIOService.listenVideoIdEvent(this);

		this.socketIOService.listenSuggestQueryEvent();

		this.socketIOService.listenVideoControlEvents();
	}

	@HostListener('document:keyup', ['$event'])
	handleKeyboardEvent(event: KeyboardEvent) {
		let x = event.keyCode;
		if (x === 27)
			this.ipc.unSetfullscreen();
	}

	playVideoFormUrl(url: string) {
		this.vs.playVideoFormUrl(url);
	}
}
