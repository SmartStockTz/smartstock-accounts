import {
  AfterViewInit,
  Component,
  Inject,
  OnDestroy,
  OnInit
} from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { LogService, UserService } from "smartstock-core";

@Component({
  selector: "app-user-delete-dialog",
  template: `
    <div class="container">
      <div class="row">
        <div class="col-12">
          <mat-panel-title class="text-center">
            Your about to delete user : <b>{{ " " + data.username }}</b>
          </mat-panel-title>
        </div>
      </div>
      <div class="d-flex justify-content-center">
        <div class="align-self-center" style="margin: 8px">
          <button
            [disabled]="deleteProgress"
            color="primary"
            mat-button
            (click)="deleteUser(data)"
          >
            Delete
            <mat-progress-spinner
              *ngIf="deleteProgress"
              matTooltip="Delete in progress..."
              style="display: inline-block"
              mode="indeterminate"
              diameter="15"
              color="accent"
            ></mat-progress-spinner>
          </button>
        </div>
        <div class="alert-secondary" style="margin: 8px">
          <button
            [disabled]="deleteProgress"
            color="primary"
            mat-button
            (click)="cancel()"
          >
            Cancel
          </button>
        </div>
      </div>
      <p class="bg-danger" *ngIf="errorUserMessage">{{ errorUserMessage }}</p>
    </div>
  `,
  styleUrls: ["../styles/users.style.scss"]
})
export class UserDeleteDialogComponent
  implements OnInit, OnDestroy, AfterViewInit {
  deleteProgress = false;
  errorUserMessage: string;

  constructor(
    public dialogRef: MatDialogRef<UserDeleteDialogComponent>,
    private readonly userDatabase: UserService,
    private readonly logger: LogService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  async deleteUser(user: any): Promise<void> {
    this.errorUserMessage = undefined;
    this.deleteProgress = true;
    this.userDatabase
      .deleteUser(user)
      .then((value) => {
        this.dialogRef.close(user);
        this.deleteProgress = false;
        this.logger.i(value);
      })
      .catch((reason) => {
        this.errorUserMessage =
          reason && reason.message ? reason.message : reason.toString();
        this.deleteProgress = false;
      });
  }

  async cancel(): Promise<void> {
    this.dialogRef.close(null);
  }

  async ngAfterViewInit(): Promise<void> {}

  async ngOnDestroy(): Promise<void> {}

  async ngOnInit(): Promise<void> {}
}
