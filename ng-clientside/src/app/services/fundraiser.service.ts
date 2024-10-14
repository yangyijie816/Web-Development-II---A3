import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'

export interface FundraiserType {
  FUNDRAISER_ID: number // fundraiser ID
  ORGANIZER: string // Name of organiser
  CAPTION: string // caption
  TARGET_FUNDING: number // Target funds
  CURRENT_FUNDING: number // current capital
  CITY: string // municipalities
  ACTIVE: number // Activated or not
  CATEGORY_ID: number // form ID
  CATEGORY_NAME: string // Category name
  DESCRIPTION: string // descriptions
}

export interface CategoriesType {
  CATEGORY_ID: number // categorisation ID
  NAME: string // caption
}

@Injectable({
  providedIn: 'root',
})
export class FundraiserService {
  private apiUrl = 'https://24275293.it.scu.edu.au/'
  constructor(private http: HttpClient) {}

  getFundraiser(): Observable<FundraiserType[]> {
    return this.http.get<FundraiserType[]>(this.apiUrl + 'fundraisers')
  }

  searchFundraiser(params: any): Observable<FundraiserType[]> {
    return this.http.get<FundraiserType[]>(this.apiUrl + 'search', { params })
  }

  // form
  getCategories(): Observable<CategoriesType[]> {
    return this.http.get<CategoriesType[]>(this.apiUrl + 'categories')
  }

  // particulars
  getDetails(id: number): Observable<FundraiserType> {
    return this.http.get<FundraiserType>(this.apiUrl + 'fundraiser/' + id)
  }

  // Additional donors
  setDonation(data: any) {
    return this.http.post<FundraiserType>(this.apiUrl + 'donation', data)
  }
}
