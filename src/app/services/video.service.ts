import { Injectable, ViewChild, ElementRef, Renderer } from '@angular/core';

@Injectable()
export class VideoService {

	video: ElementRef;

	url: string;

	constructor(private renderer: Renderer) { }

	setVideo(video) {
		this.video = video;
	}

	getVideo() {
		return this.video.nativeElement;
	}

	playVideoFormUrl(url: string) {

		this.url = url;

		this.renderer.setElementAttribute(this.getVideo(), 'src', this.url);

		this.play();

	}

	getVideoInfos() {

		let res = {
			state: this.getState(),
			volume: this.getVolume(),
			duration: this.getDuration(),
			currentTime: this.getCurrentTime(),
		};

		return res;

	}

	getState() {
		if(this.getVideo().paused)
			return 'pausing';
		else
			return 'playing';
	}

	play() {
		this.getVideo().play();
	}

	pause() {
		this.getVideo().pause();
	}

	toggleState() {
		if (this.getVideo().paused)
			this.play();
		else
			this.pause();
	}

	getCurrentTime() {
		return this.getVideo().currentTime;
	}

	getDuration() {
		return this.getVideo().duration;
	}

	getVolume() {
		return this.getVideo().volume;
	}

	incrVolume() {
		if (this.getVolume() <= 0.9)
			this.getVideo().volume += 0.1;
	}

	decrVolume() {
		if (this.getVolume() >= 0.1)
			this.getVideo().volume -= 0.1;
	}

	setCurrentTime(percent: number) {
		this.getVideo().currentTime = this.getDuration() * (percent / 100);
	}

}