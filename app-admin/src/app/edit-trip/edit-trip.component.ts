// src/app/edit-trip/edit-trip.component.ts

import { Component, OnInit }                            from '@angular/core';
import { CommonModule }                                 from '@angular/common';
import { Router }                                       from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule
}                                                       from '@angular/forms';
import { TripDataService }                              from '../services/trip-data.service';
import { Trip }                                         from '../models/trip';

@Component({
  selector:    'app-edit-trip',
  standalone:  true,
  imports:     [CommonModule, ReactiveFormsModule],
  templateUrl: './edit-trip.component.html',
  styleUrls:   ['./edit-trip.component.css']
})
export class EditTripComponent implements OnInit {
  public editForm!: FormGroup;
  public trip!: Trip;
  public submitted = false;
  public message: string = '';

  constructor(
    private formBuilder: FormBuilder,
    private router:      Router,
    private tripDataService: TripDataService
  ) {}

  ngOnInit(): void {
    // Retrieve stashed trip ID
    const tripCode = localStorage.getItem('tripCode');
    if (!tripCode) {
      alert("Something wrong, couldn’t find where I stashed tripCode!");
      this.router.navigate(['']);
      return;
    }

    console.log('EditTripComponent::ngOnInit');
    console.log('tripCode: ' + tripCode);

    // Build the form
    this.editForm = this.formBuilder.group({
      _id:         [''],
      code:        [tripCode, Validators.required],
      name:        ['', Validators.required],
      length:      ['', Validators.required],
      start:       ['', Validators.required],
      resort:      ['', Validators.required],
      perPerson:   ['', Validators.required],
      image:       ['', Validators.required],
      description: ['', Validators.required]
    });

    // Lookup existing record and populate the form
    this.tripDataService.getTrip(tripCode).subscribe({
      next: (value: any) => {
        this.trip = value;

        // Convert "2021-03-15T08:00:00.000Z" into "2021-03-15"
        const formattedDate = new Date(value[0].start)
              .toISOString()
              .substring(0, 10);

              this.editForm.patchValue({
                    ...value[0],
                 start: formattedDate    
               });

        this.message = 'Trip: ' + tripCode + ' retrieved';
        console.log(this.message);
      },
      error: (error: any) => {
        console.error('Error: ' + error);
        this.message = 'Error retrieving trip';
      }
    });
  }

  public onSubmit(): void {
    this.submitted = true;

    if (this.editForm.valid) {
      this.tripDataService.updateTrip(this.editForm.value).subscribe({
        next: (value: any) => {
          console.log(value);
          this.router.navigate(['']);
        },
        error: (error: any) => {
          console.error('Error: ' + error);
          this.message = 'Error updating trip';
        }
      });
    }
  }

  // get the form short name to access the form fields
  get f() {
    return this.editForm.controls;
  }
}
