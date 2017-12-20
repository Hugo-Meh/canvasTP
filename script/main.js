'use strict';

import * as geom from "../script/p86.geom.shape.js";
import {Toile} from "../script/p86.dom.canvas.js";

document.addEventListener("DOMContentLoaded", function(event) {

    let cnv = new Toile(document.getElementById('canvas0'));
    let ctx = cnv.ctx;

    let pieces = [];
    let positon = [];
    let empty = [];
    let drag = false;
    let mX;
    let mY;
    let dx;
    let dy;
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
    function drawGame() {
        ctx.moveTo(50,50);
        ctx.lineTo(450,50);
        ctx.lineTo(450,550);
        ctx.lineTo(50,550);
        ctx.lineTo(50,50);

        ctx.lineWidth=2;
        ctx.strokeStyle="black";

        ctx.fillStyle="#d48c1b";
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
        // ctx.rect(350,450,100,100);
        ctx.stroke();
    }


     function clearCanvas (){

        ctx.clearRect(0,0,cnv.width,cnv.height)
    }

    function initGame(){
        clearCanvas();

        drawGame();

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
    }



    let mouseDown = cnv.onmousedown;
    let mouseUp = cnv.onmouseup;

    function mouseDown(event){
        event.preventDefault();
        event.stopPropagation();

        let x = event.clientX;
        let y = event.clientY;

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

            let x = event.clientX;
            let y = event.clientY;

            dx = mX-x;
            dy = mY-y;

            dragPiece();

            cnv.clearRect(50,50,400,500);
            drawGame();

        }

    }

    function dragPiece(){
        for (let i = 0; i<pieces.length; i++){
            if (pieces[i].isDragging){
                let piece = pieces[i];
                isfree = false;
                isaccesible = false;
                for (let i = 0; i <empty.length; i++){
                    if (x>empty[i].posxstart && x<empty[i].posxend && y>empty[i].posystart && y<empty[i].posyend){
                        isfree = true;
                        if (Math.abs(empty[i].row-piece.row)<=1){
                            isaccesible = true;
                            // move the piece en y
                            pieces[i].posy+=dy;
                        }
                        else if (Math.abs(empty[i].column-piece.column)<=1){
                            // move the piece en x
                            pieces[i].posx+=dx;
                        }
                    }
                }


            }
        }
    }

    function clipPiece(){
        let compareX=1000;
        let compareY=1000;
        let piece;
        for (let i = 0; i<pieces.length; i++){
            if (pieces[i].isDragging){
               piece = pieces[i];
            }
        }

        for (let i = 0; i<positon.length; i++){
            if (Math.abs(piece.posx-positon.posx)<compareX){
                compareX = Math.abs(piece.posx-positon.posx);
                piece.posx = positon[i].posx;
                piece.column = positon[i].column;
            }

            if (Math.abs(piece.posy-positon.posy)<compareY){
                compareY = Math.abs(piece.posy-positon.posy);
                piece.posy = positon[i].posy;
                piece.row = positon[i].row;
            }

            if (compareX<50 && compareY<50){
                break;
            }

        }

        drawGame();
    }


});