import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlacesResultsComponent } from './places-results.component';

describe('PlacesResultsComponent', () => {
  let component: PlacesResultsComponent;
  let fixture: ComponentFixture<PlacesResultsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlacesResultsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlacesResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
