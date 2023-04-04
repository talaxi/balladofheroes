import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})

//docs: https://docs.patreon.com/
//guide I was using: https://www.npmjs.com/package/patreon
//TODO: IF YOU'RE GOING TO PURSUE THIS, YOU NEED TO RECREATE YOUR CLIENT ID/SECRET AND UPDATE GITHUB WITH IT. HAD TO RECREATE PATREON ACCOUNT

export class PatreonAccessService {
  //url = require('url');
  //patreon = require('patreon');
  patreonAPI: any;
  patreonOAuth: any;

  // Use the client id and secret you received when setting up your OAuth account
  CLIENT_ID: string;
  CLIENT_SECRET: string;
  patreonOAuthClient: any;

  // This should be one of the fully qualified redirect_uri you used when setting up your oauth account
  redirectURL = 'http://mypatreonapp.com/oauth/redirect';

  constructor() { }

  setupPatreonService() {
    /*this.patreonAPI = this.patreon.patreon;
    this.patreonOAuth = this.patreon.oauth;
    this.CLIENT_ID = environment.PATREONCLIENTID;
    this.CLIENT_SECRET = environment.PATREONCLIENTSECRET;
    this.patreonOAuthClient = this.patreonOAuth(this.CLIENT_ID, this.CLIENT_SECRET);*/
  }

  getPatronList() {
    //this.handleOAuthRedirectRequest();
  }

  handleOAuthRedirectRequest(request: any, response: any) {
    /*this.setupPatreonService();
    var oauthGrantCode = this.url.parse(request.url, true).query.code;
    console.log("Rolling");
  
    this.patreonOAuthClient
      .getTokens(oauthGrantCode, this.redirectURL)
      .then((tokensResponse: any) => {
        var patreonAPIClient = this.patreon.patreon(tokensResponse.access_token)
        console.log("API Client");
        console.log(patreonAPIClient);
        return patreonAPIClient('/current_user')
      })
      .then(function (result: any) {
        var store = result.store;
        console.log("Store");
        console.log(store);
        // store is a [JsonApiDataStore](https://github.com/beauby/jsonapi-datastore)
        // You can also ask for result.rawJson if you'd like to work with unparsed data
        response.end(store.findAll('user').map((user: { serialize: () => any; }) => user.serialize()));
      })
      .catch(function (err: any) {
        console.error('error!', err)
        response.end(err)
      })*/
  }
}
