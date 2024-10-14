import { CommonModule } from '@angular/common'
import { Component, OnInit } from '@angular/core'
import { FundraiserService } from '../services/fundraiser.service'

@Component({
  selector: 'app-category',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './category.component.html',
  styleUrl: './category.component.css',
})
export class CategoryComponent implements OnInit {
  constructor(private fundraiserService: FundraiserService) {}
  categorys: any = []

  ngOnInit(): void {
    this.fundraiserService.getCategories().subscribe(res => {
      this.categorys = res
    })
  }
}
