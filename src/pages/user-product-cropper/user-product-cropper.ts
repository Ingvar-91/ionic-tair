import {Component, ViewChild} from '@angular/core';
import {IonicPage, NavController, NavParams, ViewController} from 'ionic-angular';
import {SearchPage} from "../search/search";
import {AngularCropperjsComponent} from "angular-cropperjs";

/**
 * Generated class for the UserProductCropperPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-user-product-cropper',
  templateUrl: 'user-product-cropper.html',
})
export class UserProductCropperPage {

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController,
  ) {
    this.cropperOptions = {
      dragMode: 'move',
      aspectRatio: 1,
      autoCrop: true,
      movable: true,
      zoomable: true,
      scalable: true,
      rotatable: true,
      cropBoxResizable: false,
      cropBoxMovable: false,
      autoCropArea: 1,
    };
  }

  protected searchPage = SearchPage;
  image = this.navParams.get('image');
  index = this.navParams.get('index');

  cropperOptions;
  @ViewChild('angularCropper') public angularCropper: AngularCropperjsComponent;
  scaleValY = 1;
  scaleValX = 1;

  ionViewDidLoad() {

  }

  /* angularCropper */
  croperRotate() {
    this.angularCropper.cropper.rotate(90);
  }

  cropperZoom(zoomIn: boolean) {
    let factor = zoomIn ? 0.1 : -0.1;
    this.angularCropper.cropper.zoom(factor);
  }

  cropperScaleY() {
    this.scaleValY = this.scaleValY * -1;
    this.angularCropper.cropper.scaleY(this.scaleValY);
  }

  cropperScaleX() {
    this.scaleValX = this.scaleValX * -1;
    this.angularCropper.cropper.scaleX(this.scaleValX);
  }

  cropperMove(x: number, y: number) {
    this.angularCropper.cropper.move(x, y);
  }

  cropperSave() {
    let base64: string = this.angularCropper.cropper.getCroppedCanvas().toDataURL('image/jpeg', (100 / 100));
    this.viewCtrl.dismiss({image: base64, index: this.index});
  }

  cancel() {
    this.viewCtrl.dismiss();
  }

}
