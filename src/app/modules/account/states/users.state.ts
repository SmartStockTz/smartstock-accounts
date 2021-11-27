import {Injectable} from '@angular/core';
import {BehaviorSubject, firstValueFrom} from 'rxjs';
import {UserDeleteDialogComponent} from '../components/user-delete-dialog.component';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {UserModel} from '../models/user.model';

@Injectable({
  providedIn: 'root'
})

export class UsersState {
  selectedUser: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor(private readonly matDialog: MatDialog,
              private readonly matSnackBar: MatSnackBar) {
  }

  async deleteUsers(user: any): Promise<any> {
    const dialogObserver = this.matDialog.open(UserDeleteDialogComponent, {
      data: user,
      disableClose: true
    }).afterClosed();
    return firstValueFrom(dialogObserver).then(_ => {
      if (_) {
        this.matSnackBar.open('User deleted', 'Ok', {
          duration: 2000
        });
        return user;
      } else {
        this.matSnackBar.open('User not deleted', 'Ok', {
          duration: 2000
        });
        return {id: 'f'};
      }
    });
  }

  getShops(user: UserModel): string {
    const shops = [...user.shops, {
      businessName: user.businessName,
    }];
    return shops.reduce((previousValue, currentValue) => {
      previousValue.push(currentValue.businessName);
      return previousValue;
    }, []).join(',');
  }

  dispose(): void {
    this.selectedUser.next(null);
  }
}
