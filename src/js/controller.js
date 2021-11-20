class Song {
  constructor(artist, title, src) {
    this.artist = artist;
    this.title = title;
    this.imgSrc = `./img/${src}.jpg`;
    this.audioSrc = `./sounds/${title}.mp3`;
  }
}
class App {
  audioEl = document.querySelector("#main--audio");
  play = document.querySelector(".pause--play");
  prevSong = document.querySelector(".prev--song");
  nextSong = document.querySelector(".next--song");
  progressBar = document.querySelector(".song--progress");
  currentTime = document.querySelector(".current--time");
  endTime = document.querySelector(".end--time");
  songTitle = document.querySelector(".song--title");
  songArtist = document.querySelector(".song--artist");
  songCover = document.querySelector("#song--cover");
  volumeUp = document.getElementById("volume-up-btn");
  volumeDown = document.getElementById("volume-down-btn");
  volumePercentage = document.getElementById("volume-percentage");
  constructor() {
    this.reset();
    this.updateVolumeDOM(this.audioEl.volume);
    this.audioEl.addEventListener("load", this.audioLoad);
    this.audioEl.addEventListener(
      "timeupdate",
      this.handleUpdateTime.bind(this)
    );
    this.progressBar.parentElement.addEventListener(
      "click",
      this.setProgress.bind(this)
    );
    this.play.addEventListener("click", this.playPauseEvent.bind(this));
    this.audioEl.addEventListener("ended", this.handleEnded.bind(this));
    this.nextSong.addEventListener("click", this.handleNext.bind(this));
    this.prevSong.addEventListener("click", this.handlePrev.bind(this));
    addEventListener("keypress", this.handleSpacePress.bind(this));
    this.volumeUp.addEventListener("click", this.handleVolumeUp.bind(this));
    this.volumeDown.addEventListener("click", this.handleVolumeDown.bind(this));
  }
  audioLoad(e) {
    print(e.target.volume);
  }
  handleVolumeUp(e) {
    if (this.audioEl.volume === 1) return;
    this.audioEl.volume = parseFloat(this.audioEl.volume + 0.1).toFixed(1);
    this.updateVolumeDOM(this.audioEl.volume);
  }
  handleVolumeDown(e) {
    if (this.audioEl.volume === 0) return;

    this.audioEl.volume = parseFloat(this.audioEl.volume - 0.1).toFixed(1);
    this.updateVolumeDOM(this.audioEl.volume);
  }
  updateVolumeDOM(volume) {
    const volumeAsPercentage = Math.floor(volume * 100);
    this.volumePercentage.textContent = `${volumeAsPercentage}%`;
  }
  handleSpacePress(e) {
    e.preventDefault();
    if (!e.code.toLowerCase() === "space") return;
    if (this.play.id === "play") {
      this.audioEl.play();
      this.play.id = "pause";
    } else {
      this.audioEl.pause();
      this.play.id = "play";
    }
    this.setPlayOrPause(this.play.id);
  }
  handleNext(e) {
    const { currentSongIndex } = state.config;
    const maxSongs = state.songs.length - 1;
    if (currentSongIndex === maxSongs) state.config.currentSongIndex = 0;
    else state.config.currentSongIndex++;

    this.setSrc();
    this.updateDOM();
    this.audioEl.play();
    e.target.blur();
  }
  handlePrev(e) {
    if (this.audioEl.currentTime >= 5) {
      this.audioEl.currentTime = 0;
      this.audioEl.play();
      return;
    }
    const { currentSongIndex } = state.config;
    const maxSongs = state.songs.length - 1;
    if (currentSongIndex - 1 < 0) state.config.currentSongIndex = maxSongs;
    else state.config.currentSongIndex--;
    this.setSrc();
    this.updateDOM();
    this.audioEl.play();
    e.target.blur();
  }
  setPlayOrPause(type) {
    this.play.id = type;
    this.play.innerHTML = `<i class="fas fa-${type}"></i>`;
  }
  updateDOM() {
    const { imgSrc, title, artist } =
      state.songs[state.config.currentSongIndex];

    this.songCover.src = imgSrc;
    this.songCover.alt = artist;
    this.songTitle.textContent = title;
    this.songArtist.textContent = artist;
    this.setPlayOrPause("pause");
  }
  handleEnded() {
    this.handleNext();
  }

  handleUpdateTime(e) {
    const { duration, currentTime } = e.srcElement;
    if (currentTime === 0) return;
    const barPercent = +((currentTime / duration) * 100).toFixed(2);
    this.progressBar.style.width = `${barPercent}%`;

    // Current Time
    const currentTimeMinutes = Math.floor(currentTime / 60);
    const currentTimeSeconds = Math.floor(currentTime % 60);
    this.currentTime.textContent = `${currentTimeMinutes}:${(
      currentTimeSeconds + ""
    ).padStart(2, 0)}`;
    // End Time
    const durationMinutes = Math.floor(duration / 60);
    const durationSeconds = Math.floor(duration % 60);
    this.endTime.textContent = `${durationMinutes}:${(
      durationSeconds + ""
    ).padStart(2, 0)}`;
  }
  setProgress(e) {
    const width = e.target.clientWidth;
    const clickX = e.offsetX;
    const duration = this.audioEl.duration;

    this.audioEl.currentTime = (clickX / width) * duration;
    // this.progressBar.style.width = `${this.audioEl.currentTime}%`;
  }
  reset() {
    this.progressBar.style.width = `0%`;
    this.currentTime.textContent = `0:00`;
    this.endTime.textContent = `0:00`;
    this.setSrc();
  }

  setSrc() {
    this.audioEl.src = state.songs[state.config.currentSongIndex].audioSrc;
    state.playing = state.songs[state.config.currentSongIndex];
  }
  playPauseEvent(e) {
    const CT = e.currentTarget;
    if (CT.id === "play") {
      this.audioEl.play();
      CT.id = "pause";
    } else {
      this.audioEl.pause();
      CT.id = "play";
    }
    CT.innerHTML = `<i class="fas fa-${CT.id}"></i>`;
  }
}
const state = {
  playing: {},
  songs: [
    new Song("Charlie Puth", "up all night", "charlie-puth"),
    new Song(
      "Wiz Khalifa, Charlie Puth",
      "see you again",
      "wiz-khalifa-charlie-puth"
    ),
    new Song("The Chainsmokers", "don't let me down", "the-chainsmokers"),
  ],
  config: {
    currentSongIndex: 0,
  },
};
state.playing = state.songs[0];

const app = new App();
