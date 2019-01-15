import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LocationData } from '@models/location-data';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { LocationsApiService } from '@services/locations-api/locations-api.service';
import { AuthApiService } from '@services/auth-api/auth-api.service';

@Component({
  selector: 'app-locations-modal',
  templateUrl: './locations-modal.component.html',
  styleUrls: ['./locations-modal.component.scss']
})
export class LocationsModalComponent implements OnInit {
  public createFlag: boolean
  public updateFlag: boolean
  public locationsForm: FormGroup;
  public location: LocationData;
  public CAPACITY_REGEX = '^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$';
  public submitted: boolean;
  public loading: boolean;

  constructor(public dialogRef: MatDialogRef<LocationsModalComponent>, private locationsApi: LocationsApiService,
    private auth: AuthApiService, private formBuilder: FormBuilder, @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    this.auth.checkSession();
    this.submitted = false;
    this.location = {
      Name: '',
      Address1: '',
      Address2: '',
      Capacity: 0,
      City: '',
      Country: '',
      PrettyLocationAddress: '',
      Latitude: null,
      Longitude: null,
      Id: 0
    };
    if (this.data == null) {
      this.createFlag = true;
      this.createEmptyForm();
    }
    else {
      this.updateFlag = true;
      this.setCurrentForm();
    }
  }

  
  private createEmptyForm() {
    this.locationsForm = this.formBuilder.group({
      Name: ['', [Validators.required]],
      Address1: ['', [Validators.required]],
      Address2: [''],
      Capacity: ['', [Validators.required, Validators.pattern(this.CAPACITY_REGEX)]],
      City: ['', [Validators.required]],
      Country: ['', [Validators.required]],
    });
  }

  private setCurrentForm() {
    this.locationsForm = this.formBuilder.group({
      Name: [this.data.Name, [Validators.required]],
      Address1: [this.data.Address1, [Validators.required]],
      Address2: [this.data.Address2],
      Capacity: [this.data.Capacity, [Validators.required, Validators.pattern(this.CAPACITY_REGEX)]],
      City: [this.data.City, [Validators.required]],
      Country: [this.data.Country, [Validators.required]],
    });
  }

  public submitLocation() {
    this.submitted = true;
    if (!this.locationsForm.valid) {
      return;
    }
    this.loading = true;
    if (this.createFlag) {
      this.addLocation();
    } else {
      this.editLocation();
    }
  }

  private addLocation() {
    this.postLocation().then((data: any[]) => {
      this.dialogRef.close('changed');
    }, (err) => {
      console.log(err);
    });
  }

  private postLocation(): Promise<any> {
    this.setLocationObject();
    return new Promise<any>((resolve, reject) => {
      this.locationsApi.postLocation(this.location).subscribe((data) => {
        resolve(data);
      }, (err) => {
        console.log(err);
        reject(null);
      });
    });
  }

  private editLocation() {
    this.putLocation().then((data: any[]) => {
      console.log(data);
      this.dialogRef.close('changed');
    }, (err) => {
      console.log(err);
    });
  }

  private putLocation(): Promise<any> {
    this.setLocationObject();
    return new Promise<any>((resolve, reject) => {
      this.locationsApi.putLocation(this.location).subscribe((data) => {
        console.log(data);
        resolve(data);
      }, (err) => {
        console.log(err);
        reject(null);
      });
    });
  }

  private setLocationObject() {
    this.location.Name = this.locationsForm.get('Name').value;
    this.location.Address1 = this.locationsForm.get('Address1').value;
    this.location.Address2 = this.locationsForm.get('Address2').value;
    this.location.Capacity = this.locationsForm.get('Capacity').value;
    this.location.City = this.locationsForm.get('City').value;
    this.location.Country = this.locationsForm.get('Country').value;
    this.location.Id = this.data != null ? this.data.Id : 0;
  }

  public close(): void {
    this.dialogRef.close();
  }

}
