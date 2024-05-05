import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, Scroll } from '@angular/router';
import { filter } from 'rxjs';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit{
  public submenu!: string;

  constructor(private router: Router, private route: ActivatedRoute) {
    router.events.pipe(filter(e => e instanceof Scroll)).subscribe({
      next: () => {
        const url = router.url;
        this.submenu = url.slice(url.lastIndexOf('/') + 1, url.length)
      }
    })
  }

  ngOnInit(): void {
    const url = this.router.url;
    this.submenu = url.slice(url.lastIndexOf('/') + 1, url.length)
  }

  public navigate(submenu: string) {
    this.submenu = submenu;
    this.router.navigate([submenu], {relativeTo: this.route});
  }
}
