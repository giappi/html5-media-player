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

/* global Canvas, Graphics */
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
        
        this.width = 500;
        this.height = 250;
        
        this.onPlayed = function(e){};
        this.onTimeUpdated = function(e){};
        this.onPaused = function(e){};
        this.onEnded = function(e){};
        
        this.canvas = new Canvas(this.width, this.height);
        this.canvas.style.border = "1px solid #CCCCCC";
        
        this.graphics = this.canvas.getGraphics();
        
        //this.paint.arguments = [this.graphics];
        setInterval(this.paint.bind(this), 100, this.graphics);
        setInterval(this.update.bind(this), 100);
        
        this.progressBar = new ProgressBar(400, 10);
        
        this.canvas.onmousedown = (function(e)
        {
            var x = this.getMousePoint(e).x;
            var y = this.getMousePoint(e).y;
            console.log(`OnMouseDown(${x}, ${y})`);
            this.onMouseDown(x, y);
        }).bind(this);
        
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
    
    placeOn(html_id)
    {
        var parent = document.getElementById(html_id);
        if(parent)
        {
            parent.appendChild(this.canvas);
        }
    }
    
    update()
    {
        this.progressBar.percent = this.audio.currentTime/this.audio.duration;
    }
    
    paint(g)
    {
        g.drawRect(0, 0, this.canvas.width, this.canvas.height);
        this.progressBar.paint(g);
    }
    
    

    getMousePoint(e)
    {
        e = e || window.event;
        var elementRect = this.canvas.getBoundingClientRect();
        return { "x" : e.clientX - elementRect.left, "y" : e.clientY - elementRect.top };
    }
    
    
    
    onMouseDown(x, y)
    {
        if(this.progressBar.isInside(x, y))
        {
            //update playing time
            var percent = (x - this.progressBar.x)/this.progressBar.width;
            //this.progressBar.onMouseDown(x - this.progressBar.x, y - this.progressBar.y);
            var newCurrentTime = percent * this.audio.duration
            this.audio.currentTime = newCurrentTime;
        }
        
    }


    
    
}


class ProgressBar
{
    constructor(width, height)
    {
        this.x = 0;
        this.y = 0;
        this.width = width;
        this.height = height;
        this.percent = 0;
    }
    
    paint(g)
    {
        g.setColor("#FFFFFF");
        g.fillRect(this.x, this.y, this.width, this.height);
        g.setColor("#FF0000");
        g.drawRect(this.x, this.y, this.width, this.height);
        g.setColor("#FF0000");
        g.fillRect(this.x, this.y, this.percent * this.width, this.height);
    }
    
    isInside(x, y)
    {
        return x >= this.x && x < this.x + this.width && y >= this.y && y < this.y + this.height;
    }
    
    
    onMouseDown(x, y)
    {
        //this.percent = x/this.width;
    }
}

