namespace AdminService.Models
{
    public class Restaurant
    {
        public int Id { get; set; }
        public required string Name { get; set; }
        public required string Address { get; set; }
        public required string ContactNumber { get; set; }
        public int OwnerId { get; set; }
        public required string Cuisine { get; set; }
        public double Rating { get; set; }
        public required string Img { get; set; }
    }
}
