import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'app-wishlist-dashboard',
  templateUrl: './wishlist-dashboard.component.html',
  styleUrls: ['./wishlist-dashboard.component.css']
})
export class WishlistDashboardComponent implements OnInit{
  public submenu!: string;

  constructor(private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    const url = this.router.url;
    this.submenu = url.slice(url.lastIndexOf('/') + 1, url.length)
  }

  public navigate(submenu: string) {
  console.log(submenu);
    this.submenu = submenu;
    this.router.navigate([submenu], {relativeTo: this.route});
  }

}
