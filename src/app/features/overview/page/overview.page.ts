import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { UserPhoto } from 'src/app/core/models/UserPhoto';
import { PhotoService } from 'src/app/core/services/photo.service';
import { UnsplashService } from '../services/unsplash.service';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.page.html',
  styleUrls: ['./overview.page.scss'],
})
export class OverviewPage implements OnInit {

  public showGenderOptions: Boolean = false;
  public selectedPhoto: UserPhoto = null;
  private randomPhotoInputValue: String = "human"

  constructor(private photoService: PhotoService, private alertController: AlertController, private unsplashService: UnsplashService) { }

  getPhotos() {
    return this.photoService.photos;
  }

  public selectPhoto(photo: UserPhoto) {
    this.selectedPhoto = photo;
  }

  async clearGallery() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Are you sure you want to clear all the photos?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          id: 'cancel-button',
          handler: () => {
            console.log('Cancelled');
          }
        }, {
          text: 'Yes',
          id: 'confirm-button',
          handler: () => {
            this.photoService.clearGallery();
          }
        }
      ]
    });

    await alert.present();
  }

  async loadRandomPhoto() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'What do you want a picture of?',
      inputs: [{
        name: 'input',
        type: 'text',
        value: this.randomPhotoInputValue,
        placeholder: 'Dog, humans, cats, etc'
      },],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Cancelled');
          }
        }, {
          text: 'Show me!',
          handler: async (data) => {
            this.randomPhotoInputValue = data.input;
            const url = await this.unsplashService.getRandomImage(data.input);
            this.photoService.addPhotoToGallery({
              filePath: url,
              data: url
            })
          }
        }
      ]
    });

    await alert.present();

  }
  async ngOnInit() {
  }

}
