using Microsoft.AspNetCore.Mvc;
using AdminService.Services;
using AdminService.Models;
using Microsoft.AspNetCore.Cors;

namespace AdminService.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [EnableCors("AllowFrontend")]
    public class AdminController : ControllerBase
    {
        private readonly IAdminService _adminService;

        public AdminController(IAdminService adminService)
        {
            _adminService = adminService;
        }

        [HttpPost("login")]
        public IActionResult Login([FromBody] AdminUser loginRequest)
        {
            var user = _adminService.Login(loginRequest.Email, loginRequest.Password);
            if (user != null)
            {
                return Ok(new { Message = "Login successful", User = user });
            }
            return Unauthorized(new { Message = "Invalid credentials" });
        }

        [HttpGet("restaurants")]
        public ActionResult<List<Restaurant>> GetRestaurants()
        {
            return _adminService.GetAllRestaurants();
        }

        [HttpGet("restaurants/{id}")]
        public ActionResult<Restaurant> GetRestaurant(int id)
        {
            var restaurant = _adminService.GetRestaurantById(id);
            if (restaurant == null)
            {
                return NotFound();
            }
            return restaurant;
        }

        [HttpPost("restaurants")]
        public ActionResult<Restaurant> AddRestaurant([FromBody] Restaurant restaurant)
        {
            var created = _adminService.AddRestaurant(restaurant);
            return CreatedAtAction(nameof(GetRestaurant), new { id = created.Id }, created);
        }

        [HttpPut("restaurants/{id}")]
        public IActionResult UpdateRestaurant(int id, [FromBody] Restaurant restaurant)
        {
            var updated = _adminService.UpdateRestaurant(id, restaurant);
            if (updated == null)
            {
                return NotFound();
            }
            return Ok(updated);
        }

        [HttpDelete("restaurants/{id}")]
        public IActionResult DeleteRestaurant(int id)
        {
            var result = _adminService.DeleteRestaurant(id);
            if (!result)
            {
                return NotFound();
            }
            return NoContent();
        }
    }
}
