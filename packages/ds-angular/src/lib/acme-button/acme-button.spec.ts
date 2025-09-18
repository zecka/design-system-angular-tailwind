import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcmeButton } from './acme-button';

describe('AcmeButton', () => {
  let component: AcmeButton;
  let fixture: ComponentFixture<AcmeButton>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AcmeButton]
    })
      .compileComponents();

    fixture = TestBed.createComponent(AcmeButton);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
