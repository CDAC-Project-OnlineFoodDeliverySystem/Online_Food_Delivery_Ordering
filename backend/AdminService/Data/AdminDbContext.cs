using Microsoft.EntityFrameworkCore;
using AdminService.Models;

namespace AdminService.Data
{
    public class AdminDbContext : DbContext
    {
        public AdminDbContext(DbContextOptions<AdminDbContext> options) : base(options) { }

        public DbSet<Restaurant> Restaurants { get; set; }
        public DbSet<AdminUser> AdminUsers { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            
            modelBuilder.Entity<Restaurant>().ToTable("restaurant");
            modelBuilder.Entity<Restaurant>().Property(r => r.Address).HasColumnName("address");
            modelBuilder.Entity<Restaurant>().Property(r => r.ContactNumber).HasColumnName("contact_number");
            modelBuilder.Entity<Restaurant>().Property(r => r.OwnerId).HasColumnName("owner_id");
            modelBuilder.Entity<Restaurant>().Property(r => r.Id).HasColumnName("id");
            modelBuilder.Entity<Restaurant>().Property(r => r.Name).HasColumnName("name");
            modelBuilder.Entity<Restaurant>().Property(r => r.Cuisine).HasColumnName("cuisine");
            modelBuilder.Entity<Restaurant>().Property(r => r.Rating).HasColumnName("rating");
            modelBuilder.Entity<Restaurant>().Property(r => r.Img).HasColumnName("img");
            
            modelBuilder.Entity<AdminUser>().ToTable("admin_user");
            modelBuilder.Entity<AdminUser>().Property(au => au.Id).HasColumnName("id");
            modelBuilder.Entity<AdminUser>().Property(au => au.Email).HasColumnName("email");
            modelBuilder.Entity<AdminUser>().Property(au => au.Password).HasColumnName("password");

            // Seed default admin
            modelBuilder.Entity<AdminUser>().HasData(
                new AdminUser { Id = 1, Email = "admin@gmail.com", Password = "ADMIN" }
            );
        }
    }
}
