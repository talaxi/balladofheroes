import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MainComponent } from './components/main/main/main.component';
import { HeaderComponent } from './components/layout/header/header.component';
import { FooterComponent } from './components/layout/footer/footer.component';
import { ZoneNavigationComponent } from './components/layout/zone-navigation/zone-navigation.component';
import { PartyComponent } from './components/layout/party/party.component';
import { BattleComponent } from './components/layout/battle/battle.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatBadgeModule} from '@angular/material/badge';
import {MatBottomSheetModule} from '@angular/material/bottom-sheet';
import {MatButtonModule} from '@angular/material/button';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {MatCardModule} from '@angular/material/card';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatChipsModule} from '@angular/material/chips';
import {MatStepperModule} from '@angular/material/stepper';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatDialogModule} from '@angular/material/dialog';
import {MatDividerModule} from '@angular/material/divider';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatListModule} from '@angular/material/list';
import {MatMenuModule} from '@angular/material/menu';
import {MatNativeDateModule, MatRippleModule} from '@angular/material/core';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatRadioModule} from '@angular/material/radio';
import {MatSelectModule} from '@angular/material/select';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatSliderModule} from '@angular/material/slider';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatSortModule} from '@angular/material/sort';
import {MatTableModule} from '@angular/material/table';
import {MatTabsModule} from '@angular/material/tabs';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatTreeModule} from '@angular/material/tree';
import { EnemyViewComponent } from './components/subcomponents/enemy-view/enemy-view.component';
import { AbilityViewComponent } from './components/subcomponents/ability-view/ability-view.component';
import { EquipmentViewComponent } from './components/equipment-view/equipment-view.component';
import { CustomTooltipComponent } from './components/subcomponents/custom-tooltip/custom-tooltip.component';
import { ToolTipRendererDirective } from './components/subcomponents/custom-tooltip/tool-tip-renderer.directive';
import { EquipmentItemViewComponent } from './components/equipment-view/equipment-item-view/equipment-item-view.component';
import { CharacterNameViewComponent } from './components/subcomponents/character-name-view/character-name-view.component';
import { GodNameViewComponent } from './components/subcomponents/god-name-view/god-name-view.component';
import { StatusEffectViewComponent } from './components/subcomponents/status-effect-view/status-effect-view.component';
import { ItemMenuItemComponent } from './components/subcomponents/items/item-menu-item/item-menu-item.component';
import { ItemBeltItemComponent } from './components/subcomponents/items/item-belt-item/item-belt-item.component';
import { MenuOptionsComponent } from './components/layout/menu/menu-options/menu-options.component';
import { MenuDisplayComponent } from './components/layout/menu/menu-display/menu-display.component';
import { CharacterViewComponent } from './components/menu/character-view/character-view.component';
import { GodViewComponent } from './components/menu/god-view/god-view.component';
import { CurrentEquipmentViewComponent } from './components/subcomponents/current-equipment-view/current-equipment-view.component';
import { SettingsViewComponent } from './components/menu/settings-view/settings-view.component';
import { NotificationIconComponent } from './components/subcomponents/notification-icon/notification-icon.component';
import { IndividualStatusEffectViewComponent } from './components/subcomponents/status-effect-view/individual-status-effect-view/individual-status-effect-view.component';
import { ShopViewComponent } from './components/subcomponents/shop-view/shop-view.component';
import { ShoppingItemViewComponent } from './components/subcomponents/shopping-item-view/shopping-item-view.component';
import { ResourceViewComponent } from './components/menu/resource-view/resource-view.component';
import { ChthonicResetViewComponent } from './components/subcomponents/chthonic-reset-view/chthonic-reset-view.component';
import { ChthonicResetMenuViewComponent } from './components/subcomponents/chthonic-reset-view/chthonic-reset-menu-view/chthonic-reset-menu-view.component';
import { ChthonicRewardMenuViewComponent } from './components/subcomponents/chthonic-reset-view/chthonic-reward-menu-view/chthonic-reward-menu-view.component';
import { AchievementsViewComponent } from './components/menu/achievements-view/achievements-view.component';
import { IndividualAchievementViewComponent } from './components/menu/achievements-view/individual-achievement-view/individual-achievement-view.component';
import { AlchemyViewComponent } from './components/subcomponents/alchemy-view/alchemy-view.component';
import { GameLogEditorComponent } from './components/subcomponents/game-log-editor/game-log-editor.component';
import { OverdriveViewComponent } from './components/subcomponents/overdrive-view/overdrive-view.component';
import { ChangeGodViewComponent } from './components/menu/character-view/change-god-view/change-god-view.component';


@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    HeaderComponent,
    FooterComponent,
    ZoneNavigationComponent,
    PartyComponent,
    BattleComponent,
    EnemyViewComponent,
    AbilityViewComponent,
    EquipmentViewComponent,
    CustomTooltipComponent,
    ToolTipRendererDirective,
    EquipmentItemViewComponent,
    CharacterNameViewComponent,
    GodNameViewComponent,
    StatusEffectViewComponent,
    ItemMenuItemComponent,
    ItemBeltItemComponent,
    MenuOptionsComponent,
    MenuDisplayComponent,
    CharacterViewComponent,
    GodViewComponent,
    CurrentEquipmentViewComponent,
    SettingsViewComponent,
    NotificationIconComponent,
    IndividualStatusEffectViewComponent,
    ShopViewComponent,
    ShoppingItemViewComponent,
    ResourceViewComponent,
    ChthonicResetViewComponent,
    ChthonicResetMenuViewComponent,
    ChthonicRewardMenuViewComponent,
    AchievementsViewComponent,
    IndividualAchievementViewComponent,
    AlchemyViewComponent,
    GameLogEditorComponent,
    OverdriveViewComponent,
    ChangeGodViewComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatAutocompleteModule,
    MatBadgeModule,
    MatBottomSheetModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatStepperModule,
    MatDatepickerModule,
    MatDialogModule,
    MatDividerModule,
    MatExpansionModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatRippleModule,
    MatSelectModule,
    MatSidenavModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatSortModule,
    MatTableModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
    MatTreeModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
