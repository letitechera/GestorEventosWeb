import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LocationData } from '@models/location-data';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { LocationsApiService } from '@services/locations-api/locations-api.service';
import { AuthApiService } from '@services/auth-api/auth-api.service';
import { GeographicsApiService } from '@services/geographics-api/geographics-api.service';
import { NotifierService } from 'angular-notifier';

@Component({
  selector: 'app-locations-modal',
  templateUrl: './locations-modal.component.html',
  styleUrls: ['./locations-modal.component.scss']
})
export class LocationsModalComponent implements OnInit {
  public createFlag: boolean;
  public updateFlag: boolean;
  public locationsForm: FormGroup;
  public location: LocationData;
  public CAPACITY_REGEX = '[0-9]+';
  public submitted: boolean;
  public loading: boolean;
  public disabled: boolean;
  public cities: any[];
  public countries: any[];
  public selected: any;
  public selectedcity: any;

  constructor(public dialogRef: MatDialogRef<LocationsModalComponent>, private locationsApi: LocationsApiService,
    private geoApi: GeographicsApiService, private auth: AuthApiService, private notifier: NotifierService,
    private formBuilder: FormBuilder, @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    this.submitted = false;
    this.GetCountries();
    this.location = {
      Name: '',
      Address1: '',
      Address2: '',
      Capacity: 0,
      CityId: 0,
      Latitude: 0.00,
      Longitude: 0.00,
      Id: 0
    };
    if (this.data == null) {
      this.createFlag = true;
      this.createEmptyForm();
    } else {
      this.updateFlag = true;
      this.setCurrentForm();
    }
  }

  private GetCountries() {
    this.geoApi.getAllCountries().then((data: any[]) => {
      this.countries = data;
      this.selected = this.countries[0].id;
      if (data.length <= 1) {
        this.disabled = true;
      }
      this.GetCities(data[0].id);
    }, (err) => {
      console.log(err);
    });
  }

  private GetCities(countryId) {
    this.geoApi.getAllCities(countryId).then((city: any[]) => {
      this.cities = city;
      if (this.data != null) {
        this.selectedcity = this.data.City.id;
      } else {
        this.selectedcity = city[0].id;
      }
      console.log(city);
    }, (err) => {
      console.log(err);
    });
  }

  private createEmptyForm() {
    this.locationsForm = this.formBuilder.group({
      Name: ['', [Validators.required]],
      Address1: ['', [Validators.required]],
      Address2: [''],
      Capacity: ['', [Validators.required, Validators.pattern(this.CAPACITY_REGEX)]],
      City: [this.selectedcity, [Validators.required]],
      Country: ['', [Validators.required]],
    });
  }

  private setCurrentForm() {
    this.locationsForm = this.formBuilder.group({
      Name: [this.data.Name, [Validators.required]],
      Address1: [this.data.Address1, [Validators.required]],
      Address2: [this.data.Address2],
      Capacity: [this.data.Capacity, [Validators.required, Validators.pattern(this.CAPACITY_REGEX)]],
      City: [this.selectedcity, [Validators.required]],
      Country: [this.data.City.country.name, [Validators.required]],
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
    this.setLocationObject();
    this.locationsApi.postLocation(this.location).then((data: any[]) => {
      this.notifier.notify( 'success', '¡La locación se agregó con éxito!' );
      this.dialogRef.close('changed');
    }, (err) => {
      this.notifier.notify( 'error', 'Ups.. Ha ocurrido un error' );
      console.log(err);
    });
  }

  private editLocation() {
    this.setLocationObject();
    this.locationsApi.putLocation(this.location).then((data: any[]) => {
      this.notifier.notify( 'success', '¡La locación se editó con éxito!' );
      this.dialogRef.close('changed');
    }, (err) => {
      this.notifier.notify( 'error', 'Ups.. Ha ocurrido un error' );
      console.log(err);
    });
  }

  private setLocationObject() {
    this.location.Name = this.locationsForm.get('Name').value;
    this.location.Address1 = this.locationsForm.get('Address1').value;
    this.location.Address2 = this.locationsForm.get('Address2').value;
    this.location.Capacity = this.locationsForm.get('Capacity').value;
    this.location.CityId = this.locationsForm.get('City').value;
    this.location.Id = this.data != null ? this.data.Id : 0;
  }

  public close(): void {
    this.dialogRef.close();
  }

}
