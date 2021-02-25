
class Slideshow {

    constructor() {
        this.reset()
    }

    reset() {
        this.stopSlideshow();
        this.initSlides();
        this.initSlideshow();
    }

    // Set a `data-slide` index on each slide for easier slide control.
    initSlides() {
        this.container = $('[data-slideshow]');
        this.slides = this.container.find('img');
        this.slides.each((idx, slide) => $(slide).attr('data-slide', idx));
    }

    // Pseudo-preload images so the slideshow doesn't start before all the images
    // are available.
    initSlideshow() {
        this.imagesLoaded = 0;
        this.currentIndex = 0;
        this.setNextSlide();
        this.slides.each((idx, slide) => {
            $('<img>').on('load', $.proxy(this.loadImage, this)).attr('src', $(slide).attr('src'));
        });

    }

    // When one image has loaded, check to see if all images have loaded, and if
    // so, start the slideshow.
    loadImage() {
        this.imagesLoaded++;
        if (this.imagesLoaded >= this.slides.length) {
            this.playSlideshow()
        }
    }

    // Start the slideshow.
    playSlideshow() {
        this.stopSlideshow()
        if (this.slides.length >= 2) {
            this.intervalID = window.setInterval(() => {
                this.performSlide()
            }, 10000);
        }
    }

    stopSlideshow() {
        window.clearInterval(this.intervalID);
    }

    performSlide() {
        // Previous slide is unset.
        if (this.prevSlide) {
            this.prevSlide.removeClass('prev fade-out')
        }

        // What was the next slide becomes the previous slide.
        this.nextSlide.removeClass('next');
        this.prevSlide = this.nextSlide;
        this.prevSlide.addClass('prev');

        // New index and appropriate next slide are set.
        this.currentIndex++;
        if (this.currentIndex >= this.slides.length) {
            this.currentIndex = 0
        }

        this.setNextSlide();
        // Fade out action.
        this.prevSlide.addClass('fade-out');
    }

    setNextSlide() {
        this.nextSlide = this.container.find(`[data-slide="${this.currentIndex}"]`).first();
        this.nextSlide.addClass('next');
    }

}

function createImage(photo) {
    let img = $("<img></img>")
    img.attr('src', "../photos/" + photo);
    return img
}


photos = [];
var slideshow = null;
let ip = "192.168.1.13"

$.ajax({
    url: `https://${ip}:3000/photos`,
    type: "GET",
    contentType: "application/json",
    success: function (result) {
        console.log(result)
        for (var i = 0; i < result.photos.length; i++) {
            photos.push(result.photos[i])
            $("div.img-container").append(createImage(result.photos[i]))
        }
        console.log(photos);
        slideshow = new Slideshow;
    },
    error: function (error) {
        console.log(error)
    }
})

var updateSocket = new WebSocket(`wss://${ip}:3000/update`)
updateSocket.onopen = function (event) {
    updateSocket.send("Photo Frame Client");
    console.log("Connected to update websocket");
};
updateSocket.onmessage = function (event) {
    let data = JSON.parse(event.data)
    console.log(data)

    if (data.added != null) {
        // create img element with new filename
        let img = createImage(data.added);
        img.attr('data-slide', slideshow.slides.length);
        $("div.img-container").append(img);

        // add to the slides array
        slideshow.slides.push(img)
        slideshow.playSlideshow()
    }
    else if (data.deleted != null) {
        let imgs = $("img").get();
        console.log(imgs);

        imgs.forEach(img => {
            console.log(img)
            if (img.getAttribute('src').includes(data.deleted)) {
                const index = img.getAttribute('data-slide');
                if (index > -1) {
                    slideshow.slides.splice(index, 1);
                    console.log("deleting")
                    if (slideshow.currentIndex == index) {
                        slideshow.performSlide()
                    }
                    img.remove();
                    slideshow.reset();
                }
            }
        });
        console.log(slideshow)
    }

}