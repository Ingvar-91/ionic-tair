import { Component } from '@angular/core';
import {IonicPage, NavController, NavParams, ViewController} from 'ionic-angular';

/**
 * Generated class for the UserProductPopoverPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-user-product-popover',
  templateUrl: 'user-product-popover.html',
})
export class UserProductPopoverPage {

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController,
  ) {}

  item = this.navParams.get('item');
  index = this.navParams.get('index');

  ionViewDidLoad() {

  }

  remove() {
    this.viewCtrl.dismiss({remove: true});
  }

  edit() {
    this.viewCtrl.dismiss({edit: true});
  }

}
