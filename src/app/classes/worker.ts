import { Ant } from "./ant"
import { Role } from "./role";
import { Anthill } from "./anthill";
import { Path } from "./path";
import { Element } from "./element";
import { Supply } from "./supply";

export class Worker extends Ant { 

  //_supply:(Supply | number)[];
  _supply_max:number;
  constructor(element:number,x:number,y:number, path:number, actual_life:number, max_life:number, size:number, damage:number, actual_hunger:number, max_hunger:number, actual_thirst:number, max_thirst:number, is_travelling:number, home:string, actual_age:number, max_age:number, role:Role,
  // supply:Supply, 
  maxCapacity:number, ctx : CanvasRenderingContext2D) {

    super(element,x,y, path, actual_life, max_life, size, damage, actual_hunger, max_hunger, actual_thirst, max_thirst, is_travelling, home, actual_age, max_age, role, ctx);
    //this._supply[0] = supply;
    //this._supply[1] = maxCapacity;
    this._supply_max = maxCapacity
    
  }

  draw():void {
    this._ctx.beginPath();
    this._ctx.fillStyle = 'navy';
    this._ctx.arc(this._x, this._y, 15, 0, (Math.PI/180)*360, false);this._ctx.stroke();
    this._ctx.fill();
  }
}