"use strict";

class Song
{
    constructor(url, title, author, cover)
    {
        this.url = url;
        this.title = title;
        this.author = author;
        this.cover = cover;
    }
}


class MusicPlayer
{
    constructor()
    {
        this.playlist = [];
        this.song = null;
        this.currentSongIndex = -1;
        this.volume = 1;
        this.muted = false;
        this.autoPlay = true;
        this.audio = document.createElement("audio");
        
        this.onPlayed = function(e){};
        this.onTimeUpdated = function(e){};
        this.onPaused = function(e){};
        this.onEnded = function(e){};
    }
    
    /**
     * Play current song
     *
     */
    play()
    {
        this.audio.play();
    }
    /**
     * Pause current playing song
     */
    pause()
    {
        this.audio.pause();
    }
    
    playSongAt(index)
    {
        this.setSongIndex(index);
        this.play();
    }
    
    stop()
    {
        if(this.song)
        {
            this.audio.stop();
        }
    }
    
    setPlayList(playlist)
    {
        this.playlist = playlist;
    }
    
    setSongIndex(index)
    {
        if(index > -1 && index < this.playlist.length)
        {
            this.song = this.playlist[index];
            this.audio.src = this.song.url;
            this.currentSongIndex = index;
            
        }
        else
        {
            throw new RangeError("Song index is out of playlist: " + index + " is not in range [0, " + this.playlist.length + "].");
        }
    }
    
    getVolume()
    {
        return Math.round(this.audio.volume*10);
    }
    setVolume(volume)
    {
        if(volume >= 0 && volume <= 10)
        {
            this.volume = volume;
            this.audio.volume = volume/10;
            return this.audio.volume; 
        }
        else
        {
            throw new RangeError("Volume is out of range: " + volume + " is not in range [0, 10].");
        }
    }
    
    getTimeString()
    {
        var seconds = Math.floor(this.audio.currentTime);
        var minutes = Math.floor(seconds/60);
        if(minutes < 10)
        {
            minutes = "0" + minutes;
        }
        var seconds_m = seconds - minutes*60;
        if(seconds_m < 10)
        {
            seconds_m = "0" + seconds_m;
        }
        return minutes + ":" + seconds_m;
    }
    
    
}