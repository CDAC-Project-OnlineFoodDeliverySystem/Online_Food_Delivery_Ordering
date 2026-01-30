using AdminService.Models;

namespace AdminService.Services
{
    public interface IAdminService
    {
        AdminUser Login(string email, string password);
        List<Restaurant> GetAllRestaurants();
        Restaurant GetRestaurantById(int id);
        Restaurant AddRestaurant(Restaurant restaurant);
        Restaurant UpdateRestaurant(int id, Restaurant restaurant);
        bool DeleteRestaurant(int id);
    }
}
