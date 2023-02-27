import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlacesResultsTableComponent } from './places-results-table.component';

describe('PlacesResultsTableComponent', () => {
  let component: PlacesResultsTableComponent;
  let fixture: ComponentFixture<PlacesResultsTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlacesResultsTableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlacesResultsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
