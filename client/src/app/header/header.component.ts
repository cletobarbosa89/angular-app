import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap, UrlSegment } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AppService } from '../app.service';
// import { auth } from '../auth-token';

import { spinner } from '../spinner-config'

export interface Links {
  link: string,
  text: string,
  disabled: boolean,
  key: string
}

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})

export class HeaderComponent implements OnInit {
  page:string | null;
  brand:string | null;
  links:any[] = [];

  constructor(
    private route: ActivatedRoute,
    private appService: AppService,
    private snackBar: MatSnackBar
  ) {
    this.page = this.route.snapshot.url[0].toString().replace('-', ' ').replace(/(?:^|\s)\S/g, a => a.toUpperCase());
    this.brand = this.route.snapshot.paramMap.get('brand');

    if(this.brand) {
      this.links.push(
        {link: '/overview/' + this.brand, text: 'Overview', disabled: false, key: this.route.snapshot.queryParamMap.get('key')},
        {link: '/targeting-overview/' + this.brand, text: 'Targeting Overview', disabled: false, key: this.route.snapshot.queryParamMap.get('key')},
        {link: '/brand-health/'+this.brand, text: 'Brand Health', disabled: false, key: this.route.snapshot.queryParamMap.get('key')},
        {link: '/sales-lift/'+this.brand, text: 'Sales Lift', disabled: false, key: this.route.snapshot.queryParamMap.get('key')},
        {link: '/creative-overview/'+this.brand, text: 'Creative Overview', disabled: false, key: this.route.snapshot.queryParamMap.get('key')},
        {link: '/comparison/'+this.brand, text: 'Comparison', disabled: false, key: this.route.snapshot.queryParamMap.get('key')},
      )
    }
  }

  ngOnInit(): void {
    // CLIENT REMOVED
    // Check if brand exists
    // if(this.brand) {
    //   this.appService.checkIfBrandExists(this.brand).subscribe((response) => {
    //     // console.log(response);
    //     if(response.status == 200 && response.results.exist) {
    //       this.snackBar.open(`"${this.brand}" brand found`, 'X', {
    //         horizontalPosition: spinner.horizontalPosition,
    //         verticalPosition: spinner.verticalPosition,
    //         duration: spinner.duration
    //       });
    //     } else {
    //       this.snackBar.open(`"${this.brand}" brand not found`, 'X', {
    //         horizontalPosition: spinner.horizontalPosition,
    //         verticalPosition: spinner.verticalPosition,
    //         duration: spinner.duration
    //       });
    //     }
    //   },
    //   (error) => {
    //     this.snackBar.open(`API error: ${error}`, 'X', {
    //       horizontalPosition: spinner.horizontalPosition,
    //       verticalPosition: spinner.verticalPosition,
    //       duration: spinner.duration
    //     });
    //   });
    // }
  }

}
