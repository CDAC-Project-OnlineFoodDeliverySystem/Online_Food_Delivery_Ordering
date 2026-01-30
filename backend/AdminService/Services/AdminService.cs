using AdminService.Data;
using AdminService.Models;
using Microsoft.EntityFrameworkCore;

namespace AdminService.Services
{
    public class AdminService : IAdminService
    {
        private readonly AdminDbContext _context;

        public AdminService(AdminDbContext context)
        {
            _context = context;
        }

        public AdminUser Login(string email, string password)
        {
            return _context.AdminUsers.FirstOrDefault(u => u.Email == email && u.Password == password);
        }

        public List<Restaurant> GetAllRestaurants()
        {
            return _context.Restaurants.ToList();
        }

        public Restaurant GetRestaurantById(int id)
        {
            return _context.Restaurants.Find(id);
        }

        public Restaurant AddRestaurant(Restaurant restaurant)
        {
            _context.Restaurants.Add(restaurant);
            _context.SaveChanges();
            return restaurant;
        }

        public Restaurant UpdateRestaurant(int id, Restaurant restaurant)
        {
            var existing = _context.Restaurants.Find(id);
            if (existing != null)
            {
                existing.Name = restaurant.Name;
                existing.Address = restaurant.Address;
                existing.ContactNumber = restaurant.ContactNumber;
                existing.OwnerId = restaurant.OwnerId;
                existing.Cuisine = restaurant.Cuisine;
                existing.Rating = restaurant.Rating;
                existing.Img = restaurant.Img;
                _context.SaveChanges();
                return existing;
            }
            return null;
        }

        public bool DeleteRestaurant(int id)
        {
            var existing = _context.Restaurants.Find(id);
            if (existing != null)
            {
                // Delete dependent menu items first to avoid FK constraint violation
                _context.Database.ExecuteSqlRaw("DELETE FROM menu_item WHERE restaurant_id = {0}", id);

                _context.Restaurants.Remove(existing);
                _context.SaveChanges();
                return true;
            }
            return false;
        }
    }
}
