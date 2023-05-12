import { EventEmitter, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProfilePictureServiceService {
  private profilePhotoSubject: BehaviorSubject<string> = new BehaviorSubject<string>('assets/images/employee-default-pfp.png');
  profilePhoto$ = this.profilePhotoSubject.asObservable();

  updateProfilePhoto(photoUrl: string): void {
    this.profilePhotoSubject.next(photoUrl);
  }
}
