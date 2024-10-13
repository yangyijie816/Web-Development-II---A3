import { Routes } from '@angular/router'
import { HomeComponent } from './home/home.component'
import { CrowdfundingComponent } from './crowdfunding/crowdfunding.component'

export const routes: Routes = [
  { path: '', component: HomeComponent, title: 'home' },
  { path: 'search', component: CrowdfundingComponent, title: 'Crowdfunding' },
]
