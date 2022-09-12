import { Injectable } from '@angular/core';
import { GlobalVariables } from 'src/app/models/global/global-variables.model';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {
  globalVar = new GlobalVariables();
  
  constructor() { }
}
