import {Component, ViewChild} from '@angular/core';
import {
  AlertController,
  IonicPage,
  LoadingController,
  ModalController,
  NavController,
  NavParams,
  ToastController
} from 'ionic-angular';
import {BasePage} from "../../shared/base.page";
import {UserProductsService} from "../../shared/servises/user-products.servise";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {SearchPage} from "../search/search";
import {UserProductCategoriesPage} from "../user-product-categories/user-product-categories";
import {UserProductCharsPage} from "../user-product-chars/user-product-chars";
import { Camera, CameraOptions } from '@ionic-native/camera';
import * as moment from "moment";
import {Crop} from "@ionic-native/crop";

/**
 * Generated class for the UserProductPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-user-product',
  templateUrl: 'user-product.html',
})
export class UserProductPage extends BasePage  {

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    protected alertCtrl: AlertController,
    protected userProductsService: UserProductsService,
    public modalCtrl: ModalController,
    public loadingCtrl: LoadingController,
    private camera: Camera,
    private toastCtrl: ToastController,
    private crop: Crop,
  ) {
    super(alertCtrl);
  }

  form: FormGroup = new FormGroup({
    'title': new FormControl('', [Validators.required, Validators.minLength(4)]),
    'text': new FormControl(''),
    'price': new FormControl(''),
    'discount': new FormControl(''),
    'start_discount': new FormControl(''),
    'end_discount': new FormControl('')
  });
  protected searchPage = SearchPage;
  params = this.navParams.get('params');
  shop = this.navParams.get('shop');
  product;
  categories;
  productData: ProductData = {
    category_id: '',
    shop_id: '',
    shop_type_id: '',
    images: '',
    chars: []
  };
  breadcrumb;
  chars = [];
  maxDataDiscount;
  imagesProducts = [];

  imgCrop;

  ionViewDidLoad() {
    this.maxDataDiscount = moment().add(48, 'M').format('YYYY-MM-DD');
    this.checkNetwork(this.navCtrl);

    if(this.params && this.params.product) {
      this.subs$[this.subs$.length] =
        this.userProductsService.getUserProduct(
          this.params.product.id
        )
        .subscribe((data) => {
          if(data) {
            this.product = data.product;
            this.imagesProducts = data.product.images;
            this.categories = data.categories;
            this.breadcrumb = data.breadcrumb;
            this.chars = this.getCharsSelected(data.chars);

            let discount = this.product.discount;
            let price = this.product.price;
            if(!Number(discount)) {
              discount = '';
            }
            if(!Number(price)) {
              price = '';
            }
            this.form.setValue({
              title: this.product.title,
              text: this.product.text,
              price: price,
              discount: discount,
              start_discount: this.product.start_discount,
              end_discount: this.product.end_discount
            });

            this.productData.shop_id = data.product.shop_id;
            this.productData.category_id = data.product.category_id;
            this.productData.shop_type_id = data.product.shop_type_id;
          }
          this.disablePreloader();
        });
    } else {
      this.productData.shop_id = this.shop.shop_id;
      this.disablePreloader();
    }
  }

  showCamera(): void {
    let loading = this.loadingCtrl.create({
      content: 'Пожалуйста подождите...'
    });
    loading.present();

    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    }

    this.camera.getPicture(options).then((imageData) => {
      // imageData is either a base64 encoded string or a file URI
      // If it's base64 (DATA_URL):
      const base64Image = 'data:image/jpeg;base64,' + imageData;

      const formData = new FormData();
      formData.append('image', base64Image);

      this.subs$[this.subs$.length] =
        this.userProductsService.addImageProduct(formData)
          .subscribe((data) => {
            this.imgCrop = base64Image;
            if(data){
              this.imagesProducts.push(
                {fullPath: data.fullPath, path: data.path, fileName: data.fileName}
              );
            }
            loading.dismiss();
          },
          error => {
            alert(error);
          },
          () => {}
          );

    }, (error) => {
      alert(error);
      loading.dismiss();
    });

  }

  showGallery(): void {
    let loading = this.loadingCtrl.create({
      content: 'Пожалуйста подождите...'
    });
    loading.present();

    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY
    }

    this.camera.getPicture(options).then((imageData) => {
      // imageData is either a base64 encoded string or a file URI
      // If it's base64 (DATA_URL):
      const base64Image = 'data:image/jpeg;base64,' + imageData;

      this.imgCrop = base64Image;

      const formData = new FormData();
      formData.append('image', base64Image);

      this.subs$[this.subs$.length] =
        this.userProductsService.addImageProduct(formData)
          .subscribe((data) => {
            if(data){
              this.imagesProducts.push(
                {fullPath: data.fullPath, path: data.path, fileName: data.fileName}
              );
            }

            loading.dismiss();
          },
          error => {
            alert(error)
          },
          () => {}
          );

    }, (error) => {
      alert(error)
      loading.dismiss();
    });

  }

  cropImage(): void {
    let options = {
      quality: 100,
      targetHeight: -1,
      targetWidth: -1
    };

    this.crop.crop(this.imgCrop, {quality: 75})
      .then(
        newImage => {
          //alert('ok')
        },
        error => {
          alert(error)
        }
      );
  }

  removeImage(fileName: string, index: number): void {
    let loading = this.loadingCtrl.create({
      content: 'Пожалуйста подождите...'
    });
    loading.present();

    this.subs$[this.subs$.length] =
      this.userProductsService.removeImageProduct(fileName)
        .subscribe((data) => {
          this.imagesProducts.splice(index, 1);
          loading.dismiss();
        });
  }

  save() {
    const formData = new FormData();
    formData.append('title', this.form.get('title').value);
    formData.append('text', this.form.get('text').value);
    formData.append('category_id', String(this.productData.category_id));
    formData.append('shop_id', String(this.productData.shop_id));
    formData.append('shop_type_id', String(this.productData.shop_type_id));
    formData.append('status', String(1));
    formData.append('price', String(this.form.get('price').value));
    formData.append('discount', String(this.form.get('discount').value));

    let start_discount = moment().add(3, 'M').format('YYYY-MM-DD HH:mm:ss');
    if(!this.form.get('start_discount').value) {

    }
    formData.append('start_discount', String(this.form.get('start_discount').value));
    formData.append('end_discount', String(this.form.get('end_discount').value));

    const date_remove = moment().add(3, 'M').format('YYYY-MM-DD HH:mm:ss');
    formData.append('date_remove', String(date_remove));

    const imagesArr = [];
    let images = '';
    if(this.imagesProducts && this.imagesProducts.length) {
      this.imagesProducts.forEach((item) => {
        imagesArr.push(item.fileName);
      });
      images = imagesArr.join('|');
      this.productData.images = images;
    }
    formData.append('images', String(images));

    /* CHARS */
    let chars = [];
    for (let i = 0; i < this.chars.length; i++) {
      if(this.chars[i] && this.chars[i].child){
        for (let item of this.chars[i].child) {
          if (item.check == true) {
            if(!chars[i]){
              chars[i] = [];
            }
            chars[i].push(item.id);
          }
        }
      }
    }
    chars = chars.filter((el) => {
      return el != null;
    });
    /**/
    formData.append('chars', JSON.stringify(chars));

    /**/
    if(!formData.get('category_id')) {
      let toastCategory = this.toastCtrl.create({
        message: 'Выберите категорию',
        duration: 3000,
      });
      toastCategory.present();
      return;
    }
    if(!formData.get('images')) {
      let toastImages = this.toastCtrl.create({
        message: 'Добавьте изображение',
        duration: 3000,
      });
      toastImages.present();
      return;
    }
    /**/

    let loading = this.loadingCtrl.create({
      content: 'Пожалуйста подождите...'
    });
    loading.present();

    if(this.params && this.params.product) {
      formData.append('product_id', this.params.product.id);
      this.subs$[this.subs$.length] =
        this.userProductsService.editProduct(formData)
          .subscribe((data) => {
            let toast = this.toastCtrl.create({
              message: 'Данные успешно изменены',
              duration: 3000,
            });
            toast.present();
            loading.dismiss();


          });
    } else {
      this.subs$[this.subs$.length] =
        this.userProductsService.addProduct(formData)
          .subscribe((data) => {
            let toast = this.toastCtrl.create({
              message: 'Данные успешно добавлены',
              duration: 3000,
            });
            toast.present();
            loading.dismiss();
            this.form.reset();

            this.productData.category_id = '';
            this.chars = [];
            this.imagesProducts = [];
            this.breadcrumb = '';
          });
    }


  }


  showCategories() {
    let modal = this.modalCtrl.create(UserProductCategoriesPage, {categories: this.categories}, {
      cssClass: "modal-full-screen"
    });
    modal.present();

    modal.onDidDismiss(data => {
      if(data && data.category){
        let loading = this.loadingCtrl.create({
          content: 'Пожалуйста подождите...'
        });
        loading.present();

        this.productData.category_id = data.category.id;
        this.breadcrumb = data.breadcrumb;

        this.subs$[this.subs$.length] =
          this.userProductsService.getCharsProduct(
            this.productData.category_id
          )
          .subscribe((data) => {
            this.chars = data;

            loading.dismiss();
          });
      }
    });
  }

  showChars(item) {
    let modal = this.modalCtrl.create(UserProductCharsPage, {chars: item}, {
      cssClass: "modal-full-screen"
    });
    modal.present();

    modal.onDidDismiss(data => {
      if(data) {
        item.selected = data.selected;
      }
    });

  }

  getCharsSelected(chars) {
    for (let char of chars) {
      for (let item of char.child) {
        if(!char.selected) {
          char.selected = [];
        }
        if (item.check) {
          char.selected.push(item.title);
        }
      }
      if(char.selected.length) {
        char.selected.join(', ');
      } else {
        char.selected = '';
      }
    }
    return chars;
  }

}

interface ProductData {
  category_id: number | string;
  shop_id: number | string;
  shop_type_id: number | string;
  images: string | string;
  chars: number[];
}
