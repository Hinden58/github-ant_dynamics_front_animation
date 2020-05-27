 import { Component, OnInit, ViewChild, ElementRef, HostListener } from '@angular/core';
import { DataRecoveryService} from './data-recovery.service'
import { HttpClient } from '@angular/common/http';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import { Animal } from '../classes/animal';
import { Path } from '../classes/path';
import { Element } from '../classes/element';
import { Queen } from '../classes/queen';
import { Egg } from '../classes/egg';
import { Soldier } from '../classes/soldier';
import { Worker } from '../classes/worker';
import { Role } from '../classes/role';
import { componentFactoryResolverProviderDef } from '@angular/compiler/src/view_compiler/provider_compiler';
import { Anthill } from '../classes/anthill';
import { Supply } from '../classes/supply';
import { Ant } from '../classes/ant';

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.css']
})

export class CanvasComponent implements OnInit {

@ViewChild('canvas', { static: true }) 
  private canvas: ElementRef<HTMLCanvasElement>;
  private ctx: CanvasRenderingContext2D;
  private backMaxCoordinate : number;

  //all simulation data
  raw_data : any = [];
  elem_in_env : Element[];
  animal_in_env : Animal[];
  path_in_env : Path[];
  anthill_in_env : Anthill[];
  
  //Variable for update cycle
  interval;
  timeleft = 5;
  stepTime = 2000;
  simulationTurn;


  //simulation step Data
  listElem: Element[];
  listAnimal: Animal[];
  listPath: Path[];

  constructor(
    private dr : DataRecoveryService,
  ) { this.backMaxCoordinate = 20; }

  async ngOnInit() {
    await this.getData();
    //this.showData();
    if(this.canvas.nativeElement.getContext) {


      this.ctx = this.canvas.nativeElement.getContext('2d');

      
      let canvasRatio = this.canvas.nativeElement.height / this.canvas.nativeElement.width;;
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
      this.canvas.nativeElement.height = height * 0.96;
      this.canvas.nativeElement.width = height * 0.96;
      this.canvas.nativeElement.style.width = height * 0.96 + 'px';
      this.canvas.nativeElement.style.height = height * 0.96 + 'px';



      //let widthPourcent = window.innerWidth * 0.30;
      //let heightPourcent = window.innerHeight * 0.30;
      //this.canvas.nativeElement.style.height = window.innerHeight - heightPourcent +'px';
      //this.canvas.nativeElement.style.width = window.innerWidth - widthPourcent + 'px';
      //window.addEventListener('resize', this.resize, false);*/

      console.log("width = " + this.canvas.nativeElement.width);
      console.log("height = " + this.canvas.nativeElement.height);



      //seulement pour les tests d'affichage
      //this.showData();

      this.startTimer();
    } else {
      console.log('canvas non supporté dans cette version de navigateur, veuillez vous metre à jour ! ');
    }
  }

  @HostListener('window:resize', ['$event'])
    onResize(event) {

      let canvasRatio = this.canvas.nativeElement.height / this.canvas.nativeElement.width;;
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

      //this.canvas.nativeElement.height = height;
      //this.canvas.nativeElement.width = width;
      this.canvas.nativeElement.style.width = height*0.96 + 'px';
      this.canvas.nativeElement.style.height = height*0.96 + 'px';
  }

  toCanvasWidthCoordinate(x : number) : number {
    return x*this.canvas.nativeElement.width/this.backMaxCoordinate;
  }

  toCanvasHeightCoordinate(y : number) : number {
    return y*this.canvas.nativeElement.height/this.backMaxCoordinate;
  }

  async getData() {
    try {
       const tempData = await this.dr.getData().toPromise();
       //console.log("Data : " + tempData)
       for (const d of (tempData as any)) {
        this.raw_data.push({
          __class__: d.__class__,
          _list_element: d.list_element,
          _list_anthill : d.list_anthill
        });
      }
    } catch (e) {
        console.error(e);
    }
    /*const tempData = await this.dr.getData().toPromise();
    for (const d of (tempData as any)) {
      this.ants.push({
        __class__: d.__class__,
        _list_element: d.list_element,
        _list_anthill : d.list_anthill
      });
    }*/
  }

  startTimer() {
    this.simulationTurn = 0;
    this.simulationStep(this.raw_data[this.simulationTurn],this.simulationTurn)
    this.interval = setInterval(() => {
      this.simulationTurn++;
      this.timeleft = 5;
      /this.simulationStep(this.raw_data[this.simulationTurn],this.simulationTurn)
      //console.log(this.simulationTurn)
    },this.stepTime)
  }

  simulationStep(environment,turn) {
    let element_in_environment : Element[] = [];
    let animal_in_environment : Animal[] = [];
    let path_in_environment : Path[] = [];
    let anthill_in_environment : Anthill[] = [];
    for(const d of environment._list_element){
      let animal_on_elem : Animal[] = [];
      let path_from_elem : Path[] =[];
      let eid : number = d.id;
      let x : number = this.toCanvasWidthCoordinate(d.position.x);
      let y : number = this.toCanvasHeightCoordinate(d.position.y);
      //console.log(x + ", " +y)
      for(const a of d.list_animal){
        //TODO : Path, Role
        switch(a.__class__){
          case("Queen"): { 
              let app =  a.__parent__.__parent__;
              let animal : Queen = new Queen(eid, x, y, app.origin,0, app.life, app.life_max,app.size,app.damage, app.hunger,app.hunger_max,app.thirst,app.thirst_max,app.is_travelling,a.__parent__.home,a.__parent__.age,a.__parent__.age_max,this.getRole(a.__parent__.role),this.ctx);
              animal_on_elem.push(animal)
              //animal.draw()
              //console.log(animal) 
            break; 
          } 
          case("Egg"):{
             let app =  a.__parent__.__parent__;
             let animal : Egg = new Egg(eid, x, y, 0, app.life, app.life_max,app.size,app.damage, app.hunger,app.hunger_max,app.thirst,app.thirst_max,app.is_travelling,a.__parent__.home,a.__parent__.age,a.__parent__.age_max,this.getRole(a.__parent__.role),this.ctx);
             animal_on_elem.push(animal)
             //animal.draw()
             //console.log("Handeled : " + a.__class__) 
            break;
          }
          case("Soldier"):{
            let app =  a.__parent__.__parent__;
             let animal : Soldier = new Soldier(eid, x, y,app.origin, 0, app.life, app.life_max,app.size,app.damage, app.hunger,app.hunger_max,app.thirst,app.thirst_max,app.is_travelling,a.__parent__.home,a.__parent__.age,a.__parent__.age_max,this.getRole(a.__parent__.role),this.ctx);
             animal_on_elem.push(animal)
             //console.log(animal)
             //animal.draw()
             //console.log("Handeled : " + a.__class__) 
            break;
          }
          case("Worker"):{
            let app =  a.__parent__.__parent__;
             let animal : Worker = new Worker(eid, x, y, app.origin,0, app.life, app.life_max,app.size,app.damage, app.hunger,app.hunger_max,app.thirst,app.thirst_max,app.is_travelling,a.__parent__.home,a.__parent__.age,a.__parent__.age_max,this.getRole(a.__parent__.role),a.supply_capacity,this.ctx);
             animal_on_elem.push(animal)
             //console.log(animal)
             //animal.draw()
             //console.log("Handeled : " + a.__class__) 
            break;
          }
          default: { 
            console.log("Not handeled : " + a.__class__) 
            break; 
          } 
        }
      }
      for(const p of d.list_path){
        let path : Path = new Path(p.id,p.start,p.end,p.cost,p.capacity,p.capacity_max);
        path_from_elem.push(path);
        //console.log(path_from_elem)
      }
      let element : Element = new Element(d.id,d.radius,d.capacity,d.capacity_max,x,y,d.pheromone.pheromone_danger,d.pheromone.pheromone_food,d.pheromone.pheromone_recruit,animal_on_elem,path_from_elem,this.ctx);
      console.log(element)
      element_in_environment.push(element);
      animal_in_environment=animal_in_environment.concat(animal_on_elem);
      path_in_environment=path_in_environment.concat(path_from_elem);
    
    }
    for(const la of environment._list_anthill){
      let entrances : number[] = [];
      let colony : number[] = [];
      for(const e of la.entrance){
        entrances.push(e.id);
      }
      for(const c of la.colony){
        colony.push(c.__parent__.__parent__.id)
      }
      let anthill : Anthill = new Anthill(la.name,entrances,colony,la.storage[0],la.storage[1]);
      anthill_in_environment.push(anthill)
    }
    console.log(element_in_environment)
    this.elem_in_env = element_in_environment;
    console.log(animal_in_environment)
    this.animal_in_env = animal_in_environment;
    console.log(path_in_environment)
    this.path_in_env = path_in_environment;
    console.log(anthill_in_environment)
    this.anthill_in_env = anthill_in_environment;
    let timestamp_start = window.performance.now()
    //const soldier = new Soldier(0,this.toCanvasHeightCoordinate(5),this.toCanvasWidthCoordinate(5),0,0,0,0,0,0,0,0,0,0,null,0,0,0,this.ctx)
    this.showData(timestamp_start,turn)
  }

  showData(timestamp_start,turn) {
    let animationFrame;
    //console.log(turn)
    if(this.simulationTurn != turn){
      window.cancelAnimationFrame(animationFrame);
      console.log("stoped previous step animation")
      return true
    }
    this.ctx.clearRect(0, 0, this.toCanvasWidthCoordinate(20), this.toCanvasHeightCoordinate(20))
    for(const e of this.elem_in_env){
      e.draw()
    }
    
    for(const a of this.animal_in_env){
      if(a instanceof(Ant)){
        if(a._role == Role.SEARCH && a._is_travelling!=0){
          let origin;
          let path;
          //console.log(a)
          for(const e of this.elem_in_env){
            //console.log(e._id)
            if(e._id==a._origin){
              origin = e;
            }
          }
          for(const p of origin._list_path){
            if(p._end==a._element_id){
              path=p;
            }
          }
          //console.log(path)
          //console.log(a)
          
          let path_percent = (path._cost - a._is_travelling -( (window.performance.now() - timestamp_start) / this.stepTime) ) / path._cost ;
          let test = window.performance.now()
          //console.log("test " +test)
          let animation_x = origin._x + (a._x-origin._x)* path_percent;

          //console.log(origin._x + " vs " +animation_x)
          let animation_y = origin._y + (a._y-origin._y)* path_percent;
          a.draw_xy(animation_x,animation_y);
        }else{
          a.draw()
        }
      }else{
        a.draw()
      }
    }
    animationFrame = window.requestAnimationFrame(() => this.showData(timestamp_start,turn));

  }  



  getRole(s : String){
    switch(s){
      case("Role.PASSIVE"):{
        return Role.PASSIVE;
      }
      case("Role.ATTACK"):{
        return Role.ATTACK;
      }
      case("Role.SEARCH"):{
        return Role.SEARCH;
      }
      case("Role.FLEE"):{
        return Role.FLEE;
      }
      case("Role.REST"):{
        return Role.REST;
      }
      case("Role.HARVEST"):{
        return Role.HARVEST;
      }
    }
  }
}