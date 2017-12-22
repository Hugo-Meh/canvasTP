'use strict';

import * as geom from "../script/p86.geom.shape.js";
import {Toile} from "../script/p86.dom.canvas.js";

document.addEventListener("DOMContentLoaded", function(event) {
    console.log("knock knock!");
    let cnv = new Toile(document.getElementById('canvas0'));

    let ctx = cnv.ctx;

    let pieces = [];
    let position = [];
    let empty = [];
    let drag = false;
    let mX;
    let mY;
    let dx;
    let dy;
    let x;
    let y;
    let isfree;
    let isaccesible;

    let columninit = 0;
    for (let i =50; i <= 350; i+=50 ){
        let rowinit = 0;
        for (let j =50; j <= 450; j+=50 ) {
            position.push({posx:i,posy:j,row:rowinit,column:columninit});
            rowinit ++;
        }
        columninit ++;
    }
    console.log("hello");
    initGame();
    console.log("yes! who's there?");

    function drawGame() {
        console.log("drawgame");

        ctx.moveTo(50,50);
        ctx.lineTo(450,50);
        ctx.lineTo(450,550);
        ctx.lineTo(50,550);
        ctx.lineTo(50,50);

        ctx.lineWidth=2;
        ctx.strokeStyle="black";

        /*ctx.fillStyle="#d48c1b";
        ctx.fillRect(50,50,100,200);
        ctx.strokeRect(50,50,100,200);
        //ctx.rect(50,50,100,200);
        // ane rouge
        ctx.fillStyle="#b62824";
        ctx.fillRect(150,50,200,200);
        ctx.strokeRect(150,50,200,200);
        //ctx.rect(150,50,200,200);

        ctx.fillStyle="#d48c1b";
        ctx.fillRect(350,50,100,200);
        ctx.strokeRect(350,50,100,200);
        //ctx.rect(350,50,100,200);

        ctx.fillStyle="#000000";
        ctx.fillRect(50,250,100,200);
        ctx.strokeRect(50,250,100,200);
        //ctx.rect(50,250,100,200);

        ctx.fillStyle="#611815";
        ctx.fillRect(150,250,100,100);
        ctx.strokeRect(150,250,100,100);
        //ctx.rect(150,250,100,100);

        ctx.fillStyle="#611815";
        ctx.fillRect(250,250,100,100);
        ctx.strokeRect(250,250,100,100);
        //ctx.rect(250,250,100,100);
        ctx.fillStyle="#000000";
        ctx.fillRect(350,250,100,200);
        ctx.strokeRect(250,250,100,100);

        ctx.fillStyle="#d0d4a7";
        ctx.fillRect(150,350,200,100);
        ctx.strokeRect(150,350,200,100);

        //ctx.rect(350,250,100,200);

        ctx.fillStyle="#d4b464";
        ctx.fillRect(50,450,100,100);
        ctx.strokeRect(50,450,100,100);

        //ctx.rect(150,350,200,100);
        //ctx.rect(50,450,100,100);
        ctx.fillStyle="#d4b464";
        ctx.fillRect(350,450,100,100);
        ctx.strokeRect(350,450,100,100);
        // ctx.rect(350,450,100,100);*/
        for(let i=0;i<pieces.length;i++){
            ctx.fillStyle=pieces[i].color;
            ctx.fillRect(pieces[i].posx,pieces[i].posy,pieces[i].width,pieces[i].height);
            ctx.strokeRect(pieces[i].posx,pieces[i].posy,pieces[i].width,pieces[i].height);
        }
        ctx.stroke();
    }


     function clearCanvas (){

        ctx.clearRect(0,0,cnv.width,cnv.height)
    }

    function initGame(){
        console.log("initgame");
        clearCanvas();



        pieces.push({posx:50,posy:50,row:0,column:0,width:100,height:200,color:'#d48c1b',isDonkey:false,isDragging:false,isDraggable:false});
        pieces.push({posx:150,posy:50,row:0,column:1,width:200,height:200,color:'#b62824',isDonkey:true,isDragging:false,isDraggable:false});
        pieces.push({posx:350,posy:50,row:0,column:3,width:100,height:200,color:'#d48c1b',isDonkey:false,isDragging:false,isDraggable:false});
        pieces.push({posx:50,posy:250,row:2,column:0,width:100,height:200,color:'#000000',isDonkey:false,isDragging:false,isDraggable:false});
        pieces.push({posx:150,posy:250,row:2,column:1,width:100,height:100,color:'#611815',isDonkey:false,isDragging:false,isDraggable:false});
        pieces.push({posx:250,posy:250,row:2,column:2,width:100,height:100,color:'#611815',isDonkey:false,isDragging:false,isDraggable:false});
        pieces.push({posx:350,posy:250,row:2,column:3,width:100,height:200,color:'#000000',isDonkey:false,isDragging:false,isDraggable:false});
        pieces.push({posx:150,posy:350,row:3,column:1,width:200,height:100,color:'#d0d4a7',isDonkey:false,isDragging:false,isDraggable:true});
        pieces.push({posx:50,posy:450,row:4,column:0,width:100,height:100,color:'#d4b464',isDonkey:false,isDragging:false,isDraggable:true});
        pieces.push({posx:350,posy:450,row:4,column:3,width:100,height:100,color:'#d4b464',isDonkey:false,isDragging:false,isDraggable:true});

        empty.push({posxstart:150,posxend:250,posystart:450,posyend:550,row:4,column:1});
        empty.push({posxstart:250,posxend:350,posystart:450,posyend:550,row:4,column:2});

        drawGame();

    }


    cnv.canvas.addEventListener("mousedown",mouseDown);
    cnv.canvas.addEventListener("mousemove",mouseMove);
    cnv.canvas.addEventListener("mouseup",mouseUp);
    function mouseDown(event){
        event.preventDefault();
        event.stopPropagation();

        x = event.clientX;
        y = event.clientY;

        drag = false;

        for(let i = 0; i <pieces.length; i++){
            let piece = pieces[i];

            if (x>piece.posx && x<piece.posx+piece.width && y>piece.posy && y<piece.posy+piece.height){
                // on est dans cette piece au moment du click
                if(piece.isDraggable){
                    drag=true;
                    piece.isDragging=true;
                    mX=x;
                    mY=y;
                }

            }
        }
    }

    function mouseUp(event) {
        event.preventDefault();
        event.stopPropagation();

        clipPiece();

        drag = false;
        for(let i=0;i<pieces.length;i++){
            pieces[i].isDragging=false;
        }



    }

    function mouseMove(event){
        if (drag){
            event.preventDefault();
            event.stopPropagation();

            x = event.clientX;
            y = event.clientY;

            dx = x-mX;
            dy = y-mY;
            /*if(mX-x>0){
                dx = mX-x;
            }
            else{
                dx = mX;
            }

            if(mY-y>0){
                dy =mY-y;
            }
            else{
                dy =y-mY;
            }*/

            dragPiece();

            ctx.clearRect(0,0,cnv.width,cnv.height);
            drawGame();

        }

    }

    function dragPiece(){
        console.log("dragpiece");
        for (let i = 0; i<pieces.length; i++){
            if (pieces[i].isDragging){
                let piece = pieces[i];
                isfree = false;
                isaccesible = false;
                for (let j = 0; j <empty.length; j++){
                    if (x>empty[j].posxstart && x<empty[j].posxend && y>empty[j].posystart && y<empty[j].posyend || x>piece.posx && x<piece.posx+piece.width && y>piece.posy && y<piece.posy+piece.height){
                        console.log("yeahhh !!!!!! =)");
                        isfree = true;
                        if (Math.abs(empty[j].row-piece.row)!=0 && Math.abs(empty[j].row-piece.row)<=1){
                            console.log("deplacement en y");
                            isaccesible = true;
                            // move the piece en y
                            pieces[i].posy=pieces[i].posy+dy;
                            mY=pieces[i].posy;
                        }
                        else if (Math.abs(empty[j].column-piece.column)!=0 &&Math.abs(empty[j].column-piece.column)<=1){
                            console.log("deplacement en x");
                            console.log(mX);
                            console.log(x);
                            console.log(dx);
                            console.log(piece.posx);
                            // move the piece en x
                            pieces[i].posx=pieces[i].posx+dx;
                            mX=pieces[i].posx;
                        }
                    }
                }


            }
        }
    }

    function clipPiece(){
        console.log("begin clipping");
        let compareXf=1000;
        let compareYf=1000;
        let compareX;
        let compareY;
        let piece;
        for (let i = 0; i<pieces.length; i++){
            if (pieces[i].isDragging){
                piece = pieces[i];
                for (let j = 0; j<position.length; j++){
                    compareX = Math.abs(piece.posx-position[j].posx);
                    compareY = Math.abs(piece.posy-position[j].posy);
                    if (x>position[j].posxstart && x<position[j].posxend  && y>position[j].posystart && y<position[j].posyend){
                        pieces[i].posx = position[j].posx;
                        pieces[i].column = position[j].column;
                        pieces[i].posy = position[j].posy;
                        pieces[i].row = position[j].row;
                    }
                    /*if (compareX<compareXf){
                        compareXf = Math.abs(piece.posx-position[j].posx);
                        pieces[i].posx = position[j].posx;
                        pieces[i].column = position[j].column;
                    }

                    if (compareY<compareYf){
                        compareY = Math.abs(piece.posy-position[j].posy);
                        pieces[i].posy = position[j].posy;
                        pieces[i].row = position[j].row;
                    }

                    if (compareX<50 && compareY<50){
                        break;
                    }*/

                }
            }
        }
        drawGame();
    }


});