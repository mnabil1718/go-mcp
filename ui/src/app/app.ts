import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavigationLoadingComponent } from './common/components/load/load.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavigationLoadingComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {}
