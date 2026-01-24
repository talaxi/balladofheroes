import { ChangeDetectorRef, Component } from '@angular/core';
import { DeviceDetectorService } from 'ngx-device-detector';
import { GlobalService } from 'src/app/services/global/global.service';
import { UtilityService } from 'src/app/services/utility/utility.service';
import { Platform } from '@ionic/angular';
import 'cordova-plugin-purchase';

@Component({
  selector: 'app-support-view',
  templateUrl: './support-view.component.html',
  styleUrls: ['./support-view.component.css']
})
export class SupportViewComponent {
  isMobile = false;
  isKongregate = false;
  isMainSite = false;
  isAndroid = false;
  store = CdvPurchase.store;
  products: CdvPurchase.Product[];

  constructor(private globalService: GlobalService, private deviceDetectorService: DeviceDetectorService, private utilityService: UtilityService,
    private plt: Platform, private ref: ChangeDetectorRef) {      
      this.plt.ready().then(() => {      
      this.registerProducts();
      this.setupListeners();
      this.store.verbosity = CdvPurchase.LogLevel.DEBUG;

      // Get the real product information
      this.store.ready(() => {
        this.ref.detectChanges();
      });
    });
  }

  ngOnInit() {  
    this.isMobile = this.deviceDetectorService.isMobile();
    this.isKongregate = this.utilityService.isKongregate();
    this.isMainSite = this.utilityService.isMainSite();
  }

  isSupporterAlreadyPurchased() {
    return this.globalService.globalVar.isSubscriber;
  }

  registerProducts() {
    const { ProductType, Platform, LogLevel, Product, VerifiedReceipt } = CdvPurchase; // shortcuts

    this.store.register({
      id: this.utilityService.SUPPORTER_KEY,
      type: ProductType.NON_CONSUMABLE,
      platform: Platform.GOOGLE_PLAY,      
    });
    
    this.store.initialize([Platform.GOOGLE_PLAY]);

    this.products = this.store.products;

    this.store.update();
  }

  setupListeners() {
    // General query to all products
    this.store.when()    
    .approved(transaction => {
      this.globalService.setAsSubscriber(new Date());
      // verify approved transactions
      transaction.verify();
    })
    .verified(receipt => {
      // finish transactions from verified receipts
      receipt.finish();      
    });
  }

  androidPurchase() {
    const store = CdvPurchase.store;
    const subscriber = store.products.find(p => p.id === this.utilityService.SUPPORTER_KEY);

    if (subscriber === undefined)
      return;

    const offer = store.get(subscriber.id, subscriber.platform)?.getOffer();

    if (offer) store.order(offer);
  }    
}
