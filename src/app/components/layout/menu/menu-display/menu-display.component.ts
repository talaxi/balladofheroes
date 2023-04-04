import { Component, Input, OnInit } from '@angular/core';
import { MenuEnum } from 'src/app/models/enums/menu-enum.model';
import { MenuService } from 'src/app/services/menu/menu.service';

@Component({
  selector: 'app-menu-display',
  templateUrl: './menu-display.component.html',
  styleUrls: ['./menu-display.component.css']
})
export class MenuDisplayComponent implements OnInit {
  public menuEnum = MenuEnum;
  @Input() isMobile = false;

  constructor(public menuService: MenuService) { }

  ngOnInit(): void {    
  }

}
