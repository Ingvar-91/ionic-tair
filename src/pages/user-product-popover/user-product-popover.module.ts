import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UserProductPopoverPage } from './user-product-popover';

@NgModule({
  declarations: [
    UserProductPopoverPage,
  ],
  imports: [
    IonicPageModule.forChild(UserProductPopoverPage),
  ],
})
export class UserProductPopoverPageModule {}
