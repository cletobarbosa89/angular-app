import { Component } from '@angular/core';
import { CustomSpinnerComponent } from './custom-spinner/custom-spinner.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Chart';

  public customSpinnerComponent = CustomSpinnerComponent;
}
