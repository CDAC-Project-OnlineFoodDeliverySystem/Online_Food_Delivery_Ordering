namespace AdminService.Models
{
    public class AdminUser
    {
        public int Id { get; set; }
        public required string Email { get; set; }
        public required string Password { get; set; }
    }
}
