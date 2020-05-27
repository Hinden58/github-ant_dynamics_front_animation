import { Component, OnInit, ViewChild, ElementRef, Input, HostListener } from '@angular/core';

import { Animal } from "../classes/animal";
import { Ant } from "../classes/ant";
import { Queen } from "../classes/queen";
import { Worker } from "../classes/worker";
import { Soldier } from "../classes/soldier";
import { Element } from "../classes/element";
import { Path } from "../classes/path";
import { Role } from "../classes/role";
import { Anthill } from "../classes/anthill";
import { Supply } from "../classes/supply";
import { Egg } from "../classes/egg";

@Component({
  selector: 'app-canvas-legend',
  templateUrl: './canvas-legend.component.html',
  styleUrls: ['./canvas-legend.component.css']
})
export class CanvasLegendComponent implements OnInit {

  @ViewChild('canvaslegend', { static: true })
    private canvaslegend : ElementRef<HTMLCanvasElement>;
    private ctx: CanvasRenderingContext2D;

    constructor() { 
      
    }

    ngOnInit() {
      if(this.canvaslegend.nativeElement.getContext) {
        this.ctx = this.canvaslegend.nativeElement.getContext('2d');

        /*console.log("height = " + this.canvaslegend.nativeElement.height);
        console.log("heightStyle = " + this.canvaslegend.nativeElement.style.height);
        console.log("width = " + this.canvaslegend.nativeElement.width);
        console.log("widthStyle = " + this.canvaslegend.nativeElement.style.width);*/

        this.ctx.beginPath();
        this.ctx.fillStyle = 'fuchsia';
        this.ctx.arc(15, 15, 20, 0, (Math.PI/180)*360, false);
        //this.ctx.fill();
        this.ctx.stroke();
        this.ctx.fill();
        //this.ctx.closePath();
        

        let canvasRatio = this.canvaslegend.nativeElement.height / this.canvaslegend.nativeElement.width;;
        let windowRatio = window.innerHeight / window.innerWidth;
        let width;
        let height;
        if (windowRatio < canvasRatio) {
            height = window.innerHeight;
            width = height / canvasRatio;
        } else {
            width = window.innerWidth;
            height = width * canvasRatio;
        }
        this.canvaslegend.nativeElement.height = height * 0.35;
        this.canvaslegend.nativeElement.width = height * 0.35;
        this.canvaslegend.nativeElement.style.width = height * 0.35 + 'px';
        this.canvaslegend.nativeElement.style.height = height * 0.35 + 'px';


        this.drawLegend();
      }else {
        console.log('canvas non supporté dans cette version de navigateur, veuillez vous metre à jour ! ');
      }
    }

    @HostListener('window:resize', ['$event'])
    onResize(event) {

      let canvasRatio = this.canvaslegend.nativeElement.height / this.canvaslegend.nativeElement.width;;
      let windowRatio = window.innerHeight / window.innerWidth;
      let width;
      let height;

      if (windowRatio < canvasRatio) {
          height = window.innerHeight;
          width = height / canvasRatio;
      } else {
          width = window.innerWidth;
          height = width * canvasRatio;
      }

      /*console.log("height = " + this.canvas.nativeElement.height);
      console.log("heightStyle = " + this.canvas.nativeElement.style.height);
      console.log("width = " + this.canvas.nativeElement.width);
      console.log("widthStyle = " + this.canvas.nativeElement.style.width);*/
      //let widthPourcent = window.innerWidth * 0.30;
      //let heightPourcent = window.innerHeight * 0.30;
      //this.canvas.nativeElement.style.height = window.innerHeight - heightPourcent +'px';
      //this.canvas.nativeElement.style.width = window.innerWidth - widthPourcent + 'px';

      //this.canvas.nativeElement.height = height;
      //this.canvas.nativeElement.width = width;
      this.canvaslegend.nativeElement.style.width = height * 0.35 + 'px';
      this.canvaslegend.nativeElement.style.height = height * 0.35 + 'px';

      //this.canvas.nativeElement.height = window.innerHeight;
      //this.canvas.nativeElement.width = window.innerWidth;
      //event.target.innerWidth;
  }

    drawLegend() {
      this.draw(35, 35, '', 30, false); //Element
      this.drawText(75, 35, 'Element');
      this.draw(35, 95, 'maroon', 20, true); //Animal
      this.drawText(75, 95, 'Animal');
      this.draw(35, 140, 'fuchsia', 20, true); //Queen
      this.drawText(75, 140, 'Queen');
      this.draw(35, 180, 'green', 15, true); //Soldier
      this.drawText(75, 180, 'Soldier');
      this.draw(35, 215, 'navy', 15, true); //Worker
      this.drawText(75, 215, 'Worker');
      this.draw(35, 250, 'peachpuff', 10, true); //Egg
      this.drawText(75, 250, 'Egg');
    }

    draw(x : number, y : number, color : string, size : number, filled : boolean)
    {
      this.ctx.beginPath();
      this.ctx.arc(x, y, size, 0, (Math.PI/180)*360, false);
      if(filled) {
        this.ctx.fillStyle = color;
        this.ctx.fill();
      }
      this.ctx.stroke();
      this.ctx.closePath();
    }

    drawText(x : number, y : number, text : string) {
      this.ctx.beginPath();
      this.ctx.fillStyle = 'black';
      this.ctx.font = '20px serif';
      this.ctx.textBaseline = 'middle';
      this.ctx.fillText(text, x, y);
      //this.ctx.strokeText(text, x, y);
      this.ctx.closePath();
    }

    

}