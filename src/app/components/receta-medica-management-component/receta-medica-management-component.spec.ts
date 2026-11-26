import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecetaMedicaManagementComponent } from './receta-medica-management-component';

describe('RecetaMedicaManagementComponent', () => {
  let component: RecetaMedicaManagementComponent;
  let fixture: ComponentFixture<RecetaMedicaManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecetaMedicaManagementComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RecetaMedicaManagementComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
