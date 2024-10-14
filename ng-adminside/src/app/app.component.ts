import { Component, OnInit } from '@angular/core'
import { ActivatedRoute, Route, Router, RouterOutlet, Routes } from '@angular/router'
import { routes } from './app.routes'
import { CommonModule } from '@angular/common'

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  constructor(private router: Router, private route: ActivatedRoute) {}
  title = 'ng-adminside'
  routes: Routes = []
  currentTitle: Route['title'] = undefined

  ngOnInit() {
    this.routes = routes.filter(f => !f.data || f.data['isMenu'] !== false)
    this.currentTitle = this.route.routeConfig?.title || 'Fundraisers'
  }

  // 跳转
  navTo(url: string) {
    this.router.navigate([url])
  }
}
