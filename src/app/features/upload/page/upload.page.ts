import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserPhoto } from 'src/app/core/models/UserPhoto';
import { PhotoService } from 'src/app/core/services/photo.service';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.page.html',
  styleUrls: ['./upload.page.scss'],
})
export class UploadPage implements OnInit {

  public lastPhoto: UserPhoto | null = null;

  constructor(private photoService: PhotoService, private router: Router) {}

  public async capturePhoto() {
    try {
      this.lastPhoto = await this.photoService.capturePhoto();
      this.router.navigate(["angular-ionic/overview"])
    }
    catch {
      alert("Failed taking a picture");
    }
  }

  async ngOnInit() {
    
  }
}
