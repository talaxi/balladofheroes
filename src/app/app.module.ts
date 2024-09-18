import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { HttpClientModule } from '@angular/common/http';

import { InAppPurchase2 } from '@awesome-cordova-plugins/in-app-purchase-2/ngx';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MainComponent } from './components/main/main/main.component';
import { HeaderComponent } from './components/layout/header/header.component';
import { FooterComponent } from './components/layout/footer/footer.component';
import { ZoneNavigationComponent } from './components/layout/zone-navigation/zone-navigation.component';
import { PartyComponent } from './components/layout/party/party.component';
import { BattleComponent } from './components/layout/battle/battle.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatLegacyAutocompleteModule as MatAutocompleteModule} from '@angular/material/legacy-autocomplete';
import {MatBadgeModule} from '@angular/material/badge';
import {MatBottomSheetModule} from '@angular/material/bottom-sheet';
import {MatLegacyButtonModule as MatButtonModule} from '@angular/material/legacy-button';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {MatLegacyCardModule as MatCardModule} from '@angular/material/legacy-card';
import {MatLegacyCheckboxModule as MatCheckboxModule} from '@angular/material/legacy-checkbox';
import {MatLegacyChipsModule as MatChipsModule} from '@angular/material/legacy-chips';
import {MatStepperModule} from '@angular/material/stepper';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatDialogModule as MatDialogModule} from '@angular/material/dialog';
import {MatDividerModule} from '@angular/material/divider';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatIconModule} from '@angular/material/icon';
import {MatLegacyInputModule as MatInputModule} from '@angular/material/legacy-input';
import {MatLegacyListModule as MatListModule} from '@angular/material/legacy-list';
import {MatMenuModule as MatMenuModule} from '@angular/material/menu';
import {MatNativeDateModule, MatRippleModule} from '@angular/material/core';
import {MatLegacyPaginatorModule as MatPaginatorModule} from '@angular/material/legacy-paginator';
import {MatProgressBarModule as MatProgressBarModule} from '@angular/material/progress-bar';
import {MatProgressSpinnerModule as MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatLegacyRadioModule as MatRadioModule} from '@angular/material/legacy-radio';
import {MatLegacySelectModule as MatSelectModule} from '@angular/material/legacy-select';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatLegacySliderModule as MatSliderModule} from '@angular/material/legacy-slider';
import {MatLegacySlideToggleModule as MatSlideToggleModule} from '@angular/material/legacy-slide-toggle';
import {MatLegacySnackBarModule as MatSnackBarModule} from '@angular/material/legacy-snack-bar';
import {MatSortModule} from '@angular/material/sort';
import {MatLegacyTableModule as MatTableModule} from '@angular/material/legacy-table';
import {MatLegacyTabsModule as MatTabsModule} from '@angular/material/legacy-tabs';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatLegacyTooltipModule as MatTooltipModule} from '@angular/material/legacy-tooltip';
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
import { LogViewComponent } from './components/subcomponents/log-view/log-view.component';
import { ResourceItemViewComponent } from './components/menu/resource-view/resource-item-view/resource-item-view.component';
import { UpdateKeybindsViewComponent } from './components/menu/settings-view/update-keybinds-view/update-keybinds-view.component';
import { ColiseumViewComponent } from './components/subcomponents/coliseum-view/coliseum-view.component';
import { AltarOptionsViewComponent } from './components/subcomponents/altar-options-view/altar-options-view.component';
import { AltarComponent } from './components/layout/battle/altar/altar.component';
import { ChangeClassViewComponent } from './components/menu/character-view/change-class-view/change-class-view.component';
import { AltarViewComponent } from './components/subcomponents/altar-options-view/altar-view/altar-view.component';
import { ResourceRequiredViewComponent } from './components/subcomponents/shopping-item-view/resource-required-view/resource-required-view.component';
import { AltarOverviewComponent } from './components/layout/zone-navigation/altar-overview/altar-overview.component';
import { ConfirmationBoxComponent } from './components/subcomponents/utility/confirmation-box/confirmation-box.component';
import { FollowerOverviewViewComponent } from './components/subcomponents/followers-view/follower-overview-view/follower-overview-view.component';
import { FollowerSearchViewComponent } from './components/subcomponents/followers-view/follower-search-view/follower-search-view.component';
import { FollowerPrayerViewComponent } from './components/subcomponents/followers-view/follower-prayer-view/follower-prayer-view.component';
import { FollowerDefaultViewComponent } from './components/subcomponents/followers-view/follower-default-view/follower-default-view.component';
import { QuickViewComponent } from './components/mobile-components/quick-view/quick-view.component';
import { MainOverviewComponent } from './components/layout/zone-navigation/main-overview/main-overview.component';
import { AlchemyOverviewComponent } from './components/layout/zone-navigation/alchemy-overview/alchemy-overview.component';
import { ItemBeltOverviewComponent } from './components/layout/zone-navigation/item-belt-overview/item-belt-overview.component';
import { GameTextOverviewComponent } from './components/layout/zone-navigation/game-text-overview/game-text-overview.component';
import { QuickViewOptionsComponent } from './components/menu/settings-view/quick-view-options/quick-view-options.component';
import { OverlayNotificationOptionsComponent } from './components/menu/settings-view/overlay-notification-options/overlay-notification-options.component';
import { ProfessionsViewComponent } from './components/menu/professions-view/professions-view.component';
import { SlotMenuViewComponent } from './components/equipment-view/slot-menu-view/slot-menu-view.component';
import { JewelcraftingViewComponent } from './components/subcomponents/jewelcrafting-view/jewelcrafting-view.component';
import { JewelcraftingOverviewComponent } from './components/layout/zone-navigation/jewelcrafting-overview/jewelcrafting-overview.component';
import { BestiaryViewComponent } from './components/menu/bestiary-view/bestiary-view.component';
import { EnemyDescriptionViewComponent } from './components/subcomponents/enemy-view/enemy-description-view/enemy-description-view.component';
import { AutoProgressOptionsComponent } from './components/layout/zone-navigation/auto-progress-options/auto-progress-options.component';
import { MeleteViewComponent } from './components/subcomponents/melete-view/melete-view.component';
import { MeleteActionButtonComponent } from './components/subcomponents/utility/melete-action-button/melete-action-button.component';
import { SupportViewComponent } from './components/subcomponents/support-view/support-view.component';
import { FilterItemsViewComponent } from './components/subcomponents/filter-items-view/filter-items-view.component';
import { OlympicResetViewComponent } from './components/subcomponents/olympic-reset-view/olympic-reset-view.component';
import { OlympicResetMenuViewComponent } from './components/subcomponents/olympic-reset-view/olympic-reset-menu-view/olympic-reset-menu-view.component';
import { OlympicRewardMenuViewComponent } from './components/subcomponents/olympic-reset-view/olympic-reward-menu-view/olympic-reward-menu-view.component';
import { TrialsViewComponent } from './components/subcomponents/trials-view/trials-view.component';
import { LoadoutsViewComponent } from './components/subcomponents/loadouts-view/loadouts-view.component';
import { AddLoadoutComponent } from './components/subcomponents/loadouts-view/add-loadout/add-loadout.component';
import { SelectLoadoutCharacterComponent } from './components/subcomponents/loadouts-view/select-loadout-character/select-loadout-character.component';
import { SelectLoadoutGodComponent } from './components/subcomponents/loadouts-view/select-loadout-god/select-loadout-god.component';
import { SelectLoadoutEquipmentComponent } from './components/subcomponents/loadouts-view/select-loadout-equipment/select-loadout-equipment.component';
import { TutorialBoxComponent } from './components/subcomponents/utility/tutorial-box/tutorial-box.component';
import { CalculatorOverviewComponent } from './components/layout/zone-navigation/calculator-overview/calculator-overview.component';
import { UpdateAltarAutoComponent } from './components/menu/settings-view/update-altar-auto/update-altar-auto.component';
import { OpenShopViewComponent } from './components/layout/zone-navigation/open-shop-view/open-shop-view.component';
import { TimeFragmentOverviewComponent } from './components/layout/zone-navigation/time-fragment-overview/time-fragment-overview.component';
import { TimeFragmentViewComponent } from './components/subcomponents/time-fragment-view/time-fragment-view.component';

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
    ChangeGodViewComponent,
    LogViewComponent,
    ResourceItemViewComponent,
    UpdateKeybindsViewComponent,
    ColiseumViewComponent,
    AltarOptionsViewComponent,
    AltarComponent,
    ChangeClassViewComponent,
    AltarViewComponent,
    ResourceRequiredViewComponent,
    AltarOverviewComponent,
    ConfirmationBoxComponent,
    FollowerOverviewViewComponent,
    FollowerSearchViewComponent,
    FollowerPrayerViewComponent,
    FollowerDefaultViewComponent,
    QuickViewComponent,
    MainOverviewComponent,
    AlchemyOverviewComponent,
    ItemBeltOverviewComponent,
    GameTextOverviewComponent,
    QuickViewOptionsComponent,
    OverlayNotificationOptionsComponent,
    ProfessionsViewComponent,
    SlotMenuViewComponent,
    JewelcraftingViewComponent,
    JewelcraftingOverviewComponent,
    BestiaryViewComponent,
    EnemyDescriptionViewComponent,
    AutoProgressOptionsComponent,
    MeleteViewComponent,
    MeleteActionButtonComponent,
    SupportViewComponent,
    FilterItemsViewComponent,
    OlympicResetViewComponent,
    OlympicResetMenuViewComponent,
    OlympicRewardMenuViewComponent,
    TrialsViewComponent,
    LoadoutsViewComponent,
    AddLoadoutComponent,
    SelectLoadoutCharacterComponent,
    SelectLoadoutGodComponent,
    SelectLoadoutEquipmentComponent,
    TutorialBoxComponent,
    CalculatorOverviewComponent,
    UpdateAltarAutoComponent,
    OpenShopViewComponent,
    TimeFragmentOverviewComponent,
    TimeFragmentViewComponent,    
  ],
  imports: [
    BrowserModule,
    FormsModule,
    IonicModule,
    HttpClientModule,
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
  providers: [InAppPurchase2],
  bootstrap: [AppComponent]
})
export class AppModule { }
