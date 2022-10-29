import { Injectable } from '@angular/core';
import { NavigationEnum } from '../enums/navigation-enum.model';

@Injectable({
  providedIn: 'root'
})
export class LayoutService {
  navigation: NavigationEnum = NavigationEnum.Default;

  constructor() { }
  
  changeLayout(navigationEnum: NavigationEnum)
  {
    this.navigation = navigationEnum;
  }
}
