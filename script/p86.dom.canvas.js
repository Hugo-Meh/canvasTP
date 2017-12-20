export {Toile}

import * as geom from "./p86.geom.shape.js";
const RETICLE_RAY = 15;

/**
 * An utility object to hold
 *  - A Canvas element
 *  - Its bounding area (a Rect objet)
 *  - Its 2D context
 *
 */
class Toile {
    constructor (canvas = null) {
        this._canvas = null;
        this._ctx = null;
        this._rect = null;
        this.canvas = canvas;
    }

    get canvas() {
        return this._canvas;
    }

    set canvas(c) {
        if (('object' === typeof c) && (c instanceof HTMLCanvasElement)) {
            this._canvas = c;
            this._ctx = c.getContext('2d');
            this._rect = new geom.Rect(0 , 0, new geom.Dim(c.width, c.height));
            console.log('Canvas element and its context updated to ', this.canvas , ', dimensions w=' + this.rect.width + ' and h=' + this.rect.height + ')');
        }
    }

    get ctx() {
        return this._ctx;
    }

    get rect() {
        return this._rect;
    }

    get width() {
        return this.canvas.width;
    }

    /**
     * Sets the width of the Toile
     */
    set width(w) {
        this.canvas.width = w;
        this.rect.width = w;
    }

    get height() {
        return this.canvas.height;
    }

    /**
     * Sets the height of the Toile
     */
    set height(h) {
        this.canvas.height = h;
        this.rect.height = h;
    }

    /**
     * Draws a reticle centered at a given position (in order to evidence that position)
     */
    draw_reticle(center, color) {
        this.ctx.save();
        this.ctx.lineWidth = 1;
        // Outer circle
        this.ctx.beginPath();
        this.ctx.arc(center.x, center.y, RETICLE_RAY, 0, 2 * Math.PI);
        this.ctx.strokeStyle = color;
        this.ctx.stroke();
        // Cross
        this.ctx.beginPath();
        this.ctx.moveTo(center.x, center.y - RETICLE_RAY);
        this.ctx.lineTo(center.x, center.y + RETICLE_RAY);
        this.ctx.moveTo(center.x - RETICLE_RAY, center.y);
        this.ctx.lineTo(center.x + RETICLE_RAY, center.y);
        this.ctx.stroke();
        this.ctx.restore();
    }

    /**
     * Apply some options to the context
     */
    apply_options(options) {
        if (options.hasOwnProperty("lineWidth")) {
            this.ctx.lineWidth = options.lineWidth;
        }
        if (options.hasOwnProperty("dash")) {
            this.ctx.setLineDash(options.dash);
        }
        if (options.hasOwnProperty("strokeStyle")) {
            this.ctx.strokeStyle = options.strokeStyle;
        }
        if (options.hasOwnProperty("fillStyle")) {
            this.ctx.fillStyle = options.fillStyle;
        }
    }


    /**
     * Draws a dotted line in order to evidence a direction
     */
    draw_vector(start, vect, options = {}) {
        if ( ! (start instanceof geom.Point)) {
            throw new Error("start parameter : Point instance expected");
        }
        if ( ! (vect instanceof geom.Vector)) {
            throw new Error("start parameter : Point instance expected");
        }
        this.ctx.save();
        this.apply_options(options);
        this.ctx.beginPath();
        this.ctx.moveTo(start.x, start.y);
        this.ctx.lineTo(start.x + vect.dx, start.y + vect.dy);
        this.ctx.stroke();
        this.ctx.restore();
    }

    /**
     * Draws a dotted line in order to evidence a direction
     */
    draw_axis (length = this.width / 2, options = {}) {
        this.ctx.save();
        this.apply_options(options);
        this.ctx.beginPath();
        this.ctx.moveTo(0, 0);
        this.ctx.lineTo(length, 0);
        this.ctx.stroke();
        this.ctx.beginPath();
        this.ctx.moveTo(0, 0);
        this.ctx.lineTo(0, length);
        this.ctx.stroke();
        this.ctx.restore();
    };


    /**
     * Provides mouse event interaction coordinates relative to on the canvas
     */
    get_evt_pos (evt) {
        let rect = this.canvas.getBoundingClientRect();
        return new geom.Point(evt.clientX - rect.left, evt.clientY - rect.top);
    };

    /**
     * Make the canvas fit the window size
     */
    fit_to_window() {
        this.width = window.innerWidth;
        this.height = window.innerHeight;
    };
}




