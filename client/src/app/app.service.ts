import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams, HttpHeaders } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

import { environment } from './../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AppService {
  // private localhost:string = "http://localhost:8080";

  constructor(private http: HttpClient, private route: ActivatedRoute) { }

  private handleError(error: HttpErrorResponse) {
    if (error.status === 0) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      console.error(
        `Backend returned code ${error.status}, body was: `, error.error);
    }
    // Return an observable with a user-facing error message.
    if(typeof error.error.message !== 'undefined')
      return throwError(error.error.message);
    else
      return throwError(error.error)
  }

  // Brand
  checkIfBrandExists(brandName: string): Observable<any> {
    const headers= new HttpHeaders().set('key', this.route.snapshot.queryParams.key);

    return this.http.get(`${environment.APIUrl}/api/v1/brand/${brandName}`, { headers: headers })
      .pipe(
        catchError(this.handleError)
      );
  }

  getCampaignStartEndDates(brandName: string, campaign: string): Observable<any> {
    const headers= new HttpHeaders().set('key', this.route.snapshot.queryParams.key);
    let params = new HttpParams().set('campaign', encodeURIComponent(campaign));

    return this.http.get(`${environment.APIUrl}/api/v1/brand/${brandName}/getCampaignStartEndDates`, { headers: headers, params: params })
      .pipe(
        catchError(this.handleError)
      );
  }

  // Overview page
  getCampaigns(brandName: string): Observable<any> {
    const headers= new HttpHeaders().set('key', this.route.snapshot.queryParams.key);

    return this.http.get(`${environment.APIUrl}/api/v1/brand/${brandName}/campaigns`, { headers: headers })
      .pipe(
        catchError(this.handleError)
      );
  }

  getGoals(brandName: string): Observable<any> {
    const headers= new HttpHeaders().set('key', this.route.snapshot.queryParams.key);

    return this.http.get(`${environment.APIUrl}/api/v1/brand/${brandName}/goals`, { headers: headers })
      .pipe(
        catchError(this.handleError)
      );
  }

  getChannels(brandName: string): Observable<any> {
    const headers= new HttpHeaders().set('key', this.route.snapshot.queryParams.key);

    return this.http.get(`${environment.APIUrl}/api/v1/brand/${brandName}/channels`, { headers: headers })
      .pipe(
        catchError(this.handleError)
      );
  }

  getCreativeNames(brandName: string, campaign: string): Observable<any> {
    const headers= new HttpHeaders().set('key', this.route.snapshot.queryParams.key);
    let params = new HttpParams().set('campaign', encodeURIComponent(campaign));

    return this.http.get(`${environment.APIUrl}/api/v1/brand/${brandName}/creativeNames`, { headers: headers, params: params })
      .pipe(
        catchError(this.handleError)
      );
  }

  getStudyNames(brandName: string, campaign: string): Observable<any> {
    const headers= new HttpHeaders().set('key', this.route.snapshot.queryParams.key);
    let params = new HttpParams().set('campaign', encodeURIComponent(campaign));

    return this.http.get(`${environment.APIUrl}/api/v1/brand/${brandName}/studyNames`, { headers: headers, params: params })
      .pipe(
        catchError(this.handleError)
      );
  }

  getCellNames(brandName: string, campaign: string, studyName: string): Observable<any> {
    const headers= new HttpHeaders().set('key', this.route.snapshot.queryParams.key);
    let params = new HttpParams().set('campaign', encodeURIComponent(campaign)).set('studyName', encodeURIComponent(studyName));

    return this.http.get(`${environment.APIUrl}/api/v1/brand/${brandName}/cellNames`, { headers: headers, params: params })
      .pipe(
        catchError(this.handleError)
      );
  }

  getChannelsByCampaign(brandName: string, campaign: string): Observable<any> {
    const headers= new HttpHeaders().set('key', this.route.snapshot.queryParams.key);
    let params = new HttpParams().set('campaign', encodeURIComponent(campaign));

    return this.http.get(`${environment.APIUrl}/api/v1/brand/${brandName}/channelsByCampaign`, { headers: headers, params: params })
      .pipe(
        catchError(this.handleError)
      );
  }

  getChannelsByGoal(brandName: string, campaign: string, goal: string): Observable<any> {
    const headers= new HttpHeaders().set('key', this.route.snapshot.queryParams.key);
    let params = new HttpParams().set('campaign', encodeURIComponent(campaign)).set('goal', goal);

    return this.http.get(`${environment.APIUrl}/api/v1/brand/${brandName}/channelsByGoal`, { headers: headers, params: params })
      .pipe(
        catchError(this.handleError)
      );
  }

  getImpressionsReachSpendCPM(brandName: string, campaign: string, channel: string): Observable<any> {
    const headers= new HttpHeaders().set('key', this.route.snapshot.queryParams.key);
    let params = new HttpParams().set('campaign', encodeURIComponent(campaign)).set('channel', encodeURIComponent(channel));

    return this.http.get(`${environment.APIUrl}/api/v1/brand/${brandName}/getImpressionsReachSpendCPM`, { headers: headers, params: params })
      .pipe(
        catchError(this.handleError)
      );
  }

  getImpressionsReachSpendCPMByTargeting(brandName: string, campaign: string, channel: string): Observable<any> {
    const headers= new HttpHeaders().set('key', this.route.snapshot.queryParams.key);
    let params = new HttpParams().set('campaign', encodeURIComponent(campaign)).set('channel', encodeURIComponent(channel));

    return this.http.get(`${environment.APIUrl}/api/v1/brand/${brandName}/getImpressionsReachSpendCPMByTargeting`, { headers: headers, params: params })
      .pipe(
        catchError(this.handleError)
      );
  }

  getBrandAndSalesLift(brandName: string, campaign: string, channel: string): Observable<any> {
    const headers= new HttpHeaders().set('key', this.route.snapshot.queryParams.key);
    let params = new HttpParams().set('campaign', encodeURIComponent(campaign)).set('channel', encodeURIComponent(channel));

    return this.http.get(`${environment.APIUrl}/api/v1/brand/${brandName}/getBrandAndSalesLift`, { headers: headers, params: params })
      .pipe(
        catchError(this.handleError)
      );
  }

  getBrandLiftComscore(brandName: string, campaign: string, channel: string, creativeName: string): Observable<any> {
    const headers= new HttpHeaders().set('key', this.route.snapshot.queryParams.key);
    let params = new HttpParams().set('campaign', encodeURIComponent(campaign)).set('channel', encodeURIComponent(channel)).set('creativeName', encodeURIComponent(creativeName));

    return this.http.get(`${environment.APIUrl}/api/v1/brand/${brandName}/getBrandLiftComscore`, { headers: headers, params: params })
      .pipe(
        catchError(this.handleError)
      );
  }

  getBrandLiftFacebook(brandName: string, campaign: string, channel: string, studyName: string, cellName: string): Observable<any> {
    const headers= new HttpHeaders().set('key', this.route.snapshot.queryParams.key);
    let params = new HttpParams().set('campaign', encodeURIComponent(campaign)).set('channel', encodeURIComponent(channel)).set('studyName', encodeURIComponent(studyName)).set('cellName', encodeURIComponent(cellName));

    return this.http.get(`${environment.APIUrl}/api/v1/brand/${brandName}/getBrandLiftFacebook`, { headers: headers, params: params })
      .pipe(
        catchError(this.handleError)
      );
  }

  getCreativeScore(brandName: string, campaign: string, channel: string): Observable<any> {
    const headers= new HttpHeaders().set('key', this.route.snapshot.queryParams.key);
    let params = new HttpParams().set('campaign', encodeURIComponent(campaign)).set('channel', encodeURIComponent(channel));

    return this.http.get(`${environment.APIUrl}/api/v1/brand/${brandName}/getCreativeScore`, { headers: headers, params: params })
      .pipe(
        catchError(this.handleError)
      );
  }

  getSocialSentiment(brandName: string): Observable<any> {
    const headers= new HttpHeaders().set('key', this.route.snapshot.queryParams.key);

    return this.http.get(`${environment.APIUrl}/api/v1/brand/${brandName}/getSocialSentiment`, { headers: headers })
      .pipe(
        catchError(this.handleError)
      );
  }

  // Targeting Overview Page
  getTargetingOverviewCampaigns(brandName: string): Observable<any> {
    const headers= new HttpHeaders().set('key', this.route.snapshot.queryParams.key);

    return this.http.get(`${environment.APIUrl}/api/v1/brand/${brandName}/getTargetingOverviewCampaigns`, { headers: headers })
      .pipe(
        catchError(this.handleError)
      );
  }

  getTargetingOverviewChannelsByCampaign(brandName: string, campaign: string): Observable<any> {
    const headers= new HttpHeaders().set('key', this.route.snapshot.queryParams.key);
    let params = new HttpParams().set('campaign', encodeURIComponent(campaign));

    return this.http.get(`${environment.APIUrl}/api/v1/brand/${brandName}/getTargetingOverviewChannelsByCampaign`, { headers: headers, params: params })
      .pipe(
        catchError(this.handleError)
      );
  }

  getTargetingOverviewChannelsByGoal(brandName: string, campaign: string, goal: string): Observable<any> {
    const headers= new HttpHeaders().set('key', this.route.snapshot.queryParams.key);
    let params = new HttpParams().set('campaign', encodeURIComponent(campaign)).set('goal', goal);

    return this.http.get(`${environment.APIUrl}/api/v1/brand/${brandName}/getTargetingOverviewChannelsByGoal`, { headers: headers, params: params })
      .pipe(
        catchError(this.handleError)
      );
  }

  getTargetingOverviewTargetingByCampaign(brandName: string, campaign: string, channel: string): Observable<any> {
    const headers= new HttpHeaders().set('key', this.route.snapshot.queryParams.key);
    let params = new HttpParams().set('campaign', encodeURIComponent(campaign)).set('channel', encodeURIComponent(channel));

    return this.http.get(`${environment.APIUrl}/api/v1/brand/${brandName}/getTargetingOverviewTargetingByCampaign`, { headers: headers, params: params })
      .pipe(
        catchError(this.handleError)
      );
  }

  getTargetingOverviewAudienceByCampaign(brandName: string, campaign: string, channel: string, targeting: string): Observable<any> {
    const headers= new HttpHeaders().set('key', this.route.snapshot.queryParams.key);
    let params = new HttpParams().set('campaign', encodeURIComponent(campaign)).set('channel', encodeURIComponent(channel)).set('targeting', encodeURIComponent(targeting));

    return this.http.get(`${environment.APIUrl}/api/v1/brand/${brandName}/getTargetingOverviewAudienceByCampaign`, { headers: headers, params: params })
      .pipe(
        catchError(this.handleError)
      );
  }

  getTargetingOverviewTargetingCPM(brandName: string, campaign: string, channel: string, targeting: string, audience: string): Observable<any> {
    const headers= new HttpHeaders().set('key', this.route.snapshot.queryParams.key);
    let params = new HttpParams().set('campaign', encodeURIComponent(campaign)).set('channel', encodeURIComponent(channel)).set('targeting', encodeURIComponent(targeting)).set('audience', encodeURIComponent(audience));

    return this.http.get(`${environment.APIUrl}/api/v1/brand/${brandName}/getTargetingOverviewTargetingCPM`, { headers: headers, params: params })
      .pipe(
        catchError(this.handleError)
      );
  }

  getTargetingOverviewAudienceCPM(brandName: string, campaign: string, channel: string, targeting: string, audience: string): Observable<any> {
    const headers= new HttpHeaders().set('key', this.route.snapshot.queryParams.key);
    let params = new HttpParams().set('campaign', encodeURIComponent(campaign)).set('channel', encodeURIComponent(channel)).set('targeting', encodeURIComponent(targeting)).set('audience', encodeURIComponent(audience));

    return this.http.get(`${environment.APIUrl}/api/v1/brand/${brandName}/getTargetingOverviewAudienceCPM`, { headers: headers, params: params })
      .pipe(
        catchError(this.handleError)
      );
  }

  getTargetingOverviewTargetingInViewRateViewability(brandName: string, campaign: string, channel: string, targeting: string, audience: string): Observable<any> {
    const headers= new HttpHeaders().set('key', this.route.snapshot.queryParams.key);
    let params = new HttpParams().set('campaign', encodeURIComponent(campaign)).set('channel', encodeURIComponent(channel)).set('targeting', encodeURIComponent(targeting)).set('audience', encodeURIComponent(audience));

    return this.http.get(`${environment.APIUrl}/api/v1/brand/${brandName}/getTargetingOverviewTargetingInViewRateViewability`, { headers: headers, params: params })
      .pipe(
        catchError(this.handleError)
      );
  }

  getTargetingOverviewAudienceInViewRateViewability(brandName: string, campaign: string, channel: string, targeting: string, audience: string): Observable<any> {
    const headers= new HttpHeaders().set('key', this.route.snapshot.queryParams.key);
    let params = new HttpParams().set('campaign', encodeURIComponent(campaign)).set('channel', encodeURIComponent(channel)).set('targeting', encodeURIComponent(targeting)).set('audience', encodeURIComponent(audience));

    return this.http.get(`${environment.APIUrl}/api/v1/brand/${brandName}/getTargetingOverviewAudienceInViewRateViewability`, { headers: headers, params: params })
      .pipe(
        catchError(this.handleError)
      );
  }

  getTargetingOverviewTargetingInViewTimeViewability(brandName: string, campaign: string, channel: string, targeting: string, audience: string): Observable<any> {
    const headers= new HttpHeaders().set('key', this.route.snapshot.queryParams.key);
    let params = new HttpParams().set('campaign', encodeURIComponent(campaign)).set('channel', encodeURIComponent(channel)).set('targeting', encodeURIComponent(targeting)).set('audience', encodeURIComponent(audience));

    return this.http.get(`${environment.APIUrl}/api/v1/brand/${brandName}/getTargetingOverviewTargetingInViewTimeViewability`, { headers: headers, params: params })
      .pipe(
        catchError(this.handleError)
      );
  }

  getTargetingOverviewAudienceInViewTimeViewability(brandName: string, campaign: string, channel: string, targeting: string, audience: string): Observable<any> {
    const headers= new HttpHeaders().set('key', this.route.snapshot.queryParams.key);
    let params = new HttpParams().set('campaign', encodeURIComponent(campaign)).set('channel', encodeURIComponent(channel)).set('targeting', encodeURIComponent(targeting)).set('audience', encodeURIComponent(audience));

    return this.http.get(`${environment.APIUrl}/api/v1/brand/${brandName}/getTargetingOverviewAudienceInViewTimeViewability`, { headers: headers, params: params })
      .pipe(
        catchError(this.handleError)
      );
  }

  getTargetingOverviewSL(brandName: string, campaign: string, channel: string, targeting: string, audience: string, goal: string): Observable<any> {
    const headers= new HttpHeaders().set('key', this.route.snapshot.queryParams.key);
    let params = new HttpParams().set('campaign', encodeURIComponent(campaign)).set('channel', encodeURIComponent(channel)).set('targeting', encodeURIComponent(targeting)).set('audience', encodeURIComponent(audience)).set('goal', goal);

    return this.http.get(`${environment.APIUrl}/api/v1/brand/${brandName}/getTargetingOverviewSL`, { headers: headers, params: params })
      .pipe(
        catchError(this.handleError)
      );
  }

  getTargetingOverviewBL(brandName: string, campaign: string, channel: string, targeting: string, audience: string, goal: string): Observable<any> {
    const headers= new HttpHeaders().set('key', this.route.snapshot.queryParams.key);
    let params = new HttpParams().set('campaign', encodeURIComponent(campaign)).set('channel', encodeURIComponent(channel)).set('targeting', encodeURIComponent(targeting)).set('audience', encodeURIComponent(audience)).set('goal', goal);

    return this.http.get(`${environment.APIUrl}/api/v1/brand/${brandName}/getTargetingOverviewBL`, { headers: headers, params: params })
      .pipe(
        catchError(this.handleError)
      );
  }

  // Brand Health Page
  getBrandHealthCampaigns(brandName: string): Observable<any> {
    const headers= new HttpHeaders().set('key', this.route.snapshot.queryParams.key);
    return this.http.get(`${environment.APIUrl}/api/v1/brand/${brandName}/getBrandHealthCampaigns`, { headers: headers })
      .pipe(
        catchError(this.handleError)
      );
  }

  getBrandHealthComscoreResults(brandName: string, campaign: string): Observable<any> {
    const headers= new HttpHeaders().set('key', this.route.snapshot.queryParams.key);
    let params = new HttpParams().set('campaign', encodeURIComponent(campaign));

    return this.http.get(`${environment.APIUrl}/api/v1/brand/${brandName}/getBrandHealthComscoreResults`, { headers: headers, params: params })
      .pipe(
        catchError(this.handleError)
      );
  }

  getBrandHealthOverallSnapshot(brandName: string, campaign: string, type: string): Observable<any> {
    const headers= new HttpHeaders().set('key', this.route.snapshot.queryParams.key);
    let params = new HttpParams().set('campaign', encodeURIComponent(campaign)).set('type', encodeURIComponent(type));

    return this.http.get(`${environment.APIUrl}/api/v1/brand/${brandName}/getBrandHealthOverallSnapshot`, { headers: headers, params: params })
      .pipe(
        catchError(this.handleError)
      );
  }

  getBrandHealthPurchaseIntent(brandName: string, campaign: string, category: string, type: string): Observable<any> {
    const headers= new HttpHeaders().set('key', this.route.snapshot.queryParams.key);
    let params = new HttpParams().set('campaign', encodeURIComponent(campaign)).set('category', encodeURIComponent(category)).set('type', encodeURIComponent(type));

    return this.http.get(`${environment.APIUrl}/api/v1/brand/${brandName}/getBrandHealthPurchaseIntent`, { headers: headers, params: params })
      .pipe(
        catchError(this.handleError)
      );
  }

  getBrandHealthGetCellNames(brandName: string, campaign: string): Observable<any> {
    const headers= new HttpHeaders().set('key', this.route.snapshot.queryParams.key);
    let params = new HttpParams().set('campaign', encodeURIComponent(campaign));

    return this.http.get(`${environment.APIUrl}/api/v1/brand/${brandName}/getBrandHealthGetCellNames`, { headers: headers, params: params })
      .pipe(
        catchError(this.handleError)
      );
  }

  getBrandHealthFacebookBrandLiftByCellName(brandName: string, campaign: string, cellName: string): Observable<any> {
    const headers= new HttpHeaders().set('key', this.route.snapshot.queryParams.key);
    let params = new HttpParams().set('campaign', encodeURIComponent(campaign)).set('cellName', encodeURIComponent(cellName));

    return this.http.get(`${environment.APIUrl}/api/v1/brand/${brandName}/getBrandHealthFacebookBrandLiftByCellName`, { headers: headers, params: params })
      .pipe(
        catchError(this.handleError)
      );
  }

  getBrandHealthYouTubeBrandLift(brandName: string, campaign: string): Observable<any> {
    const headers= new HttpHeaders().set('key', this.route.snapshot.queryParams.key);
    let params = new HttpParams().set('campaign', encodeURIComponent(campaign));

    return this.http.get(`${environment.APIUrl}/api/v1/brand/${brandName}/getBrandHealthYouTubeBrandLift`, { headers: headers, params: params })
      .pipe(
        catchError(this.handleError)
      );
  }

  // Sales Lift Page
  getSalesLiftCampaigns(brandName: string): Observable<any> {
    const headers= new HttpHeaders().set('key', this.route.snapshot.queryParams.key);

    return this.http.get(`${environment.APIUrl}/api/v1/brand/${brandName}/getSalesLiftCampaigns`, { headers: headers })
      .pipe(
        catchError(this.handleError)
      );
  }

  getSalesLiftSLData(brandName: string, campaign: string): Observable<any> {
    const headers= new HttpHeaders().set('key', this.route.snapshot.queryParams.key);
    let params = new HttpParams().set('campaign', encodeURIComponent(campaign));

    return this.http.get(`${environment.APIUrl}/api/v1/brand/${brandName}/getSalesLiftSLData`, { headers: headers, params: params })
      .pipe(
        catchError(this.handleError)
      );
  }

  // Creative Overview Page
  getCreativeOverviewCampaigns(brandName: string): Observable<any> {
    const headers= new HttpHeaders().set('key', this.route.snapshot.queryParams.key);

    return this.http.get(`${environment.APIUrl}/api/v1/brand/${brandName}/getCreativeOverviewCampaigns`, { headers: headers })
      .pipe(
        catchError(this.handleError)
      );
  }

  getCreativeOverviewChannelsByCampaign(brandName: string, campaign: string): Observable<any> {
    const headers= new HttpHeaders().set('key', this.route.snapshot.queryParams.key);
    let params = new HttpParams().set('campaign', encodeURIComponent(campaign));

    return this.http.get(`${environment.APIUrl}/api/v1/brand/${brandName}/getCreativeOverviewChannelsByCampaign`, { headers: headers, params: params })
      .pipe(
        catchError(this.handleError)
      );
  }

  getCreativesCount(brandName: string, campaign: string, channel: string): Observable<any> {
    const headers= new HttpHeaders().set('key', this.route.snapshot.queryParams.key);
    let params = new HttpParams().set('campaign', campaign).set('channel', channel);

    return this.http.get(`${environment.APIUrl}/api/v1/brand/${brandName}/getCreativesCount`, { headers: headers, params: params })
      .pipe(
        catchError(this.handleError)
      );
  }


  getCreatives(brandName: string, campaign: string, channel: string, offset: number, limit: number): Observable<any> {
    const headers= new HttpHeaders().set('key', this.route.snapshot.queryParams.key);
    let params = new HttpParams().set('campaign', encodeURIComponent(campaign)).set('channel', encodeURIComponent(channel)).set('limit', limit).set('offset', offset);

    return this.http.get(`${environment.APIUrl}/api/v1/brand/${brandName}/getCreatives`, { headers: headers, params: params })
      .pipe(
        catchError(this.handleError)
      );
  }

  getCreatives2(brandName: string, campaign: string, channel: string, offset: number, limit: number): Observable<any> {
    const headers= new HttpHeaders().set('key', this.route.snapshot.queryParams.key);
    let params = new HttpParams().set('campaign', encodeURIComponent(campaign)).set('channel', encodeURIComponent(channel)).set('limit', limit).set('offset', offset);

    return this.http.get(`${environment.APIUrl}/api/v1/brand/${brandName}/getCreatives2`, { headers: headers, params: params })
      .pipe(
        catchError(this.handleError)
      );
  }

  getCreativesList(brandName: string, campaign: string, channel: string, creativeName: string): Observable<any> {
    const headers= new HttpHeaders().set('key', this.route.snapshot.queryParams.key);
    let params = new HttpParams().set('campaign', encodeURIComponent(campaign)).set('channel', encodeURIComponent(channel)).set('creativeName', encodeURIComponent(creativeName));

    return this.http.get(`${environment.APIUrl}/api/v1/brand/${brandName}/getCreativesList`, { headers: headers, params: params })
      .pipe(
        catchError(this.handleError)
      );
  }

  // Comparison Page
  getComparisonCampaigns(brandName: string): Observable<any> {
    const headers= new HttpHeaders().set('key', this.route.snapshot.queryParams.key);
    return this.http.get(`${environment.APIUrl}/api/v1/brand/${brandName}/getComparisonCampaigns`, { headers: headers })
      .pipe(
        catchError(this.handleError)
      );
  }

  getComparisonTargetingByCampaign(brandName: string, campaign: string): Observable<any> {
    const headers= new HttpHeaders().set('key', this.route.snapshot.queryParams.key);
    let params = new HttpParams().set('campaign', encodeURIComponent(campaign));

    return this.http.get(`${environment.APIUrl}/api/v1/brand/${brandName}/getComparisonTargetingByCampaign`, { headers: headers, params: params })
      .pipe(
        catchError(this.handleError)
      );
  }

  getComparisonAudienceByCampaign(brandName: string, campaign: string, targeting: string): Observable<any> {
    const headers= new HttpHeaders().set('key', this.route.snapshot.queryParams.key);
    let params = new HttpParams().set('campaign', encodeURIComponent(campaign)).set('targeting', encodeURIComponent(targeting));

    return this.http.get(`${environment.APIUrl}/api/v1/brand/${brandName}/getComparisonAudienceByCampaign`, { headers: headers, params: params })
      .pipe(
        catchError(this.handleError)
      );
  }

  getComparisonImpressionsSpend(brandName: string, campaign: string, targeting: string, audience: string): Observable<any> {
    const headers= new HttpHeaders().set('key', this.route.snapshot.queryParams.key);
    let params = new HttpParams().set('campaign', encodeURIComponent(campaign)).set('targeting', encodeURIComponent(targeting)).set('audience', encodeURIComponent(audience));

    return this.http.get(`${environment.APIUrl}/api/v1/brand/${brandName}/getComparisonImpressionsSpend`, { headers: headers, params: params })
      .pipe(
        catchError(this.handleError)
      );
  }

  getComparisonCPVM(brandName: string, campaign: string, targeting: string, audience: string): Observable<any> {
    const headers= new HttpHeaders().set('key', this.route.snapshot.queryParams.key);
    let params = new HttpParams().set('campaign', encodeURIComponent(campaign)).set('targeting', encodeURIComponent(targeting)).set('audience', encodeURIComponent(audience));

    return this.http.get(`${environment.APIUrl}/api/v1/brand/${brandName}/getComparisonCPVM`, { headers: headers, params: params })
      .pipe(
        catchError(this.handleError)
      );
  }

  getComparisonInViewRate(brandName: string, campaign: string, targeting: string, audience: string): Observable<any> {
    const headers= new HttpHeaders().set('key', this.route.snapshot.queryParams.key);
    let params = new HttpParams().set('campaign', encodeURIComponent(campaign)).set('targeting', encodeURIComponent(targeting)).set('audience', encodeURIComponent(audience));

    return this.http.get(`${environment.APIUrl}/api/v1/brand/${brandName}/getComparisonInViewRate`, { headers: headers, params: params })
      .pipe(
        catchError(this.handleError)
      );
  }

  getComparison2SecVideoInViewRate(brandName: string, campaign: string, targeting: string, audience: string): Observable<any> {
    const headers= new HttpHeaders().set('key', this.route.snapshot.queryParams.key);
    let params = new HttpParams().set('campaign', encodeURIComponent(campaign)).set('targeting', encodeURIComponent(targeting)).set('audience', encodeURIComponent(audience));

    return this.http.get(`${environment.APIUrl}/api/v1/brand/${brandName}/getComparison2SecVideoInViewRate`, { headers: headers, params: params })
      .pipe(
        catchError(this.handleError)
      );
  }

  getComparisonInViewTimeDisplay(brandName: string, campaign: string, targeting: string, audience: string): Observable<any> {
    const headers= new HttpHeaders().set('key', this.route.snapshot.queryParams.key);
    let params = new HttpParams().set('campaign', encodeURIComponent(campaign)).set('targeting', encodeURIComponent(targeting)).set('audience', encodeURIComponent(audience));

    return this.http.get(`${environment.APIUrl}/api/v1/brand/${brandName}/getComparisonInViewTimeDisplay`, { headers: headers, params: params })
      .pipe(
        catchError(this.handleError)
      );
  }

  getComparisonInViewTimeVideo(brandName: string, campaign: string, targeting: string, audience: string): Observable<any> {
    const headers= new HttpHeaders().set('key', this.route.snapshot.queryParams.key);
    let params = new HttpParams().set('campaign', encodeURIComponent(campaign)).set('targeting', encodeURIComponent(targeting)).set('audience', encodeURIComponent(audience));

    return this.http.get(`${environment.APIUrl}/api/v1/brand/${brandName}/getComparisonInViewTimeVideo`, { headers: headers, params: params })
      .pipe(
        catchError(this.handleError)
      );
  }

  getComparisonBL(brandName: string, campaign: string, targeting: string, audience: string): Observable<any> {
    const headers= new HttpHeaders().set('key', this.route.snapshot.queryParams.key);
    let params = new HttpParams().set('campaign', encodeURIComponent(campaign)).set('targeting', encodeURIComponent(targeting)).set('audience', encodeURIComponent(audience));

    return this.http.get(`${environment.APIUrl}/api/v1/brand/${brandName}/getComparisonBL`, { headers: headers, params: params })
      .pipe(
        catchError(this.handleError)
      );
  }

  getComparisonSL(brandName: string, campaign: string, targeting: string, audience: string): Observable<any> {
    const headers= new HttpHeaders().set('key', this.route.snapshot.queryParams.key);
    let params = new HttpParams().set('campaign', encodeURIComponent(campaign)).set('targeting', encodeURIComponent(targeting)).set('audience', encodeURIComponent(audience));

    return this.http.get(`${environment.APIUrl}/api/v1/brand/${brandName}/getComparisonSL`, { headers: headers, params: params })
      .pipe(
        catchError(this.handleError)
      );
  }
}
