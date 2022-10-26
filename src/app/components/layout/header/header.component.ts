import { Component, OnInit } from '@angular/core';
import { BattleService } from 'src/app/services/battle/battle.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(private battleService: BattleService) { }

  ngOnInit(): void {
  }

  pauseGame() {
    this.battleService.togglePause();
  }
}
