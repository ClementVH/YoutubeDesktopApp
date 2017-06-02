import { YoutubeDesktopAppPage } from './app.po';

describe('youtube-desktop-app App', () => {
  let page: YoutubeDesktopAppPage;

  beforeEach(() => {
    page = new YoutubeDesktopAppPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
