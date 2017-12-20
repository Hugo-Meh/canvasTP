/**
 * Definition and Implementation of some 2D shapes
 * Goal :
 *  - Revise Javascript Object programming
 *  - Tooling for Canvas drawing and playing
 */
'use strict';

export {Vector, Dim, Point, Rect, Circle, Polygon};


/**
 * A 2D "vector" holding dx and dy data
 */
class Vector {
    constructor (dx = 0, dy = 0) {
        this.dx = dx;
        this.dy = dy;
    }

    /**
     * Creates a vector from 2 points
     * @param pfrom [Point]
     * @param pto [Point]
     * @returns {Vector}
     */
    static from_points(pfrom, pto) {
        return new Vector(pto.x - pfrom.x, pto.y - pfrom.y);
    }

    /**
     * getter propriété norm : Retourne le module (la norme) du vecteur
     * c'est à dire la racine carrée des carrés des deux valeurs dx et dy
     */
    get norm() {
       return Math.sqrt(this.dx * this.dx + this.dy * this.dy);
    }

    /**
     * Setter propriété norm : Fixe la valeur du module du vecteur
     * @param n
     */
    set norm(n) {
        this.scale(n / this.norm);
    }

    /**
     * Additionner un vecteur au vecteur courant
     * @param v
     */
    add(v) {
        this.dx += v.dx;
        this.dy += v.dy;
        return this;
    }

    /**
     * Multiplier le vecteur par le scalaire c
     * @param c
     */
    scale(c) {
        this.dx *= c;
        this.dy *= c;
        return this;
    }

    /**
     * Rendre le vecteur unitaire (diviser dx et dy par la norme)
     */
    unitarize() {
        this.scale(1/ this.norm);
        return this;
    }

    /**
     * Limite le module du vecteur à une certaine valeur
     * @param v (Number) la limite
     */
    limit(v) {
        if (this.norm > v) {
            this.norm = v;
        }
        return this;
    }
}

/**
 * Dimensions (width and height) of a 2d shape
 */
class Dim {
    constructor (w = 0, h = 0) {
        this.w = w;
        this.h = h;
    }
}


/**
 * Any 2D shape
 * Methods are here for modeling the heritage
 */
class Shape {
    constructor () {
    };

    move_of (dx = 0, dy = 0) {
        throw new Error('Appel illégal, méthode non implantée.');
    }

    get width() {
        throw new Error('Appel illégal, méthode non implantée.');
    }


    set width(w) {
        throw new Error('Appel illégal, méthode non implantée.');
    }


    get height() {
        throw new Error('Appel illégal, méthode non implantée.');
    }

    set height(h) {
        throw new Error('Appel illégal, méthode non implantée.');
    }
}


class Point extends Shape {
    constructor (x = 0, y = 0) {
        super();
        this.x = x;
        this.y = y;
    }

    move_of (dx = 0, dy = 0) {
        this.x += dx;
        this.y += dy;
    }

    move_to (x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }
}

/**
 * Describes any polygon as an array of points
 */
class Polygon extends Shape {
    constructor (points) {
        super();
        if ( ! points instanceof Array
            || points.length < 2
            || points.some((item) => {
                return !item instanceof Point;
            })) {
            throw new Error('Polygon constructor requires an array of at least 2 Points')
        }
        this._points = points;
    }

    get x0() {
        return this._points[0].x;
    }

    get y0() {
        return this._points[0].y;
    }

    set x0(x) {
        this._points[0].x = x;
    }

    set y0(y) {
        this._points[0].y = y;
    }

    get x1() {
        return this._points[1].x;
    }

    get y1() {
        return this._points[1].y;
    }

    set x1(x) {
        this._points[1].x = x;
    }

    set y1(y) {
        this._points[1].y = y;
    }

    get x2() {
        return this._points[2].x;
    }

    get y2() {
        return this._points[2].y;
    }

    get x3() {
        return this._points[3].x;
    }

    get y3() {
        return this._points[3].y;
    }

    get center() {
        throw new Error('Not implemented yet');
    }

    get width() {
        return 0;
    }

    get height() {
        return 0;
    }

    move_of (dx = 0, dy = 0) {
        for (let i = 0; i < this._points.length ; i++) {
            this._points[i].x += dx;
            this._points[i].y += dy;
        }
    }

    /**
     * Moves Polygon so that p0 point becomes given position (x, y)
     * @param x
     * @param y
     */
    move_to (x , y) {
        this.move_of(x - this.x0, y - this.y0);
    }

}

/**
 * Describes a rectangle shape given 2 points p0 and p1
 * p0 does not have to be the top left corner
 * p1 is the corner opposite to p0
 * Can be defined also by a given point and two dims, width and length
 */
class Rect extends Polygon {
    /**
     * Constructeur d'un rectangle
     * Deux appels possibles new Rect(x,y, Point) ou new Rect(x,y, Dim)
     * @param x {Number}, coordonnée x du point p0
     * @param y {Number}, coordonnée y du point p0
     * @param ext {Point|Dim}, une extension pour définir le point p1 opposé à p0
     */
    constructor (x = 0, y = 0, ext = null) {
        super([new Point(x, y), new Point(0,0)]); // Creates the two points of the Polygon
        if (null !== ext) {
            if (ext instanceof Point) {
                this._points[1].x = ext.x;
                this._points[1].y = ext.y;
            } else if (ext instanceof Dim) {
                this._points[1].x = x + ext.w;
                this._points[1].y = y + ext.h;
            } else {
                throw new Error('Invalid class for Rect extension parameter.');
            }
        }
    }

    get width() {
        return this._points[1].x - this._points[0].x;
    }

    set width(w) {
        this._points[1].x = this._points[0].x + w;
    }

    get height() {
        return this._points[1].y - this._points[0].y;
    }

    set height(h) {
        this._points[1].y = this._points[0].y + h;
    }

    get x() {
        return this.x0;
    }

    get y() {
        return this.y0;
    }

    set x(x) {
        this.x0 = x;
    }

    set y(y) {
        this.y0 = y;
    }

    get center() {
        return new Point((this.x0 + this.x1) / 2, (this.y0 + this.y1) / 2);
    }

    set center(c) {
        let v = Vector.from_points(this.center, c);
        this.move_of(v.dx, v.dy);
    }
}

class Circle extends Shape {
    constructor (x = 0 , y = 0 , r = 0) {
        super();
        this._c = new Point(x,y);
        this._r = r;
    }

    get ray() {
        return this._r;
    }

    set ray(r) {
        this._r = r;
    }

    get center() {
        return new Point(this._c.x, this._c.y);
    }

    set center(c) {
        this._c.x = c.x;
        this._c.y = c.y;
    }

    get width() {
        return this._r * 2;
    }


    set width(w) {
        this._r = w / 2;
    }


    get height() {
        return this._r * 2;
    }

    set height(h) {
        this._r = h / 2;
    }

    move_of (dx = 0, dy = 0) {
        this._c.x += dx;
        this._c.y += dy;
    }
}

