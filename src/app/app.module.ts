import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { TopBarComponent } from './top-bar/top-bar.component';
import { CanvasComponent } from './canvas/canvas.component';
import { HelloComponent } from './hello.component';
import { DataRecoveryService } from './canvas/data-recovery.service';
import { CanvasLegendComponent } from './canvas-legend/canvas-legend.component'

@NgModule({
  imports: [
    BrowserModule,
    HttpClientModule,
    ReactiveFormsModule,
    RouterModule.forRoot([
      { path: '', component: CanvasComponent },
    ])
  ],
  declarations: [
    AppComponent,
    TopBarComponent,
    CanvasComponent,
    HelloComponent,
    CanvasLegendComponent
  ],
  bootstrap: [ AppComponent ],
  providers: [ DataRecoveryService ]
})
export class AppModule { }

