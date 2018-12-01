import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UserProductPage } from './user-product';
import {ImgPreloadModule} from "../../components/img-preload/img-preload.module";
import {AngularCropperjsModule} from "angular-cropperjs";

@NgModule({
  declarations: [
    UserProductPage,
  ],
  imports: [
    IonicPageModule.forChild(UserProductPage),
    ImgPreloadModule,
    AngularCropperjsModule ,
  ],
})
export class UserProductPageModule {}
