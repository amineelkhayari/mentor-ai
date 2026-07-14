import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators, FormsModule } from '@angular/forms';
import { switchMap } from 'rxjs';
import { AuthService } from '../../core/auth/auth.service';
import { RoleAdminService } from '../../core/services/role-admin.service';
import { UserAdminService } from '../../core/services/user-admin.service';
import { ApplicationUser } from '../../core/models/application-user.model';
import { ROLES } from '../../core/models/role.model';

@Component({
  selector: 'app-user-manage',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  template: `
   <div class="admin-page">

  <div class="page-header">
    <div>
      <h1>Users</h1>
      <p>Create accounts and manage user roles.</p>
    </div>

    <div class="stats-badge">
      {{ users.length }} Users
    </div>
  </div>

  <div class="banner-error" *ngIf="error">
    {{ error }}
  </div>

  <!-- Create Role -->

  <div class="form-card">

    <h3>Create Role</h3>

    <form class="create-form" (ngSubmit)="createRole()">

      <div class="field">
        <label>Role Name</label>
        <input
          [(ngModel)]="newRoleName"
          name="newRole"
          placeholder="Manager"
        />
      </div>

      <button
        class="btn-primary"
        type="submit"
        [disabled]="!newRoleName"
      >
        Create Role
      </button>

    </form>

  </div>

  <!-- Create User -->

  <div class="form-card">

    <h3>Create User</h3>

    <form class="create-form" [formGroup]="form" (ngSubmit)="create()">

      <div class="field">
        <label>Display Name</label>
        <input formControlName="displayName" />
      </div>

      <div class="field">
        <label>Username</label>
        <input formControlName="userName" />
      </div>

      <div class="field">
        <label>Email</label>
        <input
          type="email"
          formControlName="email"
        />
      </div>

      <div class="field">
        <label>Role</label>
        <select formControlName="role">
          <option *ngFor="let r of roles" [value]="r">
            {{ r }}
          </option>
        </select>
      </div>

      <button
        class="btn-primary"
        type="submit"
        [disabled]="form.invalid || saving"
      >
        {{ saving ? 'Creating...' : 'Create User' }}
      </button>

    </form>

  </div>

  <!-- Users -->

  <div *ngIf="users.length; else empty" class="cards-grid">

    <div class="entity-card" *ngFor="let u of users">

      <div class="card-header">

        <h3>
          {{ u.displayName || u.userName }}
        </h3>

        <span class="count-badge">
          {{ u.roles?.length ?? 0 }}
        </span>

      </div>

      <p class="description">
        {{ u.email }}
      </p>

      <div class="meta-list">

        <div>
          <strong>Username:</strong>
          {{ u.userName }}
        </div>

        <div>
          <strong>Email:</strong>
          {{ u.email }}
        </div>

      </div>

      <div class="roles-section">

        <div
          *ngFor="let r of u.roles"
          class="role-tag"
          [class.role-admin]="r === 'Admin'"
          [class.role-manager]="r === 'Manager'"
          [class.role-user]="r === 'User'"
        >
          {{ r }}

          <button
            type="button"
            (click)="removeRole(u, r)"
          >
            ×
          </button>
        </div>

      </div>

      <div class="card-footer">

        <select
          #roleSelect
          class="role-select"
          (change)="assignRole(u, roleSelect.value)"
        >
          <option value="" selected disabled>
            Add Role...
          </option>

          <option
            *ngFor="let r of roles"
            [value]="r"
          >
            {{ r }}
          </option>

        </select>

      </div>

    </div>

  </div>

  <ng-template #empty>

    <div class="empty-state">
      <div class="empty-icon">👥</div>
      <h3>No Users Found</h3>
      <p>Create your first user using the form above.</p>
    </div>

  </ng-template>

</div>
  `,
  styleUrl: './admin.css',
})
export class UserManageComponent implements OnInit {
  users: ApplicationUser[] = [];
  roles = ROLES;
  saving = false;
  error = '';
  newRoleName = '';
  private fb = inject(FormBuilder);

  form = this.fb.group({
    displayName: ['', Validators.required],
    userName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    role: ['User', Validators.required],
  });

  constructor(
    private auth: AuthService,
    private roleAdminService: RoleAdminService,
    private userAdminService: UserAdminService
  ) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.userAdminService.getAll().subscribe((data) => (this.users = data));
  }

  createRole(): void {
    if (!this.newRoleName) return;
    this.roleAdminService.createRole(this.newRoleName).subscribe({
      next: () => (this.newRoleName = ''),
      error: (err) => (this.error = err?.error?.message ?? 'Could not create the role.'),
    });
  }

  create(): void {
    if (this.form.invalid) return;
    this.saving = true;
    this.error = '';
    const { displayName, userName, email, role } = this.form.getRawValue();

    this.auth
      .register({ displayName: displayName!, userName: userName!, email: email! })
      .pipe(switchMap(() => this.roleAdminService.assignRole({ email: email!, role: role! })))
      .subscribe({
        next: () => {
          this.saving = false;
          this.form.reset({ role: 'User' });
          this.load();
        },
        error: (err) => {
          this.saving = false;
          this.error = err?.error?.message ?? 'Could not create the user or assign the role.';
        },
      });
  }

  assignRole(u: ApplicationUser, role: string): void {
    if (!role) return;
    this.roleAdminService.assignRole({ email: u.email, role }).subscribe(() => this.load());
  }

  removeRole(u: ApplicationUser, role: string): void {
    this.roleAdminService.removeRoleFromUser({ email: u.email, role }).subscribe(() => this.load());
  }
}
