function Canvas(id)
{
    var canvas = null;
    
    if(arguments.length === 1)
    {
        canvas = document.getElementById(id);
    }
    else
    {
        canvas = document.createElement('canvas');
        canvas.width = arguments[0];
        canvas.height = arguments[1];
    }
    
    canvas.getGraphics = function()
    {
        return new Graphics(this);
    };
    
    var ctx = canvas.getContext("2d");
    canvas.getContext = function()
    {
        return ctx;
    };

    canvas.getWidth = function()
    {
        return canvas.width;
    };
    canvas.getHeight = function()
    {
        return canvas.height;
    };
    
    canvas.getRandomColor = function()
    {
        return "#"+((1<<24)*Math.random()|0).toString(16);
    };
    
    return canvas;

}

/*
 beginPath: Create a new path
 strokeStyle: set color for path
 save: save current setting ( color, style, ...)
 restore: restore to last saved setting
 translate: dịch chuyển đối tượng vẽ đi một đoaạn nào đó
*/


function Graphics(c)
{

    var g = c.getContext();

    this.textAlign = 'center';

    this.setColor = function(c)
    {
        g.fillStyle = c;
        g.strokeStyle = c;
    };

    this.getColor = function()
    {
        return g.strokeStyle;
    };

    this.drawRect = function(x, y, w, h)
    {
        g.beginPath();
        g.rect(x, y, w, h);
        g.closePath();
        //g.lineWidth = 1;
        g.stroke();
    };



    this.drawImage = function(img, x, y)
    {
        g.drawImage(img, x, y);
    };


    //Cut a part of source image and paste it on canvas

    this.cropImage = function(img, x, y, w, h, dx, dy, dw, dh)
    {
        g.drawImage(img, x, y, w, h, dx, dy, dw, dh);

    };



    // return Image[]
    /*
     
     var sources =
     {
     a: 'http://www.html5canvastutorials.com/demos/assets/darth-vader.jpg',
     b: 'http://www.html5canvastutorials.com/demos/assets/yoda.jpg'
     };
     callback(Image)
     loadImages(sources, function(images)
     {
     g.drawImage(images.a, 100, 30, 200, 137);
     g.drawImage(images.b, 350, 55, 93, 104);
     });
     
     */




    this.fillRect = function(x, y, w, h)
    {
        g.fillRect(x, y, w, h);
    };


    this.drawLine = function(x1, y1, x2, y2)
    {

        g.beginPath();
        g.moveTo(x1, y1);
        g.lineTo(x2, y2);
        g.closePath();
        g.stroke();
    };

    this.setLineWidth = function(w)
    {
        g.lineWidth = w;
    };

    this.drawCircle = function(x1, y1, radius)
    {
        g.beginPath();
        g.arc(x1 + radius, y1 + radius, radius, 0, 2 * Math.PI, false);
        g.closePath();
        g.stroke();
    };

    this.fillCircle = function(x1, y1, radius)
    {
        g.beginPath();
        g.arc(x1 + radius, y1 + radius, radius, 0, 2 * Math.PI, false);
        g.closePath();
        g.fill();

    };

    this.drawEllipse = function(x, y, w, h)
    {
        this.drawArc(x, y, w, h, 0, 2 * Math.PI);
    };
    this.fillEllipse = function(x, y, w, h)
    {
        this.fillArc(x, y, w, h, 0, 2 * Math.PI);
    };
    this.drawOval = function(x, y, w, h)
    {
        this.drawEllipse(x, y, w, h);
    };
    this.fillOval = function(x, y, w, h)
    {
        this.fillEllipse(x, y, w, h);
    };

    this.drawArc = function(x, y, w, h, angle_start, angle_end)
    {
        var radius = 0;
        var scale = 1.0;

        radius = w / 2;
        scale = h / w;


        // Lưu lại trạng thái mặc định trước khi scale
        g.save();

        g.beginPath();
        // Thay đổi trạng thái
        g.scale(1, scale);
        g.arc(x + radius, y + radius, radius, angle_start, angle_end, false);
        g.closePath();
        //Trở lại trạng thái ban đầu
        g.restore(); // disable scale(2, 1) and return to scale(1, 1)
        //g.strokeStyle = "#00ff00";

        g.stroke();

    };

    this.fillArc = function(x, y, w, h, angle_start, angle_end)
    {
        // Draw Arc
        this.drawArc(x, y, w, h, angle_start, angle_end);
        //And fill it
        g.fill();
    };



    this.drawString = function(string, x, y, font, align)
    {
        align = align || 'left';
        font = font || "10pt Arial";

        g.textBaseline = "top";
        g.textAlign = align;
        g.font = font;
        g.fillText(string, x, y);
    };

    this.getFontWidth = function(text)
    {
        var metrics = context.measureText(text);
        var width = metrics.width;
        return width;
    };

    this.strokeText = function(string, x, y)
    {
        g.strokeText(string, x, y);
    };

    this.clearRect = function(x, y, w, h)
    {
        g.clearRect(x, y, w, h);
    };



    this.copy = function(x, y, w, h)
    {
        return g.getImageData(x, y, w, h);
    };

    this.paste = function(imgData, x, y)
    {
        g.putImageData(imgData, x, y);
    };

    this.copyArea = function(x, y, w, h, dx, dy)
    {
        g.putImageData(g.getImageData(x, y, w, h), dx, dy);
    };

    this.startClipRect = function(x, y, w, h)
    {
        g.save();
        g.beginPath();
        g.rect(x, y, w, h);
        g.clip();
        g.closePath();

    };
    this.stopClipRect = function()
    {
        g.restore();
    };
    
    this.paint = function(){};
    
    /* Paint on Rect*/
    this.repaint = function(x, y, w, h)
    {
        
        var padding = 1;
        this.clearRect(x - padding, y - padding, w + 2*padding, h + 2*padding);
        this.startClipRect(x - padding, y - padding, w + 2*padding, h + 2*padding);
        
        this.paint();
        
        this.stopClipRect();
        
    };
    
    this.setAlpha = function(value)
    {
        g.globalAlpha = value;
    };



}
    Graphics.loadImages = function(sources, callback)
    {
        var images = {};
        var loadedImages = 0;
        var numImages = 0;

        // get num of sources
        var src;
        for (src in sources)
        {
            numImages++;
        }
        for (src in sources)
        {
            images[src] = new Image();
            images[src].onload = function()
            {
                if (++loadedImages >= numImages)
                {
                    callback(images);
                }
            };
            images[src].src = sources[src];
        }
    };


function Frames(w, h)
{
    this.fw = w;
    this.fh = h;
    this.len = 0;


    this.frame = [];

    this.add = function(x, y)
    {
        this.frame[this.len] = {'x': x, 'y': y};
        this.len++;
    };
}

function Sprite(rows, cols, width, height, vertical)
{
    vertical = vertical || false;
    this.fw = width / cols;
    this.fh = height / rows;
    this.frameBegin = 1;
    this.frameEnd = cols * rows;

    this.getFrame = function(f)
    {
        var x = 0;
        var y = 0;

        if (vertical)
        {
            x = Math.ceil(f / rows);
            y = (f - Math.floor(f / rows) * rows);
            //Use "===" to compare with 0
            if (y === 0)
                y = rows;
        }
        else
        {
            y = Math.ceil(f / cols);
            x = (f - Math.floor(f / cols) * cols);
            //Use "===" to compare with 0
            if (x === 0)
                x = cols;
        }

        x--;
        y--;

        return [x * this.fw, y * this.fh];


    };

    this.toFrames = function()
    {
        var frm = new Frames(this.fw, this.fh);

        for (var i = 0; i < this.frameEnd - this.frameBegin + 1; i++)
        {
            frm.add(this.getFrame(i + 1)[0], this.getFrame(i + 1)[1]);
        }
        //alert(frm.frame[0].x);
        return frm;
    };

}






function Animate(img, sprite, time, x, y)
{
    return new FrameAnimate(img, sprite.toFrames(), time, x, y);
}


function FrameAnimate(img, frames, time, x, y)
{
    var w = 0;
    var h = 0;
    this.x = x;
    this.y = y;
    var frame = 0;
    var animate = this;
    w = frames.fw;
    h = frames.fh;
    this.showFrameCount = false;
    this.showFrameBorder = true;
    this.g = null;
    var bground;
    var n_padding = 2;

    this.setGraphics = function(g)
    {
       this.g = g; 
       bground = this.g.copy(this.x, this.y, w, h);
    };
    this.paint = function()
    {
        this.g.paste(bground, this.x, this.y, w, h);
        this.g.cropImage(img, frames.frame[frame].x, frames.frame[frame].y, w, h, this.x, this.y, w, h);
        if (this.showFrameCount)
        {
            this.g.drawString(frame, this.x + n_padding, this.y + n_padding);
        }
        if (this.showFrameBorder)
        {
            this.g.drawRect(this.x, this.y, w, h);
        }
    };
    this.repaint = function()
    {
        this.g.startClipRect(this.x, this.y, w, h);
        this.g.clearRect(this.x, this.y, w, h);
        this.paint();
        this.g.stopClipRect();
    };

    this.loop = function()
    {
        //alert(frames.len);
        if (frame > frames.len - 1)
        {
            frame = 0;
        }

        animate.repaint();
        frame++;
    };


    var engine;
    this.play = function()
    {
        engine = setInterval(animate.loop, time);
    };
    this.stop = function()
    {
        clearInterval(engine);
    };
}