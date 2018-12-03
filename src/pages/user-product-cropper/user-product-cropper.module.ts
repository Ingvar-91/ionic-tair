import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UserProductCropperPage } from './user-product-cropper';
import {ImgPreloadModule} from "../../components/img-preload/img-preload.module";
import {AngularCropperjsModule} from "angular-cropperjs";

@NgModule({
  declarations: [
    UserProductCropperPage,
  ],
  imports: [
    IonicPageModule.forChild(UserProductCropperPage),
    ImgPreloadModule,
    AngularCropperjsModule,
  ],
})
export class UserProductCropperPageModule {}
