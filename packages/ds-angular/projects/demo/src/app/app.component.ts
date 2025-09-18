import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AcmeCombobox } from '@acme/ds-angular';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, AcmeCombobox],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'demo';

  options = ['Option 1', 'Option 2', 'Option 3'];

  value = 'Option 2';

}
