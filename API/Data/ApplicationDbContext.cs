using API.Models;
using Microsoft.EntityFrameworkCore;

namespace API.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }
        

        public DbSet<User> Users { get; set; }
        public DbSet<Project> Projects { get; set; }
        public DbSet<ProjectUser> ProjectUsers { get; set; }
        public DbSet<ProjectInvitation> ProjectInvitations { get; set; }
        public DbSet<Column> Columns { get; set; } 
        public DbSet<Models.Task> Tasks { get; set; }
        public DbSet<TaskAssignee> TaskAssignees { get; set; }
        public DbSet<Attachment> Attachments { get; set; }



        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<User>(entity =>
            {
                entity.HasIndex(e => e.Email).IsUnique();
            });


            modelBuilder.Entity<ProjectUser>()
                .HasKey(pu => pu.Id);  // Id is the primary key

            modelBuilder.Entity<ProjectUser>()
                .HasIndex(pu => new { pu.ProjectId, pu.UserId }).IsUnique();  // ProjectId and UserId are unique together

            modelBuilder.Entity<ProjectUser>()
                .HasOne(pu => pu.Project)
                .WithMany(p => p.ProjectUsers)
                .HasForeignKey(pu => pu.ProjectId);

            modelBuilder.Entity<ProjectUser>()
                .HasOne(pu => pu.User)
                .WithMany(u => u.ProjectUsers)
                .HasForeignKey(pu => pu.UserId);

            modelBuilder.Entity<Column>()
            .HasOne(c => c.Project)
            .WithMany(p => p.Columns)
            .HasForeignKey(c => c.ProjectId)
            .OnDelete(DeleteBehavior.Cascade);



            modelBuilder.Entity<TaskAssignee>()
            .HasKey(ta => ta.Id);  // Id is the primary key

            modelBuilder.Entity<TaskAssignee>()
                .HasIndex(ta => new { ta.TaskId, ta.UserId }).IsUnique();  // TaskId and UserId are unique together
            modelBuilder.Entity<TaskAssignee>()
                .HasOne(ta => ta.Task)
                .WithMany(t => t.TaskAssignees)
                .HasForeignKey(ta => ta.TaskId);
            modelBuilder.Entity<TaskAssignee>()
                .HasOne(ta => ta.User)
                .WithMany(u => u.TaskAssignees)
                .HasForeignKey(ta => ta.UserId);

            // COLUMN → TASK (One-to-Many)
            modelBuilder.Entity<Column>()
                .HasMany(c => c.Tasks)
                .WithOne(t => t.Column)
                .HasForeignKey(t => t.ColumnId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Attachment>()
            .HasOne(a => a.Task)
            .WithMany(t => t.Attachments)
            .HasForeignKey(a => a.TaskId)
            .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Models.Task>()
            .HasOne(t => t.Owner)
            .WithMany(u => u.OwnedTasks)
            .HasForeignKey(t => t.OwnerId)
            .OnDelete(DeleteBehavior.Restrict);



        }




    }
}
