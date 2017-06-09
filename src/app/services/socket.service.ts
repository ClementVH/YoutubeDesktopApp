import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import { VideoService } from './video.service';

import * as io from 'socket.io-client';

import 'rxjs/add/operator/toPromise'
import { IpcService } from "app/services/ipc.service";

declare var fs;
declare var ytdl;

@Injectable()

export class SocketService {

	constructor(private http: Http, private vs: VideoService, private ipc: IpcService) {}

	socket: any;

	videoId: string = 'KsiCtmzhVSI';

	connect(serverAdress: string, port: string) {
		this.socket = io(serverAdress + ':' + port);
	}

	listenVideoIdEvent(instance) {
		this.socket.on(
			'videoId',
			function(videoId: string) {
				console.log('EVENT #####!', videoId);

				ytdl.getInfo('http://www.youtube.com/watch?v=' + videoId, {downloadUrl: true}, function(err, info) {
					let format = ytdl.chooseFormat(info.formats, {});
					instance.playVideoFormUrl(format.url);
				});
			}
		);

	}

	listenVideoControlEvents() {

		let that = this;

		this.socket.on(
			'playVideo',
			() => that.vs.play()
		);

		this.socket.on(
			'pauseVideo',
			() => that.vs.pause()
		);

		this.socket.on(
			'toggleVideoState',
			() => that.vs.toggleState()
		);

		this.socket.on(
			'incrVolume',
			() => that.vs.incrVolume()
		);

		this.socket.on(
			'decrVolume',
			() => that.vs.decrVolume()
		);

		this.socket.on(
			'getVideoInfos',
			(empty, cb) => cb(that.vs.getVideoInfos())
		);

		this.socket.on(
			'setCurrentTime',
			percent => that.vs.setCurrentTime(percent)
		);

		this.socket.on(
			'toggleFullscreen',
			() => that.ipc.toggleFullscreen()
		);
	}

	listenSuggestQueryEvent() {

		this.socket.on(
			'suggestQuery',
			(query, cb) => {
				console.log('Suggest Query reveived !');
				this.http.get('http://suggestqueries.google.com/complete/search?client=firefox&ds=yt&hl=fr&q=' + query).toPromise().then(
					res => {
						console.log("Query sent", res.json());
						cb(res.json());
					},
					err => console.log(err)
				);
			}
		);

	}



}
